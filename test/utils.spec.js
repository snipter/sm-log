var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var utils = require('../utils/utils.js');

describe('Utils', function(){

	describe('logRecordDataToStr()', function(){
		var demoDate = new Date('2016-07-25T21:17:56.608Z');
		var demoRecord = {
			 data: {some: 'data'}
			,level: utils.levels.debug
			,date: demoDate
			,module: 'demoModule'
			,line: 123
		}
		var demoRecordStrFull = '[2016-07-25T21:17:56Z][D][demoModule][123]: {"some":"data"}';
		var demoRecordStrNoDate = '[D][demoModule][123]: {"some":"data"}';
		var demoRecordStrNoLine = '[2016-07-25T21:17:56Z][D][demoModule]: {"some":"data"}';
		var demoRecordStrNoDateNoLine = '[D][demoModule]: {"some":"data"}';

		it('shoud return undefined', function(){
			expect(utils.logRecordDataToStr()).to.be.undefined;
		});
		it('shoud return correct value', function(){
			expect(utils.logRecordDataToStr(demoRecord)).to.be.equal(demoRecordStrFull);
			expect(utils.logRecordDataToStr(demoRecord, {})).to.be.equal(demoRecordStrFull);
		});
		it('shoud return correct value without date', function(){
			expect(utils.logRecordDataToStr(demoRecord, {date: false})).to.be.equal(demoRecordStrNoDate);
		});
		it('shoud return correct value without line', function(){
			expect(utils.logRecordDataToStr(demoRecord, {line: false})).to.be.equal(demoRecordStrNoLine);
		});
		it('shoud return correct value without date and line', function(){
			expect(utils.logRecordDataToStr(demoRecord, {date: false, line: false})).to.be.equal(demoRecordStrNoDateNoLine);
		});
	});

	describe('dataToStr()', function(){

		it('shoud return correct data str', function(){
			var demoArr = [1, 2, 3, 4, 5];
			var demoArrStr = JSON.stringify(demoArr);
			var demoDate = new Date('2016-07-25T21:17:56.608Z');
			var demoDateStr = '2016-07-25T21:17:56Z';
			var demoObj = {some: 'val'};
			var demoObjStr = JSON.stringify(demoObj);

			function DemoClass(name){
				this.name = name;
				this.circular = this;
			}

			DemoClass.prototype.sayName = function(){
				console.log('my name is: ' + this.name);
			}

			expect(utils.dataToStr()).to.be.deep.equal('undefined');
			expect(utils.dataToStr('some')).to.be.deep.equal('some');
			expect(utils.dataToStr(1)).to.be.deep.equal('1');
			expect(utils.dataToStr(demoArr)).to.be.deep.equal(demoArrStr);
			expect(utils.dataToStr(demoDate)).to.be.deep.equal(demoDateStr);
			expect(utils.dataToStr(demoObj)).to.be.deep.equal(demoObjStr);
			expect(utils.dataToStr(new Error('some error'))).to.be.deep.equal('Error: some error');
			expect(utils.dataToStr(new DemoClass('some name'))).to.be.deep.equal('[object Object]');
		});

	});

	describe('levels', function(){

		it('shoud be an object', function(){
			expect(utils.levels).to.be.an('object');
		});

	})
	
	describe('dateToLogDateStr()', function(){
		it('shoud return empty strring if wrong date', function(){
			expect(utils.dateToLogDateStr()).to.be.equal('');
			expect(utils.dateToLogDateStr(function(){})).to.be.equal('');
		});
		it('shoud return correct date', function(){
			var inputDateStr = 'Fri Mar 30 2012 03:00:00 GMT+0300 (EEST)';
			var expectedDateStr = '2012-03-30T00:00:00Z';
			var date = new Date(inputDateStr);
			var dateStr = utils.dateToLogDateStr(date);
			expect(dateStr).to.be.equal(expectedDateStr);
		});

	});

	describe('strToLogLevel()', function(){

		it('shoud return correct value', function(){
			expect(utils.strToLogLevel()).to.be.equal(utils.levels.trace);
			expect(utils.strToLogLevel(function(){})).to.be.equal(utils.levels.trace);
			expect(utils.strToLogLevel(4)).to.be.equal(utils.levels.error);

			expect(utils.strToLogLevel("error")).to.be.equal(utils.levels.error);
			expect(utils.strToLogLevel("err")).to.be.equal(utils.levels.error);
			expect(utils.strToLogLevel("e")).to.be.equal(utils.levels.error);

			expect(utils.strToLogLevel("warning")).to.be.equal(utils.levels.warning);
			expect(utils.strToLogLevel("warn")).to.be.equal(utils.levels.warning);
			expect(utils.strToLogLevel("w")).to.be.equal(utils.levels.warning);

			expect(utils.strToLogLevel("inform")).to.be.equal(utils.levels.info);
			expect(utils.strToLogLevel("info")).to.be.equal(utils.levels.info);
			expect(utils.strToLogLevel("i")).to.be.equal(utils.levels.info);

			expect(utils.strToLogLevel("debug")).to.be.equal(utils.levels.debug);
			expect(utils.strToLogLevel("d")).to.be.equal(utils.levels.debug);

			expect(utils.strToLogLevel("trace")).to.be.equal(utils.levels.trace);
			expect(utils.strToLogLevel("t")).to.be.equal(utils.levels.trace);

			expect(utils.strToLogLevel("some")).to.be.equal(utils.levels.trace);
		});
		
	});

	describe('logLevelToSymbol()', function(){
		it('shoud return correct value', function(){
			expect(utils.logLevelToSymbol(utils.levels.error)).to.be.equal('E');
			expect(utils.logLevelToSymbol(utils.levels.warn)).to.be.equal('W');
			expect(utils.logLevelToSymbol(utils.levels.info)).to.be.equal('I');
			expect(utils.logLevelToSymbol(utils.levels.debug)).to.be.equal('D');
			expect(utils.logLevelToSymbol(utils.levels.trace)).to.be.equal('T');
			expect(utils.logLevelToSymbol(234523)).to.be.equal('');
			expect(utils.logLevelToSymbol()).to.be.equal('');
		});
	});

})