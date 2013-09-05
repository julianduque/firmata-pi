var sinon = require('sinon');
var FirmataPi = require('../firmata-pi');
var Parser = require('midi-parser');
var msg = FirmataPi.msg;

module.exports['Report Versions On Startup'] = function (test) {
  var firmata = sinon.spy(FirmataPi.prototype, 'emitFirmataVersion');
  var firmware = sinon.spy(FirmataPi.prototype, 'emitFirmwareVersion');

  var board = new FirmataPi();

  test.ok(firmata.calledOnce);
  test.ok(firmware.calledOnce);

  firmata.restore();
  firmware.restore();
  test.done();
};


// from the standard firmata tests
// void processMessage(const byte* message, size_t length)
// {
//   FakeStream stream;
//   Firmata.begin(stream);

//   for (size_t i = 0; i < length; i++)
//   {
//     stream.nextByte(message[i]);
//     Firmata.processInput();
//   }
// }

// byte _digitalPort;
// int _digitalPortValue;
// void writeToDigitalPort(byte port, int value)
// {
//   _digitalPort = port;
//   _digitalPortValue = value;
// }

// void setupDigitalPort() {
//   _digitalPort = 0;
//   _digitalPortValue = 0;
// }

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