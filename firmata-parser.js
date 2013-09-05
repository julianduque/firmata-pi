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
  firmwareVersionMajor: 0,
  firmwareVersionMinor: 1,
  reportVersion: 0xF9,
  FIRMATA_VERSION_MAJOR: 2,
  FIRMATA_VERSION_MINOR: 3,
  digitalMessage: 0x90, // 144
  reportAnalog: 0xC0, // 192
  reportDigital: 0xD0, //208
  analogMessage: 0xE0, // 224
  setPinMode: 0xF4, // 244
  startSysex: 0xF0, // 240
  endSysex: 0xF7, // 247
  systemReset: 0xFF, //255
  capabilityQuery: 0x6B, // SYSEX 107
  stringData: 0x71, // SYSEX 113
  reportFirmware: 0x79, // SYSEX 121
};

var callbacks = {};

FirmataParser.prototype.write = function (data) {
  this.parser.write(data);
};

FirmataParser.prototype.bindEvents = function (data) {
  this.parser.on('midi', function (cmd, channel, data) {
    if (callbacks[cmd]) {
      callbacks[cmd].call(this, channel, data);
    }
  }.bind(this));

  this.parser.on('sysex', function (cmd, data) {
    if (callbacks[cmd]) {
      callbacks[cmd].call(this, data);
    }
  }.bind(this));
};

// Midi callbacks
callbacks[msg.reportVersion] = function () {
  this.emit('reportVersion');
};

callbacks[msg.analogMessage] = function (pin, data) {
  this.emit('analogMessage', pin, Parser.decodeValue(data)[0]);
};

callbacks[msg.digitalMessage] = function (pin, data) {
  this.emit('digitalMessage', pin, Parser.decodeValue(data)[0]);
};

callbacks[msg.setPinMode] = function (meh, data) {
  this.emit('setPinMode', data[0], data[1]);
};

callbacks[msg.systemReset] = function () {
  this.emit('systemReset');
};

callbacks[msg.reportAnalog] = function (pin, data) {
  this.emit('reportAnalog', pin, data[0]);
};

callbacks[msg.reportDigital] = function (pin, data) {
  this.emit('reportDigital', pin, data[0]);
};

// SysEx callbacks
callbacks[msg.reportFirmware] = function () {
  this.emit('reportFirmware');
};

callbacks[msg.stringData] = function (data) {
  this.emit('stringData', Parser.decodeString(data));
};

callbacks[msg.capabilityQuery] = function () {
  this.emit('capabilityQuery');
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

FirmataParser.capabilityResponse = function (pins) {
  return Buffer([
    msg.startSysex,
    msg.capabilityResponse,
    99, // bogus
    msg.endSysex
  ]);
};
