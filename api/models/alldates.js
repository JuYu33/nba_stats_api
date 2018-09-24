const mongoose = require('mongoose');

const datesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  alldates: {type: Array},
  // test_data: {type: Array}
});

module.exports = mongoose.model('Alldates', datesSchema);
