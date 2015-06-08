/*============ Require ============*/

var colors = require("colors");
var _ = require("underscore");

/*============ Functionality ============*/

function Log(){
    addLogShortLinks(this);
    this.date_enabled = false;
    this.log_level = 0;
}

Log.prototype = {
    setLogLevel: function(level){
        this.log_level = this.logLevelToInt(level);
    },

    setDateEnabled: function(enabled){
        this.date_enabled = enabled;
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

        var text = "";
        if(this.date_enabled) text += "["+this.todayDateStr()+"]";
        text += "["+level+"]";
        if(module) text += "["+module+"]";
        text += ": " + data;
        
        if(this.log_level <= this.logLevelToInt(level)) this.logTextWithLevel(text, level);

        this.emit('log', {data: data, level: level, module: module, text: text});
        if(cb) cb(data);
    },

    logLevelToInt: function(level){
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
    self.log = self.log;
    self.logLevel = self.setLogLevel;
    self.level = self.setLogLevel;
}

module.exports = new Log();