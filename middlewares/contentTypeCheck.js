var contentTypeCheck=function(req,res,next){
	if(req.header('content-type')!=='application/json'){
		var contentTypeError=new badContentType(req.header('content-type'));
		console.error("Content type error:%s",JSON.stringify(contentTypeError));
		res.status(400).send(contentTypeError);
	} else {
		next();
	}
}

module.exports=contentTypeCheck;

var badContentType=function(contentType){
	this.message="BAD_CONTENT_TYPE";
	this.contentType=contentType!==undefined?contentType:"MISSING";
	this.acceptedContentType="application/json";
}