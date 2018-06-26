const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: {type: String},
  games: {type: Array},
  // test_data: {type: Array}
});

module.exports = mongoose.model('Game', gameSchema);
