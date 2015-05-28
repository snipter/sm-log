/*============ Require ============*/

var colors = require("colors");
var _ = require("underscore");

// TODO
// - warning levels
// - warning levels

var dateEnabled = false;
var logLevel = logLevelToInt("trace");

/*============ Functionality ============*/

function setLogLevel(level){
    logLevel = logLevelToInt(level);
}

function setDateEnabled(enabled){
    dateEnabled = enabled;
}
 
var logError = function(data, module, callback){
    log(data, "E", module, callback);
}
 
var logWarn = function(data, module, callback){
    log(data, "W", module, callback);
}
 
var logInfo = function(data, module, callback){
    log(data, "I", module, callback);
}
 
var logDebug = function(data, module, callback){
    log(data, "D", module, callback);
}
 
var logTrace = function(data, module, callback){
    log(data, "T", module, callback);
}
 
var log  = function(data, level, module, callback){
    if(!data) return;
    if(module && (typeof module === "function")) {callback = module; module = null}
    if(typeof data !== "string") data = JSON.stringify(data);

    var text = "";
    if(dateEnabled) text += "["+todayDateStr()+"]";
    text += "["+level+"]";
    if(module) text += "["+module+"]";
    text += ": " + data;
    
    if(logLevel <= logLevelToInt(level)) logTextWithLevel(text, level);

    eventNotificaiton('log', {data: data, level: level, module: module});
    if(callback) callback(data);
}

function logLevelToInt(level){
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
}

function logTextWithLevel(text, level){
    if(level == "E") return console.log(text.red);
    if(level == "W") return console.log(text.yellow);
    if(level == "I") return console.log(text.blue);
    if(level == "D") return console.log(text.cyan);
    if(level == "T") return console.log(text.grey);
    console.log(text);
}

function todayDateStr(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd};
    if(mm<10){mm='0'+mm} 
    today = mm+'/'+dd+'/'+yyyy + ' ' + today.toLocaleTimeString();
    return today;
}

/*============ Events ============*/
 
var observers = [];
 
var on = function(event, callback){
    observers.push({event:event, call:callback});
}
 
var eventNotificaiton = function(event, data){
    _.each(observers, function(observer){
        if(observer.event == event) observer.call(data);
    })
}

/*============ Exports ============*/
 
exports.error = logError;
exports.err = logError;
exports.e = logError;
exports.warning = logWarn;
exports.warn = logWarn;
exports.w = logWarn;
exports.info = logInfo;
exports.i = logInfo;
exports.debug = logDebug;
exports.d = logDebug;
exports.trace = logTrace;
exports.t = logTrace;
exports.log = log;
exports.on = on;

exports.setLogLevel = setLogLevel;
exports.setDateEnabled = setDateEnabled;