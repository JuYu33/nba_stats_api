const mongoose = require("mongoose");
const Player = require('../models/player');
const fetch = require('node-fetch');

exports.get_game = (req, res, next) => {
  const gameID = req.params.gameID;
  const api_uri = `${process.env.API_URI}${gameID}/summary.json?api_key=${process.env.API_KEY}`;
  console.log(api_uri);

  Player.find()
    .exec()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log("There was an error: ", err)
      res.status(500).json({
        message: "Unable to find game data",
        error: err
      })
    })
  
  res.status(200).json([{id: 0, matchup: "bogus"}]);
  
}

