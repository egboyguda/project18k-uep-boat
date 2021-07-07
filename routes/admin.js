const express = require('express');
const router = express.Router({ mergeParams: true });
const Passenger = require('../models/passenger.model');
const qr = require('qrcode');
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
  console.log(passenger);
  qr.toDataURL(`${passenger.id}`, { version: 5 }, (err, src) => {
    if (err) res.send('error');
    res.send(src);
  });
});

module.exports = router;
