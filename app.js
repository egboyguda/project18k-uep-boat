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

//mongodb
mongoose.connect(
  'mongodb://localhost/passenger-qrcode', //process.env.DB_URL,
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
