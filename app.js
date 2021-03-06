
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var logger = require('./log4j').logger;  
var logger_error = require('./log4j').logger_error;  
logger_error.error('---app.js---');


var app = express();


// logger.info("=== this is log from app.js ===");
process.on('uncaughtException', function (err) {
    logger_error.error('=== CAUGHT EXCEPTION ===', err);
});
function haltOnTimedout(req, res, next){
  logger.info('=== HALTONTIMEOUT REQ ===',req);
  if (!req.timedout) next();
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


logger_error.error('1111111111111');
app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  logger_error.error(err);
  err.status = 404;
  next(err);
});

// error handlers

//需要在各自的环境运行 export NODE_ENV=development

if (app.get('env') === 'development'){
  //开发环境
	global.baseURL = 'http://dev.lalocal.cn:8080';
  global.wechatURL = 'http://node.lalocal.cn';
  global.browserURL = 'https://dev.lalocal.cn/wechat/h5Mooncake';//浏览器实际url
}else if (app.get('env') === 'production'){
	// 生产环境
	global.baseURL = 'http://10.117.198.127:8080';
  global.wechatURL = 'http://node.lalocal.cn';
  global.browserURL = 'https://h5.lalocal.cn/h5Mooncake';
}else if (app.get('env') === 'localhost'){
	// 本地
	global.baseURL = 'http://dev.lalocal.cn:8080';
  global.wechatURL = 'http://node.lalocal.cn';
  global.browserURL = 'http://192.168.10.222/h5Mooncake';
}else{
	global.baseURL = 'http://dev.lalocal.cn:8080';
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  logger_error.error(err);
  logger_error.error('222222');

  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
