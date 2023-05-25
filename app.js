var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var favicon = require('serve-favicon');
var config = require('./configures');
var i18n = require("i18n");

i18n.configure({
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  cookie: 'lang',
  objectNotation: '.'
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/nm', express.static(__dirname + '/node_modules/'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init);
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes'));
app.use('/i18n', require('./routes/i18n'));
if (config.user) app.use('/users', require('./routes/user'));
if (config.socketio) app.use('/chat', require('./routes/chat'));
if (config.setup) app.use('/setup/book', require('./routes/setup/book'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  i18n.init(req, res);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
