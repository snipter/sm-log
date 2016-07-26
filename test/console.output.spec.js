var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var ConsoleOutput = require('../outputs/console.output.js');

describe('ConsoleOutput()', function(){

	var output = null;

	beforeEach(function(){
		output = new ConsoleOutput();
	});

	describe('logToConsole()', function(){

		var demoDate = new Date('2016-07-25T21:17:56.608Z');
		var demoRecord = {
			 line: 1
			,level: 1
			,data: {some: 'data'}
			,module: 'someModule'
			,date: demoDate
		}
		var demoRecordStr = '[2016-07-25T21:17:56Z][D][someModule][1]: {"some":"data"}';
		var demoRecordStrNoDate = '[D][someModule][1]: {"some":"data"}';
		var demoRecordStrNoLine = '[2016-07-25T21:17:56Z][D][someModule]: {"some":"data"}';

		it('shoud log to console with colors', function(){
			var called = false;

			output.logToConsoleWithColor = function(text, level){
				called = true;
				expect(text).to.be.equal(demoRecordStr);
				expect(level).to.be.equal(demoRecord.level);
			}
			output.log(demoRecord);

			expect(called).to.be.ok;
		});

		it('shoud log to console without colors', function(){
			var called = false;

			output.colors = false;
			output.logToConsole = function(text){
				called = true;
				expect(text).to.be.equal(demoRecordStr);
			}
			output.log(demoRecord);

			expect(called).to.be.ok;

		});

		it('shoud log without date', function(){
			var called = false;

			output.date = false;
			output.logToConsoleWithColor = function(text, level){
				called = true;
				expect(text).to.be.equal(demoRecordStrNoDate);
				expect(level).to.be.equal(demoRecord.level);
			}
			output.log(demoRecord);

			expect(called).to.be.ok;
		});

		it('shoud log without line', function(){
			var called = false;

			output.line = false;
			output.logToConsoleWithColor = function(text, level){
				called = true;
				expect(text).to.be.equal(demoRecordStrNoLine);
				expect(level).to.be.equal(demoRecord.level);
			}
			output.log(demoRecord);

			expect(called).to.be.ok;
		});

		it('shoud not log when dissabled', function(){
			var called = false;

			output.enabled = false
			output.logToConsole = function(text){
				called = true;
			}
			output.logToConsoleWithColor = function(text, level){
				called = true;
			}
			output.log(demoRecord);

			expect(called).to.be.not.ok;
		});

		it('shoud not log when level is higer', function(){
			var called = false;

			output.level = demoRecord.level + 1;
			output.logToConsole = function(text){
				called = true;
			}
			output.logToConsoleWithColor = function(text, level){
				called = true;
			}
			output.log(demoRecord);

			expect(called).to.be.not.ok;
		});

		it('shoud log when levels the same', function(){
			var called = false;

			output.level = demoRecord.level;
			output.logToConsoleWithColor = function(text, level){
				called = true;
				expect(text).to.be.equal(demoRecordStr);
				expect(level).to.be.equal(demoRecord.level);
			}
			output.log(demoRecord);

			expect(called).to.be.ok;
		});
		
	});

});