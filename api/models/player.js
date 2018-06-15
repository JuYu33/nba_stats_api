const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: {type: String},
  game_id: {type: String},
  stats: {type: Object}
});

module.exports = mongoose.model('Player', playerSchema);