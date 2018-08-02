const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');

// middleware
const tokenHeaderToCookie = require("./middlewares/tokenHeaderToCookie");

// Router setting
const authRouter = require('./routes/auth');
const roomRouter = require('./routes/room');
const searchRouter = require('./routes/search');
const indexRouter = require('./routes/index');

// mongoDB setup
const mongoHandler = require('./modules/mongooseHandler');
mongoHandler.connect();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// header "token" to cookie
app.use(tokenHeaderToCookie);

// sesssion
const session = require('./modules/sessionConfig');

// session config
app.use(session);

// express default config
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// passport setting
app.use(passport.initialize());
app.use(passport.session());

// Router Setting
app.use('/auth', authRouter);
app.use('/:uid/room', roomRouter);
app.use('/:uid/search', searchRouter);
app.use('/', indexRouter);

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
