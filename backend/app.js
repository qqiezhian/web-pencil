var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('express-cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var bodyParser = require('body-parser');
var session = require('express-session');
var clogger = require('./utils/plog').clogger;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser({limit: '50mb'}));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))//extended为false表示使用querystring来解析数据，这是URL-encoded解析器
// parse application/json 
app.use(bodyParser.json())//添加json解析器

app.use(cors({
  allowedOrigins: [
      'localhost:3000',
  ],
}));//use cors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*Since express-session version 1.5.0, the cookie-parser middleware 
no longer needs to be used for this module to work*/ 
app.use(session({
  secret: 'keyboard dog',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 5},
}));

app.use(function(req, res, next) {
  //不是登录页面或者登录页面的请求，并且session中没有身份验证信息
      if(req.path.indexOf('/login')<0 && !req.session.user){
          return res.redirect('/login');//跳转到登录页面
      }else{
        if(req.session) {
          clogger.info(req.session);
        }
          next();//继续往下走
      }
  });
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
