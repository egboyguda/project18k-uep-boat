const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const boatSchema = new Schema({
  capitan: {
    type: String,
  },
  boatName: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
});
const Boat = mongoose.model('Boat', boatSchema);
module.exports = Boat;
