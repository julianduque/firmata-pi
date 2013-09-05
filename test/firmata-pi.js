var sinon = require('sinon');
var FirmataPi = require('../firmata-pi');

var describe = module.exports;

describe['Report Versions On Startup'] = function (test) {
  var firmata = sinon.spy(FirmataPi.prototype, 'firmataVersion');
  var firmware = sinon.spy(FirmataPi.prototype, 'firmwareVersion');

  var board = new FirmataPi();

  test.ok(firmata.calledOnce);
  test.ok(firmware.calledOnce);

  firmata.restore();
  firmware.restore();
  test.done();
};

// Callbacks also called during startup
describe['reportVersion, firmataVersion'] = function (test) {
  var spy = sinon.spy(FirmataPi.prototype, 'firmataVersion');
  var board = new FirmataPi();
  board.firmata.emit('reportVersion');
  test.ok(spy.calledTwice); // once on startup once now
  spy.restore();
  test.done();
};

describe['reportFirmware, firmwareVersion'] = function (test) {
  var spy = sinon.spy(FirmataPi.prototype, 'firmwareVersion');
  var board = new FirmataPi();
  board.firmata.emit('reportFirmware');
  test.ok(spy.calledTwice); // once on startup once now
  spy.restore();
  test.done();
};

// Callbacks for normal operations
describe['capabilityQuery, capabilityResponse'] = function (test) {
  var spy = sinon.spy(FirmataPi.prototype, 'capabilityResponse');
  var board = new FirmataPi();
  board.firmata.emit('capabilityQuery');
  test.ok(spy.calledOnce);
  spy.restore();
  test.done();
};

// test(processWriteDigital_0)
// {
//   setupDigitalPort();
//   Firmata.attach(DIGITAL_MESSAGE, writeToDigitalPort);

//   byte message[] = { DIGITAL_MESSAGE, 0, 0 };
//   processMessage(message, 3);

//   assertEqual(0, _digitalPortValue);
// }

// test(processWriteDigital_127)
// {
//   setupDigitalPort();
//   Firmata.attach(DIGITAL_MESSAGE, writeToDigitalPort);

//   byte message[] = { DIGITAL_MESSAGE, 127, 0 };
//   processMessage(message, 3);

//   assertEqual(127, _digitalPortValue);
// }

// test(processWriteDigital_128)
// {
//   setupDigitalPort();
//   Firmata.attach(DIGITAL_MESSAGE, writeToDigitalPort);

//   byte message[] = { DIGITAL_MESSAGE, 0, 1 };
//   processMessage(message, 3);

//   assertEqual(128, _digitalPortValue);
// }

// test(processWriteLargestDigitalValue)
// {
//   setupDigitalPort();
//   Firmata.attach(DIGITAL_MESSAGE, writeToDigitalPort);

//   byte message[] = { DIGITAL_MESSAGE, 0x7F, 0x7F };
//   processMessage(message, 3);

//   // Maximum of 14 bits can be set (B0011111111111111)
//   assertEqual(0x3FFF, _digitalPortValue);
// }

// test(defaultDigitalWritePortIsZero)
// {
//   setupDigitalPort();
//   Firmata.attach(DIGITAL_MESSAGE, writeToDigitalPort);

//   byte message[] = { DIGITAL_MESSAGE, 0, 0 };
//   processMessage(message, 3);

//   assertEqual(0, _digitalPort);
// }

// test(specifiedDigitalWritePort)
// {
//   setupDigitalPort();
//   Firmata.attach(DIGITAL_MESSAGE, writeToDigitalPort);

//   byte message[] = { DIGITAL_MESSAGE + 1, 0, 0 };
//   processMessage(message, 3);

//   assertEqual(1, _digitalPort);
// }