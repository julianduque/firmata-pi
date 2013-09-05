var util = require("util");
var events = require('events');
var Parser = require('midi-parser');

var FirmataParser = module.exports = function () {
  if (!(this instanceof FirmataParser)) {
    return new FirmataParser();
  }
  events.EventEmitter.call(this);
  this.parser = new Parser();
  this.bindEvents();
};

util.inherits(FirmataParser, events.EventEmitter);

var msg = FirmataParser.msg = {
  reportFirmware: 0x79,
  firmwareVersionMajor: 0,
  firmwareVersionMinor: 1,
  reportVersion: 0xF9,
  FIRMATA_VERSION_MAJOR: 2,
  FIRMATA_VERSION_MINOR: 3,
  digitalMessage: 0x90, // 144
  analogMessage: 0xE0, // 224
  setPinMode: 0xF4, // 244
  startSysex: 0xF0, // 240
  endSysex: 0xF7 // 247
};

var midiCallbacks = {};

FirmataParser.prototype.write = function (data) {
  this.parser.write(data);
};

FirmataParser.prototype.bindEvents = function (data) {
  this.parser.on('midi', function (cmd, channel, data) {
    if (midiCallbacks[cmd]) {
      midiCallbacks[cmd].call(this, channel, data);
    }
  }.bind(this));

  this.parser.on('sysex', function (cmd, data) {

  }.bind(this));
};

// callbacks

midiCallbacks[msg.reportVersion] = function () {
  this.emit('reportVersion');
};

midiCallbacks[msg.analogMessage] = function (pin, data) {
  this.emit('analogMessage', pin, Parser.decodeValue(data)[0]);
};

midiCallbacks[msg.digitalMessage] = function (pin, data) {
  this.emit('digitalMessage', pin, Parser.decodeValue(data)[0]);
};

midiCallbacks[msg.setPinMode] = function (meh, data) {
  this.emit('setPinMode', data[0], data[1]);
};

// static methods
FirmataParser.firmataVersion = function () {
  return new Buffer([
    msg.reportVersion,
    msg.FIRMATA_VERSION_MAJOR,
    msg.FIRMATA_VERSION_MINOR
  ]);
};

FirmataParser.firmwareVersion = function () {
  var packet = [
    Buffer([
      msg.startSysex,
      msg.reportFirmware,
      msg.firmwareVersionMajor,
      msg.firmwareVersionMinor
    ]),
    Parser.encodeString("firmata-pi"),
    Buffer([msg.endSysex])
  ];
  return Buffer.concat(packet);
};
