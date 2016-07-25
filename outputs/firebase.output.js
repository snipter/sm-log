

function firebaseOutput(){
	this.enabled = true;
}

firebaseOutput.prototype = {
	log: function(logData){
		
	}
}

/*============ Epxorts ============*/

module.exports = firebaseOutput;