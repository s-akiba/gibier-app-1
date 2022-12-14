var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const { flash } = require('express-flash-message');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hunterRouter = require('./routes/hunter');
var purchaserRouter = require('./routes/purchaser');
// 11/29
// 処理施設ルーティング
var facilityRouter = require('./routes/facility');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false, 
  cookie: { maxAge: 60 * 60 * 1000 }
};
app.use(session(session_opt));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash({ sessionKeyName: 'flashMessage' }));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/hunter', hunterRouter);
// 11/29追加
app.use('/facility',facilityRouter);
app.use('/purchaser', purchaserRouter);

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
