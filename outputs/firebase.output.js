var firebase = require('firebase');
var utils = require('../utils/utils.js');

function FirebaseOutput(project, id, firebaseOpt){
	if(project === undefined) throw new Error('project name not specified');
	if(id === undefined) throw new Error('id not specified');
	if(firebaseOpt === undefined) throw new Error('firebase opt not specified');
	this.project = project;
	this.id = id;
	this.enabled = true;
	this.path = 'log';
	this.firebase = FirebaseOutput.appWithId("app:" + id, firebaseOpt);
	this.database = this.firebase.database();
}

FirebaseOutput.appWithId = function(appId, firebaseOpt){
	if(!this.apps) this.apps = {};
	if(this.apps[appId]) return this.apps[appId];
	this.apps[appId] = firebase.initializeApp(firebaseOpt, appId);
	return this.apps[appId];
}

FirebaseOutput.prototype = {
	log: function(logRecord){
		if(this.enabled === false) return;
		logRecord.data = utils.dataToStr(logRecord.data);
		var logPath = this.getRootPath() + '/log';
		this.database.ref(logPath).push(logRecord);
	},

	meta: function(metaData){
		this.setMeta(metaData);
	},

	setMeta: function(metaData){
		var metaPath = this.getRootPath();
		this.database.ref(metaPath).update(metaData);
	},

	getRootPath: function(){
		return this.path + '/' + this.project + '/' + this.id;
	}
}

/*============ Epxorts ============*/

module.exports = FirebaseOutput;