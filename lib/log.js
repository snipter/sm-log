/*============ Require ============*/

var _ = require("underscore");
var utils = require("./utils.js");

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
    this.enabled = true;
    this.level = 0;
    this.outputs = [];

    this.error = this.logError;
    this.err = this.logError;
    this.e = this.logError;

    this.warning = this.logWarn;
    this.warn = this.logWarn;
    this.w = this.logWarn;

    this.info = this.logInfo;
    this.i = this.logInfo;

    this.debug = this.logDebug;
    this.d = this.logDebug;

    this.trace = this.logTrace;
    this.t = this.logTrace;

    this.levels = utils.levels;
}

Log.prototype = {
     
    logError: function(data, module, cb){
        this._log(__stack[1].getLineNumber(), utils.levels.error, data, module, cb);
    },
     
    logWarn: function(data, module, cb){
        this._log(__stack[1].getLineNumber(), utils.levels.warn, data, module, cb);
    },
     
    logInfo: function(data, module, cb){
        this._log(__stack[1].getLineNumber(), utils.levels.info, data, module, cb);
    },
     
    logDebug: function(data, module, cb){
        this._log(__stack[1].getLineNumber(), utils.levels.debug, data, module, cb);
    },
     
    logTrace: function(data, module, cb){
        this._log(__stack[1].getLineNumber(), utils.levels.trace, data, module, cb);
    },
     
    _log: function(line, level, data, module, cb){
        if(this.enabled === false) return undefined;
        if(data === undefined) return undefined;
        if(typeof module === "function") {cb = module; module = null}

        var recordData = {
             line: line
            ,level: level
            ,data: data
            ,module: module
            ,date: new Date()
        };
        recordData.text = utils.logRecordDataToStr(recordData);

        this.logToOutpus(recordData);
        this.emit('log', recordData);

        if(cb) cb(data);
    },

    /*============ Outputs ============*/

    addOutput: function(output){
        if(!output) throw new Error('output have to be specified');
        if(typeof output.log !== 'function') throw new Error('output needs to have log() function');
        this.outputs.push(output);
    },

    logToOutpus: function(logData){
        _.each(this.outputs, function(output){
            output.log(logData);
        });
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
    }
}

module.exports = Log;