var FirmataParser = require('./firmata-parser');
var util = require('util');
var Duplex = require('stream').Duplex;

var FirmataPi = module.exports = function (opt) {
  if (!(this instanceof FirmataPi)) {
    return new FirmataPi(opt);
  }
  Duplex.call(this, opt);
  this.firmata = new FirmataParser();

  this.emitFirmataVersion();
  this.emitFirmwareVersion();
};

util.inherits(FirmataPi, Duplex);

FirmataPi.prototype._read = function (size) {
  // start reading
};

FirmataPi.prototype._write = function (chunk, encoding, cb) {
  this.firmata.write(chunk);
  cb(null);
};

FirmataPi.prototype.emitFirmataVersion = function () {
  this.push(FirmataParser.firmataVersion());
};

FirmataPi.prototype.emitFirmwareVersion = function () {
  this.push(FirmataParser.firmwareVersion());
};

