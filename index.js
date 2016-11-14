const Log = require('./lib/log.js');

const ConsoleOutput = require('./lib/outputs/consoleOutput.js');
const FileOutput = require('./lib/outputs/fileOutput.js');
const FirebaseOutput = require('./lib/outputs/firebaseOutput.js');
const StackDriveOutput = require('./lib/outputs/stackDriveOutput.js')

var shared = new Log();

shared.Log = Log;
shared.ConsoleOutput = ConsoleOutput;
shared.FileOutput = FileOutput;
shared.FirebaseOutput = FirebaseOutput;
shared.StackDriveOutput = StackDriveOutput;

shared.addOutput(new ConsoleOutput());

module.exports = shared;