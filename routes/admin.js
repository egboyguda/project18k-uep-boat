const express = require('express');
const router = express.Router({ mergeParams: true });
const Passenger = require('../models/passenger.model');
const qr = require('qrcode');
const Trip = require('../models/trip.model');
router.get('/', (req, res) => {
  res.render('admin/dashboard');
});

router.get('/add', (req, res) => {
  res.send('ok');
});

router.post('/add', async (req, res) => {
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
router.get('/dash', (req, res) => {
  res.render('admin/dash');
});
router.get('/dash/:boat', async (req, res) => {
  const { boat } = req.params;
  const trip = await new Trip({ boat: boat, date: Date.now() });
  await trip.save();
  console.log(trip.id);
  res.redirect(`/dash/${trip.id}/scan`);
});
router.get('/dash/:trip/scan', async (req, res) => {
  const { trip } = req.params;
  res.render('admin/scan', { trip });
});
router.post('/dash/:id/scan', async (req, res) => {
  const { id } = req.params;
  const { person } = req.body;
  const trip = await Trip.findById(id);
  await trip.passenger.push(person);
  await trip.save();
  res.send('successfully scan');
});

router.post('/data', async (req, res) => {
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

module.exports = router;
