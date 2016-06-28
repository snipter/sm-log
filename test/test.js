var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var log = require('../index.js');

describe('sm-log', function(){
	describe('basic tests', function(){

		it('shoud be not empty', function(){
			assert(log, 'log is empty');
		});

		it('shoud have required functions', function(){
			expect(log.enabled).to.be.an('function');
			expect(log.level).to.be.an('function');
			expect(log.showDate).to.be.an('function');
			expect(log.showLine).to.be.an('function');
			expect(log.log).to.be.an('function');
			expect(log.error).to.be.an('function');
			expect(log.err).to.be.an('function');
			expect(log.e).to.be.an('function');
			expect(log.warning).to.be.an('function');
			expect(log.warn).to.be.an('function');
			expect(log.w).to.be.an('function');
			expect(log.info).to.be.an('function');
			expect(log.i).to.be.an('function');
			expect(log.debug).to.be.an('function');
			expect(log.d).to.be.an('function');
			expect(log.trace).to.be.an('function');
			expect(log.t).to.be.an('function');
		});

	})
});