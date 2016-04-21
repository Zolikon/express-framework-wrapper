const express = require('express');
const bodyParser = require('body-parser');
const fs=require('fs');
const HOME_DIRECTORY='./';
const configuration = require('configuration');

var log=require('winston');

log.add(log.transports.File,{filename:configuration.errorLog,level:'error'});

const routes=JSON.parse(fs.readFileSync(HOME_DIRECTORY+'routes.json'));
const appName=configuration.appName;

const app = express();


//Universal middleware registration
const universalMiddlewares=routes.universalMiddlewares.allMethods;
if(universalMiddlewares!==undefined){
	for(var i=0;i<universalMiddlewares.length;i++){
		var middleware = require(HOME_DIRECTORY+universalMiddlewares[i]);
		app.use(middleware);
		log.info("%s: Universal middleware registered: %s",appName,universalMiddlewares[i]);
	}
}



//Routes registration
const handledRoutes=routes.routes;
for(var i=0;i<handledRoutes.length;i++){
	var routeToHandle=handledRoutes[i];	
	
	registerBodyParser(routeToHandle)
	
	registerMethodMiddleware(routeToHandle);
	
	registerUrlMiddleware(routeToHandle);
	
	registerUrlHandler(routeToHandle);

}

function registerBodyParser(routeToHandle){
	var method=routeToHandle.method;
	if(method===("post"||"update")){
		app[method](routeToHandle.url,bodyParser.json());
	}
}

function registerUrlHandler(routeToHandle){
	var method=routeToHandle.method;
	app[method](routeToHandle.url,require(HOME_DIRECTORY+routeToHandle.handler));
	log.info("%s: Request hanlder for %s url registered: %s",appName,routeToHandle.url,routeToHandle.handler);
}

function registerMethodMiddleware(routeToHandle){
	var method=routeToHandle.method;
	var methodMiddleWares=routes.universalMiddlewares[method];
	if(methodMiddleWares!==undefined){
		for(var p=0;p<methodMiddleWares.length;p++){
			var middleware = require(HOME_DIRECTORY+methodMiddleWares[p]);
			app[method](routeToHandle.url,middleware);
			log.info("%s: Universal middleware for %s method registered: %s",appName,method,methodMiddleWares[p]);
		}
	}
}

function registerUrlMiddleware(routeToHandle){
	var method=routeToHandle.method;
	var middlewares=routeToHandle.middlewares;
	if(middlewares!==undefined){
		for(var p=0;p<middlewares.length;p++){
			var middleware=require(HOME_DIRECTORY+middlewares[p]);
			app[method](routeToHandle.url,middleware);
			log.info("%s: Url specific middleware for %s url registered: %s",appName,routeToHandle.url,middlewares[p]);
		}
	}
}

//url not found handler registration
const urlNotFound=routes.universalMiddlewares.urlNotFound;
if(urlNotFound!==undefined&&urlNotFound!==""){
	app.use(require(HOME_DIRECTORY+urlNotFound));
	log.info("%s: Url not found handler registered: %s",appName,routes.errorHandler);
}

//universal error handler registration
const universalErrorHandler=routes.universalMiddlewares.errorHandler
if(universalErrorHandler!==undefined&&universalErrorHandler!==""){
	app.use(require(HOME_DIRECTORY+universalErrorHandler));
	log.info("%s: Errorhandler registered: %s",appName,universalErrorHandler);
}

//server start
const server = app.listen(configuration.port, function () {
  var port = server.address().port;
  log.info("%s: App listening at port: %s",appName,port);
});