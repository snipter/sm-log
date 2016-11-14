var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var Log = require('../lib/log.js');
var utils = require('../lib/utils.js');


/*============ Tests ============*/

describe('Log', function(){

	function FakeOutput(){

	}

	FakeOutput.prototype.log = function(logRecord){

	}

	var log = null;
	var fakeOutput = null;
	var demoLine = 0;
	var demoLevel = 0;
	var demoModule = 'demoModule';
	var demoData = {demo: 'data'};

	beforeEach(function(){
		log = new Log();
		fakeOutput = new FakeOutput();
	});

	describe('_log()', function(){

		it('shoud log and call cb', function(){
			var logCalled = false;
			var cbCalled = false;

			fakeOutput.log = function(logRecord){
				logCalled = true;
			}
			log.addOutput(fakeOutput);

			log._log(demoLine, demoLevel, demoData, demoModule, function(data){
				expect(data).to.be.deep.equal(demoData);
				cbCalled = true;
			});

			expect(logCalled).to.be.ok;
			expect(cbCalled).to.be.ok;
		});

		it('shoud log without module and with cb', function(){
			var logCalled = false;
			var cbCalled = false;

			fakeOutput.log = function(logRecord){
				logCalled = true;
			}
			log.addOutput(fakeOutput);

			log._log(demoLine, demoLevel, demoData, function(data){
				expect(data).to.be.deep.equal(demoData);
				cbCalled = true;
			});

			expect(logCalled).to.be.ok;
			expect(cbCalled).to.be.ok;
		});

		it('shoud not log when dissabled', function(){
			var called = false;
			log.enabled = false;
			fakeOutput.log = function(logRecord){
				called = true;
			}
			log.addOutput(fakeOutput);
			log._log(demoLine, demoLevel, demoData, demoModule);
			expect(called).to.be.not.ok;
		});

		it('shoud not log when data is empty', function(){
			var called = false;
			fakeOutput.log = function(logRecord){
				called = true;
			}
			log.addOutput(fakeOutput);
			log._log(demoLine, demoLevel);
			expect(called).to.be.not.ok;
		});

	});

	describe('logError()', function(){
		it('shoud log with log level', function(){
			var called = false;
			fakeOutput.log = function(logRecord){
				called = true;
				expect(logRecord.level).to.be.equal(utils.levels.error);
				expect(logRecord.line).to.be.a('number');
			}
			log.addOutput(fakeOutput);
			log.logError(demoData, demoModule);
			expect(called).to.be.ok;
		});
	});

	describe('logWarn()', function(){
		it('shoud log with log level', function(){
			var called = false;
			fakeOutput.log = function(logRecord){
				called = true;
				expect(logRecord.level).to.be.equal(utils.levels.warn);
				expect(logRecord.line).to.be.a('number');
			}
			log.addOutput(fakeOutput);
			log.logWarn(demoData, demoModule);
			expect(called).to.be.ok;
		});
	});

	describe('logInfo()', function(){
		it('shoud log with log level', function(){
			var called = false;
			fakeOutput.log = function(logRecord){
				called = true;
				expect(logRecord.level).to.be.equal(utils.levels.info);
				expect(logRecord.line).to.be.a('number');
			}
			log.addOutput(fakeOutput);
			log.logInfo(demoData, demoModule);
			expect(called).to.be.ok;
		});
	});

	describe('logDebug()', function(){
		it('shoud log with log level', function(){
			var called = false;
			fakeOutput.log = function(logRecord){
				called = true;
				expect(logRecord.level).to.be.equal(utils.levels.debug);
				expect(logRecord.line).to.be.a('number');
			}
			log.addOutput(fakeOutput);
			log.logDebug(demoData, demoModule);
			expect(called).to.be.ok;
		});
	});

	describe('logTrace()', function(){
		it('shoud log with log level', function(){
			var called = false;
			fakeOutput.log = function(logRecord){
				called = true;
				expect(logRecord.level).to.be.equal(utils.levels.trace);
				expect(logRecord.line).to.be.a('number');
			}
			log.addOutput(fakeOutput);
			log.logTrace(demoData, demoModule);
			expect(called).to.be.ok;
		});
	});

	describe('addOutput()', function(){
		it('shoud throw error if output is empty', function(){
			expect(function(){
				log.addOutput();
			}).to.throw('output have to be specified');
		});
		it('shoud throw error if output is empty', function(){
			expect(function(){
				log.addOutput(new Date());
			}).to.throw('output needs to have log() function');
		});
		it('shoud add output', function(){
			var output = new FakeOutput();
			log.addOutput(output);
			expect(log.outputs[0]).to.be.equal(output);
		});
	});

	describe('logToOutpus()', function(){
		it('shoud log to outputs', function(){
			var called = false;
			var fakeLogData = {some: 'data', numbers: [1,2,3,4]};
			var output = new FakeOutput();
			output.log = function(data){
				called = true;
				expect(data).to.be.deep.equal(fakeLogData);
			}
			log.addOutput(output);
			log.logToOutpus(fakeLogData);
			expect(called).to.be.ok;
		});
	});

	describe('on()', function(){

		it('shoud emit without observers', function(){
			log.trace('some');
		});

		it('shoud rise event when log', function(){
			var called = false;
			log.on('log', function(){
				called = true;
			});
			log.trace('some');
			expect(called).to.be.ok;
		});

	});

});