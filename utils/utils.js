var moment = require('moment');
var _ = require('underscore');

/*============ Log data to str ============*/

function logRecordDataToStr(recordData, opt){
    if(recordData === undefined) return undefined;
    if(opt === undefined){
        opt = {
             line: true
            ,date: true
        }
    }

    var text = '';

    if(recordData.date && (opt.date !== false)){
        var logDateStr = dateToLogDateStr(recordData.date);
        text += "[" + logDateStr + "]";
    } 

    var logLevelStr = logLevelToSymbol(recordData.level);
    text += "[" + logLevelStr  + "]";

    if(recordData.module) text += "[" + recordData.module + "]";

    if(recordData.line && (opt.line !== false)) text += "[" + recordData.line + "]";

    var dataStr = dataToStr(recordData.data);
    text += ': ' + dataStr;

    return text;
}

/*============ Data ============*/

function dataToStr(data){
    if(data === undefined) return 'undefined';
    if(_.isString(data)) return data;
    if(_.isNumber(data)) return data.toString();
    if(_.isDate(data)) return moment(data).utc().format();
    if(_.isError(data)) return data.toString();
    var dataStr = "";
    try{
        dataStr = JSON.stringify(data);
    }catch(e){
        if(typeof data.toString === 'function'){
            dataStr = data.toString();
        }
    }
    return dataStr;
}

/*============ Date ============*/

function dateToLogDateStr(date){
    if(!_.isDate(date)) return '';
    return moment(date).utc().format();
};

/*============ Log level ============*/

var levels = {
     error: 4
    ,err: 4
    ,e: 4
    ,warning: 3
    ,warn: 3
    ,w: 3
    ,inform: 2
    ,info: 2
    ,i: 2
    ,debug: 1
    ,d: 1
    ,trace: 0
    ,t: 0
};

function strToLogLevel(level){
    if(typeof level === undefined) return levels.trace;
    if(typeof level === 'number') return level;
    if(!_.isString(level)) return levels.trace;

    level = level.toLowerCase();

    if(level == "error") return 4;
    if(level == "err") return 4;
    if(level == "e") return 4;

    if(level == "warning") return 3;
    if(level == "warn") return 3;
    if(level == "w") return 3;

    if(level == "inform") return 2;
    if(level == "info") return 2;
    if(level == "i") return 2;

    if(level == "debug") return 1;
    if(level == "d") return 1;

    if(level == "trace") return 0;
    if(level == "t") return 0;

    return 0;
}

function logLevelToSymbol(logLevel){
    if(logLevel === undefined) return '';
    if(logLevel === levels.error) return 'E';
    if(logLevel === levels.warning) return 'W';
    if(logLevel === levels.info) return 'I';
    if(logLevel === levels.debug) return 'D';
    if(logLevel === levels.trace) return 'T';
    return '';
}

/*============ Exports ============*/

module.exports = {
     logRecordDataToStr: logRecordDataToStr
	,dateToLogDateStr: dateToLogDateStr
	,strToLogLevel: strToLogLevel
    ,logLevelToSymbol: logLevelToSymbol
    ,levels: levels
    ,dataToStr: dataToStr
}