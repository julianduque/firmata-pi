var Firmata = require('./firmata-parser');
var util = require('util');
var Duplex = require('stream').Duplex;


// Lets pretend to be standard firmata!
var FirmataPi = module.exports = function (opt) {
  if (!(this instanceof FirmataPi)) {
    return new FirmataPi(opt);
  }
  Duplex.call(this, opt);
  this.firmata = new Firmata();

  this.firmataVersion();
  this.firmwareVersion();

  this.bindEvents();
};

util.inherits(FirmataPi, Duplex);

FirmataPi.prototype._read = function (size) {
  // start reading
};

FirmataPi.prototype._write = function (chunk, encoding, cb) {
  this.firmata.write(chunk);
  cb(null);
};

FirmataPi.prototype.bindEvents = function () {
  this.firmata.on('reportVersion', this.firmataVersion.bind(this));
  this.firmata.on('reportFirmware', this.firmwareVersion.bind(this));
  this.firmata.on('capabilityQuery', this.capabilityResponse.bind(this));

};

FirmataPi.prototype.firmataVersion = function () {
  this.push(Firmata.firmataVersion());
};

FirmataPi.prototype.firmwareVersion = function () {
  this.push(Firmata.firmwareVersion());
};

FirmataPi.prototype.capabilityResponse = function () {
  var pins = {};
  this.push(Firmata.capabilityResponse(pins));
};
