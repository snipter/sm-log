var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var FirebaseOutput = require('../lib/outputs/firebaseOutput.js');

describe('FirebaseOutput()', function(output){
	
	var output = null;
	var demoDate = new Date('2016-07-25T21:17:56.608Z');
	var demoRecord = {
		 line: 1
		,level: 1
		,data: {some: 'data'}
		,module: 'someModule'
		,date: demoDate
	}
	var demoProject = 'demoProject';
	var demoId = 'demo:id';
	var demoAuth = {
		apiKey: "AIzaSyAeavaRfFKt1L3hLXh2QswqXXY7X6I16Mg",
		authDomain: "smart-app-std.firebaseapp.com",
		databaseURL: "https://smart-app-std.firebaseio.com",
		storageBucket: "smart-app-std.appspot.com"
	};
	var demoMeta = {
		 ip: '192.168.10.1'
		,mac: 'aa:bb:cc:dd:ee:ff'
	}

	beforeEach(function(){
		output = new FirebaseOutput(demoProject, demoId, demoAuth);
	});

	describe('log()', function(){
		it('shoud log to firebase', function(){
			output.log(demoRecord);
		});
	});

	describe('meta()', function(){
		it('shoud set meta', function(){
			output.meta(demoMeta);
		});
	});

});