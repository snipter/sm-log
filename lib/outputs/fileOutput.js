/*
========================
File Output

Allow you output your log to the file
========================
*/

var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');


function fileOutput(){
	this.enabled = true;
}

fileOutput.prototype = {
	log: function(logData){
		
	}
}

/*============ Epxorts ============*/

module.exports = fileOutput;


/*============ Files ============*/
// # File
// {type: 'file', name: '%yyyy.mm.dd_HH.MM%.log', path: 'logs', level: 'error'}
// addOutput: function(opt){
//     if(!opt) throw new Error('output options not set');
//     if(opt.type === undefined)  throw new Error('output type not set');
//     if(opt.type === 'file'){
//         if(opt.level === undefined) opt.level = 'd'
//         if(opt.line === undefined) opt.line = true
//         if(opt.date === undefined) opt.date = true
//         if(opt.name === undefined) opt.name = 'logfile'
//         if(opt.path === undefined) opt.path = ''
//     }
//     this._outputs.push(opt);
// },

// writeToOutput: function(logDate){
//     var self = this;
//     _.each(this._outputs, function(output_data){
//         if(output_data.type == 'file'){
//             self.writeToOutputFile(logDate, output_data)
//         }
//     })
// },

// writeToOutputFile: function(logDate, output_data){
//     if(this.logLevelToInt(logDate.level) < this.logLevelToInt(output_data.level)) return;
//     var file_path = this.processFilePath(output_data.path);
//     var file_name = this.processFileNameShortcodes(output_data.name);
//     var full_file_path = path.normalize(file_path+'/'+file_name);
//     this.writeToFile(full_file_path, logDate.text);
// },

// processFileNameShortcodes: function(file_name){
//     file_name = this.processDateShortcodes(file_name);
//     return file_name;
// },

// processDateShortcodes: function(file_name){
//     var date_reg = /%(.+?)%/g;
//     var matches = date_reg.execAll(file_name);
//     if(!matches || matches.length == 0) return file_name;
//     var d = new Date();
//     _.each(matches, function(match){
//         var shortcode = match[0];
//         var date_format_str = match[1];
//         file_name = file_name.replace(shortcode, dateFormat(d, date_format_str));
//     });
//     return file_name;
// },

// processFilePath: function(file_path){
//     if(fs.existsSync(file_path)) return file_path;
//     mkdirp.sync(file_path);
//     return file_path;
// },

// writeToFile: function(file_path, text){
//     if(!fs.existsSync(file_path)){
//         fs.writeFile(file_path, text, function(err){if(err) console.log(err)});
//     }else{
//         fs.appendFile(file_path, "\r\n" + text, function(err){if(err) console.log(err)});
//     }
// },

// createLog: function(){
//     return new Log();
// }