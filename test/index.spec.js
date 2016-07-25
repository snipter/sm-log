var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var sharedLog = require('../index.js');

var Log = require('../log/log.js');
var ConsoleOutput = require('../outputs/console.output.js');
var FileOutput = require('../outputs/file.output.js');
var FirebaseOutput = require('../outputs/firebase.output.js');

describe('Index', function(){

	it('shoud have log instance', function(){
		expect(sharedLog.Log).to.be.equal(Log);
	});

	it('shoud have all outputs', function(){
		expect(sharedLog.ConsoleOutput).to.be.equal(ConsoleOutput);
		expect(sharedLog.FileOutput).to.be.equal(FileOutput);
		expect(sharedLog.FirebaseOutput).to.be.equal(FirebaseOutput);
	});

	it('shoud have console output added', function(){
		expect(sharedLog.outputs.length).to.be.equal(1);
		expect(sharedLog.outputs[0]).to.be.instanceof(ConsoleOutput);
	});

});