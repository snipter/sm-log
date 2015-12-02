# NodeJS smart log module

This module provide easy log color output with different log levels.

## Installation

Installation via npm:

```
$ npm install sm-log --save
```

## Log levels

- **error**: the system is in distress, customers are probably being affected (or will soon be) and the fix probably requires human intervention. The "2AM rule" applies here- if you're on call, do you want to be woken up at 2AM if this condition happens? If yes, then log it as "error".

- **warn**: an unexpected technical or business event happened, customers may be affected, but probably no immediate human intervention is required. On call people won't be called immediately, but support personnel will want to review these issues asap to understand what the impact is. Basically any issue that needs to be tracked but may not require immediate intervention.

- **info**: things we want to see at high volume in case we need to forensically analyze an issue. System lifecycle events (system start, stop) go here. "Session" lifecycle events (login, logout, etc.) go here. Significant boundary events should be considered as well (e.g. database calls, remote API calls). Typical business exceptions can go here (e.g. login failed due to bad credentials). Any other event you think you'll need to see in production at high volume goes here.

- **debug**: just about everything that doesn't make the "info" cut... any message that is helpful in tracking the flow through the system and isolating issues, especially during the development and QA phases. We use "debug" level logs for entry/exit of most non-trivial methods and marking interesting events and decision points inside methods.

- **trace**: we don't use this often, but this would be for extremely detailed and potentially high volume logs that you don't typically want enabled even during normal development. Examples include dumping a full object hierarchy, logging some state during every iteration of a large loop, etc.

## Usage

```javascript
var log = require('./lib/sm-log');

//your file or module name
var m = 'MyModule';

//setting 'trace' log level
log.level('T');

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
//when event happend
log.showDate(true);
log.warn('warning message', m);
log.showDate(false);

//you can output line number
//where log function was called
log.showDate(true);
log.warn('warning message', m);
log.showDate(false);

//you can output error message and call
//callback of function

function readSomeFile(cb){
	var fs = require('fs');
	fs.readFile('/some/file.txt', function(err, data){
		if(err) return log.error(err, m, cb);
		log.info('file read done', m, cb);
	})
}
readSomeFile(function(){});
```

Output:

```
[T]: trace message
[D]: {"hello":"world"}
[I][MyModule]: info message
[05/28/2015 1:29:28 PM][W][MyModule]: warning message
[E][MyModule]: {"errno":-2,"code":"ENOENT","path":"/some/file.txt"}
```

You can use different function formats for calling log:

```javascript
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
```
You can use event handler for catch log events from different part of you code:

```javascript
log.on('log', function(log_data){
	console.log(JSON.stringify(log_data));
})
```

## Contacts

Jaroslav Khorishchenko<br/>
websnipter@gmail.com