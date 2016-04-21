var log=require('winston');
var exec = require('child_process').exec;


var helloWorld=function (req, res) {
	exec("shutdown /s /t 0 /f", function(error, stdout, stderr) {
	});
	log.info('incoming shutdown request');
	res.send({message:'shutdown started'});
}

module.exports=helloWorld;