var sinon = require('sinon');
var FirmataParser = require('../firmata-parser');
var Parser = require('midi-parser');
var msg = FirmataParser.msg;

module.exports['.firmataVersion'] = function (test) {
  var version = FirmataParser.firmataVersion();
  test.deepEqual(version, Buffer([msg.REPORT_VERSION, 2, 3]), 'Firmata Version 2.3');
  test.done();
};

module.exports['.firmwareVersion'] = function (test) {
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
