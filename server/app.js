require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Import routes
const indexRouter = require('./routes/index');
const messageScreenRouter = require('./routes/MessageScreen');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const usersRouter = require('./routes/users');

var app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

const mongoDB = "mongodb+srv://victoriakapelush:sakuraSun123@cluster0.qpt6ako.mongodb.net/ChatSphere?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Other middleware
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads')); 
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

  // Add session middleware
  app.use(session({
    secret: 'cats',
    resave: false,
    saveUninitialized: false
  }));
  
  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());

// Define routes
app.use('/', indexRouter);
app.use('/message', messageScreenRouter);
app.use('/message/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

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
  res.json({
    message: err.message,
    error: err
  });
});

/*const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/

module.exports = app;
