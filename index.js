var Log = require('./log/log.js');

var ConsoleOutput = require('./outputs/console.output.js');
var FileOutput = require('./outputs/file.output.js');
var FirebaseOutput = require('./outputs/firebase.output.js');

var shared = new Log();

shared.Log = Log;
shared.ConsoleOutput = ConsoleOutput;
shared.FileOutput = FileOutput;
shared.FirebaseOutput = FirebaseOutput;

shared.addOutput(new ConsoleOutput());

module.exports = shared;