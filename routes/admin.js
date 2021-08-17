const express = require('express');
const router = express.Router({ mergeParams: true });
const Passenger = require('../models/passenger.model');
const qr = require('qrcode');
const Trip = require('../models/trip.model');
const passport = require('passport');
const User = require('../models/user.model');
const { isLoggedIn, isAdminL } = require('../middleware');
const Boat = require('../models/boat.model');

//genarate fake account
router.get('/fake', async (req, res) => {
  const user = await new User({ username: 'admin', isAdmin: true });
  await User.register(user, 'admin');
  res.redirect('/add');
});
router.get('/staff', async (req, res) => {
  const { username, password, role } = req.body;
  if (req.body.role === 'staff') {
    const user = await new User({ username: username, role: role });
    await User.register(user, password);
    res.redirect('/dash');
  } else {
    const user = await new User({ username: username, role: role });
    await user.regiter();
  }
});
router.get('/login', (req, res) => {
  res.render('admin/login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    //failureFlash: true,
    failureRedirect: '/login',
  }),
  async (req, res) => {
    res.redirect('/dash');
    //res.redirect(redirectUrl);
  }
);
router.get('/', (req, res) => {
  res.render('admin/dashboard');
});

router.get('/add', isLoggedIn, isAdminL, (req, res) => {
  res.render('admin/addboat');
});
router.post('/boat', isLoggedIn, isAdminL, async (req, res) => {
  const { name, capitan, contactNum } = req.body;
  const boat = await new Boat({ name, capitan, contactNum });
  await boat.save();
  res.redirect('/add');
});

router.post('/pass', async (req, res) => {
  console.log(req.body);
  //di struc to body sa req+
  const { name, address, contactNum } = req.body;
  const passenger = await new Passenger({ name, address, contactNum });
  await passenger.save();
  console.log(passenger);
  qr.toDataURL(`${passenger.id}`, { version: 5 }, (err, src) => {
    if (err) res.send('error');
    res.send(src);
  });
});
//scan boat

//
router.get('/dash', isLoggedIn, async (req, res) => {
  const boat = await Boat.find({});
  res.render('admin/dash', { boat });
});
router.get('/dash/:boat', isLoggedIn, async (req, res) => {
  const { boat } = req.params;
  const trip = await new Trip({ boat: boat, date: Date.now() });
  await trip.save();
  console.log(trip.id);
  res.redirect(`/dash/${trip.id}/scan`);
});
router.get('/dash/:trip/scan', isLoggedIn, async (req, res) => {
  const { trip } = req.params;
  res.render('admin/scan', { trip });
});
router.post('/dash/:id/scan', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { person } = req.body;
  const trip = await Trip.findById(id);
  await trip.passenger.push(person);
  await trip.save();
  res.send('successfully scan');
});

router.post('/data', isLoggedIn, async (req, res) => {
  let { date } = req.body;

  date = new Date(date);
  let date1 = date.toISOString();
  date1 = new Date(date1);
  date.setDate(date.getUTCDate()); // Setting utc date, Only useful if you're region is behind UTC
  date = new Date(date.setHours(23, 59, 59, 999));
  console.log(typeof date);
  console.log(typeof date1);

  const trip = await Trip.find({
    date: {
      $gte: date1,
      $lte: date,
    },
  }).populate({
    path: 'passenger',
    populate: { path: 'establishment' },
  });
  //populate

  res.send(trip);
});

router.get('/contact', isLoggedIn, async (req, res) => {
  const boat = await Boat.find({});
  res.render('admin/tracing', { boat });
});
router.post('/contact', isLoggedIn, async (req, res) => {
  console.log(req.body);
  let { boat, date } = req.body;
  date = new Date(date);
  let date1 = date.toISOString();
  date1 = new Date(date1);
  date.setDate(date.getUTCDate()); // Setting utc date, Only useful if you're region is behind UTC
  date = new Date(date.setHours(23, 59, 59, 999));
  console.log(typeof date);
  console.log(typeof date1);
  const trip = await Trip.find({
    boat: boat.trim(),
    date: {
      $gte: date1,
      $lte: date,
    },
  }).populate({
    path: 'passenger',
    populate: { path: 'establishment' },
  });
  console.log(trip);
  res.send(trip);
});
router.get('/user', (req, res) => {
  res.render('admin/user');
});

router.get('/account', isLoggedIn, isAdminL, (req, res) => {
  res.render('admin/account');
});
router.post('/account', isLoggedIn, isAdminL, async (req, res) => {
  console.log(req.body);
  const { username, role, up } = req.body;
  if (role == 'staff' || role == 'Staff') {
    const user = await new User({ username: username, isStaff: true });
    await User.register(user, up);
  } else {
    const user = await new User({ username: username, isAdmin: true });
    await User.register(user, up);
  }
  res.redirect('/account');
});
router.get('/logout', (req, res) => {
  req.logOut();

  res.redirect('/login');
});
module.exports = router;
