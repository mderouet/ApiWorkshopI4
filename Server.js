var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./REST.js");
var app  = express();
var cors = require('cors');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function REST(){
    var self = this;
    self.configureExpress();
};

REST.prototype.configureExpress = function() {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("Running on port 3000, i'm the daemon...(It's a joke...)");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new REST();
