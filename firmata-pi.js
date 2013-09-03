var Parser = require('midi-parser');
var util = require('util');
var Duplex = require('stream').Duplex;

var FirmataPi = module.exports = function (opt) {
  if (!(this instanceof FirmataPi)) {
    return new FirmataPi(opt);
  }
  Duplex.call(this, opt);
  this.parser = new Parser();

  this.emitFirmataVersion();
  this.emitFirmwareVersion();
};

util.inherits(FirmataPi, Duplex);

module.exports.Parser = Parser;

var msg = FirmataPi.msg = {
  REPORT_FIRMWARE: 0x79,
  FIRMWARE_MAJOR: 0,
  FIRMWARE_MINOR: 1,
  REPORT_VERSION: 0xF9,
  FIRMATA_VERSION_MAJOR: 2,
  FIRMATA_VERSION_MINOR: 3
};

util._extend(msg, Parser.msg);

FirmataPi.prototype._read = function (size) {
  // start reading
};

FirmataPi.prototype._write = function (chunk, encoding, cb) {
  this.parser.write(chunk);
  cb(null);
};

FirmataPi.prototype.emitFirmataVersion = function () {
  this.push(new Buffer([
    msg.REPORT_VERSION,
    msg.FIRMATA_VERSION_MAJOR,
    msg.FIRMATA_VERSION_MINOR
  ]));
};

FirmataPi.prototype.emitFirmwareVersion = function () {
  var packet = [
    new Buffer([
      msg.startSysex,
      msg.REPORT_FIRMWARE,
      msg.FIRMWARE_MAJOR,
      msg.FIRMWARE_MINOR,
    ]),
    Parser.encodeString("FirmataPi"),
    new Buffer([msg.endSysex])
  ];
  this.push(Buffer.concat(packet));
};

