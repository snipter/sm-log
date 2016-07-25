var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var Log = require('../log/log.js');

/*============ Fake output ============*/

function fakeOutput(){

}

fakeOutput.prototype.log = function(){

}

/*============ Tests ============*/

describe('Log', function(){

	var log = null;
	beforeEach(function(){
		log = new Log();
	});

	describe('log()', function(){

		it('shoud return correct data', function(){

		});

		it('shoud call cb with input data', function(){

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
			var output = new fakeOutput();
			log.addOutput(output);
			expect(log.outputs[0]).to.be.equal(output);
		});
	});

	describe('logToOutpus()', function(){
		it('shoud log to outputs', function(){
			var called = false;
			var fakeLogData = {some: 'data', numbers: [1,2,3,4]};
			var output = new fakeOutput();
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