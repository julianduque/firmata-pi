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

describe['midiCallbacks'] = {

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
  }

  // From Firmata.h on arduino firmata
  // #define SYSTEM_RESET            0xFF // reset from MIDI

  // extended command set using sysex (0-127/0x00-0x7F)
  /* 0x00-0x0F reserved for user-defined commands */
  // #define SERVO_CONFIG            0x70 // set max angle, minPulse, maxPulse, freq
  // #define STRING_DATA             0x71 // a string message with 14-bits per char
  // #define SHIFT_DATA              0x75 // a bitstream to/from a shift register
  // #define I2C_REQUEST             0x76 // send an I2C read/write request
  // #define I2C_REPLY               0x77 // a reply to an I2C read request
  // #define I2C_CONFIG              0x78 // config I2C settings such as delay times and power pins
  // #define EXTENDED_ANALOG         0x6F // analog write (PWM, Servo, etc) to any pin
  // #define PIN_STATE_QUERY         0x6D // ask for a pin's current mode and value
  // #define PIN_STATE_RESPONSE      0x6E // reply with pin's current mode and value
  // #define CAPABILITY_QUERY        0x6B // ask for supported modes and resolution of all pins
  // #define CAPABILITY_RESPONSE     0x6C // reply with supported modes and resolution
  // #define ANALOG_MAPPING_QUERY    0x69 // ask for mapping of analog to pin numbers
  // #define ANALOG_MAPPING_RESPONSE 0x6A // reply with mapping info
  // #define SAMPLING_INTERVAL       0x7A // set the poll rate of the main loop

};