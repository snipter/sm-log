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
    this.date_enabled = false;
    this.line_enabled = true;
    this.log_level = 0;
    this.log_files = [];
}

Log.prototype = {
    setLogLevel: function(level){
        this.log_level = this.logLevelToInt(level);
    },

    setDateEnabled: function(enabled){
        this.date_enabled = enabled;
    },

    setLineEnabled: function(enabled){
        this.line_enabled = enabled;
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
        if(typeof data !== "string") data = JSON.stringify(data);

        var line = __stack[2].getLineNumber();
        var text = "";
        if(this.date_enabled) text += "["+this.todayDateStr()+"]";
        text += "["+level+"]";
        if(module) text += "["+module+"]";
        if(this.line_enabled) text += "["+line+"]";
        text += ": " + data;
        
        if(this.log_level <= this.logLevelToInt(level)) this.logTextWithLevel(text, level);

        var log_data = {data: data, level: level, module: module, line: line, time: this.now(), text: text};

        this.writeToLogFiles(log_data);
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

    addLogFile: function(file_data){
        if(!file_data) throw new Error('File data now set');
        if(typeof file_data === "string") file_data = {path: file_data};
        if(!file_data.path) throw new Error('Log file path not set');

        file_data.path = this.processFilePath(file_data.path);

        if(!file_data.level) file_data.level = 'T';
        if(!file_data.line) file_data.line = true;

        this.log_files.push(file_data);
    },

    processFilePath: function(file_path){
        file_path = this.processFilePathDateShortcode(file_path);
        this.processFilePathDir(file_path);
        return file_path;
    },

    processFilePathDateShortcode: function(file_path){
        var date_reg = /%(.+?)%/g;
        var matches = date_reg.execAll(file_path);
        if(!matches || matches.length == 0) return file_path;
        var d = new Date();
        _.each(matches, function(match){
            var shortcode = match[0];
            var date_format_str = match[1];
            file_path = file_path.replace(shortcode, dateFormat(d, date_format_str));
        });
        return file_path;
    },

    processFilePathDir: function(file_path){
        var dir_path = path.dirname(file_path);
        if(!dir_path) return;
        if(dir_path == '.') return;
        if(fs.existsSync(dir_path)) return;
        mkdirp.sync(dir_path);
    },

    writeToLogFiles: function(log_data){
        var self = this;
        _.each(self.log_files, function(log_file_data){
            var log_data_level = self.logLevelToInt(log_data.level);
            var log_file_level = self.logLevelToInt(log_file_data.level);
            if(log_data_level < log_file_level) return;

            self.writeToFile(log_file_data.path, log_data.text);
        });
    },

    writeToFile: function(file_path, text){
        fs.appendFile(file_path, text + "\r\n", function(err){
            if(err) throw new Error(err);
        });
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

    self.logLevel = self.setLogLevel;
    self.level = self.setLogLevel;

    self.lineEnabled = self.setLineEnabled;
}

module.exports = new Log();