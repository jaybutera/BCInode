var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');     // Session cookies
var User = require('./models/user');
var mongoose = require('mongoose');           // Mongodb API
var uuid = require('node-uuid');              // Generate session uuid
var passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connect to mongodb database
mongoose.connect('mongodb://localhost/mindDb');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Init session cookie
app.use(session({
    genid: function(req) {
        return uuid.v1(); // Use uuid for session IDs
    },
    secret: '123testies'
}));

// Configure passport module
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//

var routes = require('./routes/index');
var plan = require('./routes/plan');
var auth = require('./routes/auth')(passport);
var api = require('./routes/api');
var session = require('./routes/session');

app.use('/', routes);
app.use('/plan', plan);
app.use('/auth', auth);
app.use('/api', api);
app.use('/session', session);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
