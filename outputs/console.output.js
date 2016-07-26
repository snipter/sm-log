var colors = require("colors");
var utils = require('../utils/utils.js');

/*============ Console output ============*/

function ConsoleOutput(){
	this.enabled = true;
	this.colors = true;
	this.date = true;
	this.line = true;
	this.level = utils.levels.trace;
}

ConsoleOutput.prototype = {

	log: function(recordData){
		if(this.enabled === false) return;
		if(this.level > recordData.level) return;
		var recordDataStr = utils.logRecordDataToStr(recordData, {date: this.date, line: this.line});
		if(this.colors) this.logToConsoleWithColor(recordDataStr, recordData.level);
		else this.logToConsole(recordDataStr);
	},

	logToConsole: function(text){
		console.log(text);
	},

	logToConsoleWithColor: function(text, level){
	    if(level == utils.levels.error) return console.log(text.red);
	    if(level == utils.levels.warn) return console.log(text.yellow);
	    if(level == utils.levels.info) return console.log(text.blue);
	    if(level == utils.levels.debug) return console.log(text.cyan);
	    if(level == utils.levels.trace) return console.log(text.grey);
	    console.log(text);
	}

}

/*============ Epxorts ============*/

module.exports = ConsoleOutput;