const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passengerSchema = new Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  contactNum: {
    type: String,
  },
});

const Passenger = mongoose.model('Passenger', passengerSchema);
module.exports = Passenger;
