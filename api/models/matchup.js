const mongoose = require("mongoose");

const matchupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  gameID: {type: String},
  stats: {type: Object}
})

module.exports = mongoose.model('Matchup', matchupSchema);
