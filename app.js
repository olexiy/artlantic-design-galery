const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// Env config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Session
app.use(session({
  secret: 'keyboarding cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
