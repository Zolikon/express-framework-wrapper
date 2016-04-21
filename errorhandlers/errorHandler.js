
var JsonError = function(message,body){
	this.error="JSON_SYNTAX_ERROR";
	this.details={},
	this.details.errorMessage=message;
	this.details.requestBody=body;
}

var isJsonError = function(error){
	return error.toString().indexOf("SyntaxError")!==-1;
}

var handleError = function(err, req, res, next) {
	console.error(err.stack);
	var message='!';
	if(isJsonError(err)){
		message=new JsonError(err.message,err.body);	
	}
	res.status(err.status).send(message);
}

module.exports=handleError;