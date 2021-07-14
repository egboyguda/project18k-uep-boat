const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  passenger: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Passenger',
    },
  ],
  boat: {
    type: String,
  },
  date: {
    type: Date,
  },
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
