const mongoose = require("mongoose");
const Games = require('../models/games');


exports.get_all_games = (req, res, next) => {
  Games.find()
    .exec()
    .then(allData => {
      console.log(allData);
      res.status(200).json({
        message: "All the games:",
        data: allData
      })
    })
    .catch(err => {
      console.log("doh");
      res.status(500).json({
        error: err
      })
    })
};

exports.get_games_on_date = (req, res, next) => {
  const date = req.params.gamesDate;
  Games.find({"date":date})
    .exec()
    .then(data => data.length > 0 ? data[0] : "no games played")
    .then(response => {
      console.log("All of res", res);
      res.status(201).json({
        message: `On date: ${date}`,
        response
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

exports.save_game = (req, res, next) => {
  const gamesThisDate = new Games({
    _id: new mongoose.Types.ObjectId(),
    date: req.body.date,
    games: req.body.games
  })

  gamesThisDate
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created game data",
        gameData: result
      })
    })
    .catch(err => {
      console.log("Whoops can't post correctly");
      res.status(500).json({
        error: err
      })
    })
};

exports.delete_game = (req,res,next) => {
  const id = req.params.gameId

  Games.remove({_id: id})
    .exec()
    .then(gone => {
      console.log("Deleted game data");
      res.status(200).json({
        message: "Game was deleted",
        data: gone
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}