/*

SMLog module for NodeJS

Date formats: http://blog.stevenlevithan.com/archives/date-time-format

*/

/*============ Require ============*/

var colors = require("colors");
var fs = require('fs');
var _ = require("underscore");
var dateFormat = require('dateformat');
var mkdirp = require('mkdirp');
var path = require('path');

/*============ Regex ============*/

RegExp.prototype.execAll = function(string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        var matchArray = [];
        for (i in match) {
            if (parseInt(i) == i) {
                matchArray.push(match[i]);
            }
        }
        matches.push(matchArray);
    }
    return matches;
}

/*============ Object ============*/

Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});


/*============ Log class ============*/

function Log(){
    addLogShortLinks(this);
    this._show_date = false;
    this._show_line = true;
    this._level = 0;
    this._outputs = [];
}

Log.prototype = {
    level: function(level){
        if(level !== undefined){
            this._level = this.logLevelToInt(level);
        }
        return this._level;
    },

    showDate: function(enabled){
        if(enabled !== undefined){
            this._show_date = enabled;
        }
        return this._show_date;
    },

    showLine: function(enabled){
        if(enabled !== undefined){
            this._show_line = enabled;
        }
        return this._show_line;
    },
     
    logError: function(data, module, cb){
        this.log(data, "E", module, cb);
    },
     
    logWarn: function(data, module, cb){
        this.log(data, "W", module, cb);
    },
     
    logInfo: function(data, module, cb){
        this.log(data, "I", module, cb);
    },
     
    logDebug: function(data, module, cb){
        this.log(data, "D", module, cb);
    },
     
    logTrace: function(data, module, cb){
        this.log(data, "T", module, cb);
    },
     
    log: function(data, level, module, cb){
        if(!data) return;
        if(module && (typeof module === "function")) {cb = module; module = null}
        var data_str = typeof data !== "string" ? JSON.stringify(data) : data;

        var line = __stack[2].getLineNumber();
        var text = "";
        if(this._show_date) text += "["+this.todayDateStr()+"]";
        text += "["+level+"]";
        if(module) text += "["+module+"]";
        if(this._show_line) text += "["+line+"]";
        text += ": " + data_str;
        
        if(this._level <= this.logLevelToInt(level)) this.logTextWithLevel(text, level);

        var log_data = {data: data, level: level, module: module, line: line, time: this.now(), text: text};
        this.writeToOutput(log_data);
        this.emit('log', log_data);
        if(cb) cb(data);
    },

    logLevelToInt: function(level){
        if(typeof level === 'number') return level;
        level = level.toLowerCase();
        if(level == "t") return 0;
        if(level == "d") return 1;
        if(level == "i") return 2;
        if(level == "w") return 3;
        if(level == "e") return 4;
        if(level == "trace") return 0;
        if(level == "debug") return 1;
        if(level == "info") return 2;
        if(level == "inform") return 2;
        if(level == "warn") return 3;
        if(level == "warning") return 3;
        if(level == "e") return 4;
        if(level == "err") return 4;
        if(level == "error") return 4;
        return 0;
    },

    logTextWithLevel: function(text, level){
        if(level == "E") return console.log(text.red);
        if(level == "W") return console.log(text.yellow);
        if(level == "I") return console.log(text.blue);
        if(level == "D") return console.log(text.cyan);
        if(level == "T") return console.log(text.grey);
        console.log(text);
    },

    /*============ Time ============*/

    todayDateStr: function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd};
        if(mm<10){mm='0'+mm} 
        today = mm+'/'+dd+'/'+yyyy + ' ' + today.toLocaleTimeString();
        return today;
    },

    now: function(){
        return new Date().getTime();
    },

    /*============ Events ============*/

    on: function(name, cb){
        if(!this.observers) this.observers = [];
        this.observers.push({name: name.toLowerCase(), cb: cb});
    },

    emit: function(name, data){
        if(!this.observers) return;
        name = name.toLowerCase();
        _.each(this.observers, function(obs){
            if(obs.name == name) obs.cb(data);
        })
    },

    /*============ Files ============*/
    // # File
    // {type: 'file', name: '%yyyy.mm.dd_HH.MM%.log', path: 'logs', level: 'error'}
    addOutput: function(opt){
        if(!opt) throw new Error('output options not set');
        if(opt.type === undefined)  throw new Error('output type not set');
        if(opt.type === 'file'){
            if(opt.level === undefined) opt.level = 'd'
            if(opt.line === undefined) opt.line = true
            if(opt.date === undefined) opt.date = true
            if(opt.name === undefined) opt.name = 'logfile'
            if(opt.path === undefined) opt.path = ''
        }
        this._outputs.push(opt);
    },

    writeToOutput: function(log_data){
        var self = this;
        _.each(this._outputs, function(output_data){
            if(output_data.type == 'file'){
                self.writeToOutputFile(log_data, output_data)
            }
        })
    },

    writeToOutputFile: function(log_data, output_data){
        if(this.logLevelToInt(log_data.level) < this.logLevelToInt(output_data.level)) return;
        var file_path = this.processFilePath(output_data.path);
        var file_name = this.processFileNameShortcodes(output_data.name);
        var full_file_path = path.normalize(file_path+'/'+file_name);
        this.writeToFile(full_file_path, log_data.text);
    },

    processFileNameShortcodes: function(file_name){
        file_name = this.processDateShortcodes(file_name);
        return file_name;
    },

    processDateShortcodes: function(file_name){
        var date_reg = /%(.+?)%/g;
        var matches = date_reg.execAll(file_name);
        if(!matches || matches.length == 0) return file_name;
        var d = new Date();
        _.each(matches, function(match){
            var shortcode = match[0];
            var date_format_str = match[1];
            file_name = file_name.replace(shortcode, dateFormat(d, date_format_str));
        });
        return file_name;
    },

    processFilePath: function(file_path){
        if(fs.existsSync(file_path)) return file_path;
        mkdirp.sync(file_path);
        return file_path;
    },

    writeToFile: function(file_path, text){
        if(!fs.existsSync(file_path)){
            fs.writeFile(file_path, text, function(err){if(err) console.log(err)});
        }else{
            fs.appendFile(file_path, "\r\n" + text, function(err){if(err) console.log(err)});
        }
    }
}

function addLogShortLinks(self){
    self.error = self.logError;
    self.err = self.logError;
    self.e = self.logError;

    self.warning = self.logWarn;
    self.warn = self.logWarn;
    self.w = self.logWarn;

    self.info = self.logInfo;
    self.i = self.logInfo;

    self.debug = self.logDebug;
    self.d = self.logDebug;

    self.trace = self.logTrace;
    self.t = self.logTrace;
}

module.exports = new Log();