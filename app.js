require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/auth');

const mongoDb = process.env.MONGO_STRING_LOCAL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const database = mongoose.connection;
database.on('error', console.error.bind(console, 'mongo connection error'));

// [ SESSION STORAGE ]
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_STRING_LOCAL,
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
