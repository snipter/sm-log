var log = require('./lib/sm-log');

//your file or module name
var m = 'MyModule';

log.addOutput({type: 'file', name: '%yyyy.mm.dd%.log', path: 'logs'});

//setting 'trace' log level
log.level('T');

//checking event emiter
log.on('log', function(log_data){
	// console.log(JSON.stringify(log_data));
})

//demo data
var current_data = {hello: 'world'};

//with sm-log you can output
//different string info
log.trace('trace message');

//sm-log can output not just 
//string but objects too
log.debug(current_data);

//you can set module or 
//file name in log output
log.info('info message', m);

//you can output date and time
//when event event happend
log.showDate(true);
log.warn('warning message', m);
log.showDate(false);

//you can output date and time
//when event event happend
log.showLine(true);
log.warn('warning message', m);
log.showLine(false);

//you can output error message and call
//callback of function

// function readSomeFile(cb){
// 	var fs = require('fs');
// 	fs.readFile('/some/file.txt', function(err, data){
// 		if(err) return log.error(err, m, cb);
// 		log.info('file read done', m, cb);
// 	})
// }
// readSomeFile(function(){});

//error msg
log.error('error msg');
log.err('error msg');
log.e('error msg');

//warning msg
log.warning('warning msg');
log.warn('warning msg');
log.w('warning msg');

//info msg
log.info('info msg');
log.i('info msg');

//debug msg
log.debug('debug msg');
log.d('debug msg');

//trace msg
log.trace('trace msg');
log.t('trace msg');