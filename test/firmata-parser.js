var sinon = require('sinon');
var FirmataParser = require('../firmata-parser');
var Parser = require('midi-parser');
var msg = FirmataParser.msg;

var describe = module.exports;

describe['.firmataVersion'] = function (test) {
  var version = FirmataParser.firmataVersion();
  test.deepEqual(version, Buffer([msg.reportVersion, 2, 3]), 'Firmata Version 2.3');
  test.done();
};

describe['.firmwareVersion'] = function (test) {
  var data = FirmataParser.firmwareVersion();

  var expected = Buffer([
    msg.reportFirmware,
    msg.firmwareVersionMajor,
    msg.firmwareVersionMinor
  ]);

  // ignore the first byte sysex start
  test.deepEqual(data.slice(1, 4), expected, 'Firmware Version 0.1');

  // ignore the last byte sysex end
  var name = Parser.decodeString(data.slice(4, -1));
  test.equal(name, "firmata-pi", "Firmware Name");
  test.done();
};

describe['callbacks'] = {

  setUp: function (cb) {
    this.firmata = new FirmataParser();
    cb();
  },

  reportVersion: function (test) {
    var spy = sinon.spy();
    this.firmata.on('reportVersion', spy);
    this.firmata.write([msg.reportVersion]);
    test.equal(spy.callCount, 1);
    test.done();
  },

  analogMessage: function (test) {
    var spy = sinon.spy();
    this.firmata.on('analogMessage', spy);
    var pin = 2;
    var value = 245;
    var packet = Buffer.concat([
      Buffer([msg.analogMessage + pin]),
      Parser.encodeValue([value])
    ]);
    this.firmata.write(packet);
    test.ok(spy.calledWith(pin, value));
    test.done();
  },

  digitalMessage: function (test) {
    var spy = sinon.spy();
    this.firmata.on('digitalMessage', spy);
    var pin = 2;
    var value = 245;
    var packet = Buffer.concat([
      Buffer([msg.digitalMessage + pin]),
      Parser.encodeValue([value])
    ]);
    this.firmata.write(packet);
    test.ok(spy.calledWith(pin, value));
    test.done();
  },

  setPinMode: function (test) {
    var spy = sinon.spy();
    this.firmata.on('setPinMode', spy);
    var pin = 4;
    var mode = 1; //output
    this.firmata.write([msg.setPinMode, pin, mode]);
    test.ok(spy.calledWith(pin, mode));
    test.done();
  },

  systemReset: function (test) {
    var spy = sinon.spy();
    this.firmata.on('systemReset', spy);
    this.firmata.write([msg.systemReset]);
    test.equal(spy.callCount, 1);
    test.done();
  },

  reportAnalog: function (test) {
    var spy = sinon.spy();
    this.firmata.on('reportAnalog', spy);
    var pin = 4;
    var state = 1; //report
    this.firmata.write([msg.reportAnalog + pin, state]);
    test.ok(spy.calledWith(pin, state));
    test.done();
  },

  reportDigital: function (test) {
    var spy = sinon.spy();
    this.firmata.on('reportDigital', spy);
    var pin = 4;
    var state = 1; //report
    this.firmata.write([msg.reportDigital + pin, state]);
    test.ok(spy.calledWith(pin, state));
    test.done();
  },

  reportFirmware: function (test) {
    var spy = sinon.spy();
    this.firmata.on('reportFirmware', spy);
    this.firmata.write([msg.startSysex, msg.reportFirmware, msg.endSysex]);
    test.equal(spy.callCount, 1);
    test.done();
  },

  stringData: function (test) {
    var spy = sinon.spy();
    this.firmata.on('stringData', spy);
    var message = "H! how are you today?";
    this.firmata.write([msg.startSysex, msg.stringData]);
    this.firmata.write(Parser.encodeString(message));
    this.firmata.write([msg.endSysex]);
    test.ok(spy.calledWith(message));
    test.done();
  }
};