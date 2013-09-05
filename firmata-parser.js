var util = require("util");
var events = require('events');
var Parser = require('midi-parser');

var FirmataParser = module.exports = function () {
  if (!(this instanceof FirmataParser)) {
    return new FirmataParser();
  }
  events.EventEmitter.call(this);
  this.parser = new Parser();
};

util.inherits(FirmataParser, events.EventEmitter);

FirmataParser.prototype.write = function (data) {
  this.parser.write(data);
};

var msg = FirmataParser.msg = {
  reportFirmware: 0x79,
  firmwareVersionMajor: 0,
  firmwareVersionMinor: 1,
  REPORT_VERSION: 0xF9,
  FIRMATA_VERSION_MAJOR: 2,
  FIRMATA_VERSION_MINOR: 3
};

util._extend(msg, Parser.msg);

FirmataParser.firmataVersion = function () {
  return new Buffer([
    msg.REPORT_VERSION,
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
