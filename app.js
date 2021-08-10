const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
require('dotenv').config;
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const upload = multer();
const passport = require('passport');
const localStrategy = require('passport-local');
require('dotenv').config();
const User = require('./models/user.model');
//mongodb
mongoose.connect(
  process.env.DB_URL || 'mongodb://localhost/passenger-qrcode', //process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('DATABASE IS CONNECTED');
});
//session
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

//dd pag use sa session
app.use(session(sessionConfig));
app.use(express.json());
app.use(upload.array());

//dd pag gamit na sa passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

//dd para n sa session log in log out
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//static file
app.use(express.json());
app.use(upload.array());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.engine('ejs', ejsMate);

//routes
const adminRoutes = require('./routes/admin');

//pag gamit routes
app.use('/', adminRoutes);

app.listen(PORT, () => {
  console.log('running sa port 3000');
});
