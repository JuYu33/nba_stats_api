const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  team_name: {type: String},
  dates: {type: Array},
  games_list: {type: Object}
});

module.exports = mongoose.model("TeamInfo", teamSchema);