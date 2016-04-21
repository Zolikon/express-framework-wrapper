var urlNotFound=function(req, res, next){
  res.status(404).send({ message: "URL_NOT_FOUND",method: req.method, url: req.url });
};

module.exports=urlNotFound;