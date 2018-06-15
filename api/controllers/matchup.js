const mongoose = require("mongoose");
const Matchup = require("../models/matchup");
const Games = require("../models/games");
const fetch = require('node-fetch');

function parseData(id, date, apiStats){
  return {
    gameID: id,
    date: date,
    stats: {
      home: {
        team_stats: {...apiStats.home.statistics},
        players: {...apiStats.home.players.sort((a,b) => b.statistics.points-a.statistics.points)} 
        },
      away: {
        team_stats: {...apiStats.away.statistics},
        players: {...apiStats.away.players.sort((a,b) => b.statistics.points-a.statistics.points)} 
      }
    }
  }
}

function saveInfo(save_data){
  const matchupStats = new Matchup({
    _id: new mongoose.Types.ObjectId(),
    ...save_data
  })

  matchupStats.save()
    .then(result => {
      console.log("saving data...");
    })
    .catch(err => {
      console.log("error? during saving? Probably a network issue");
    })
}

exports.findall = (req, res, next) => {
  Matchup.find()
    .exec()
    .then(result => {
      res.status(201).json({
        message:"All data",
        data: result
      })
    })
    .catch(err=> {
      res.status(500).json({
        message: "Error finding all",
        data: err
      })
    })
}

exports.search_for_game_data = (req, res, next) => {
  const id = req.params.gameID;

  Matchup.find({gameID: id})
    .exec()
    .then(data => {
      console.log("First step data: ", data);
      if(data.length>0) {       
        return data; //Have the data already found in Matchup DB
      } else {
        return new Promise((resolve,reject) => {
          Games.findOne({games: {$elemMatch: {id: id}}})
            .then(selected_game_data => {
              if(selected_game_data.games.length > 0){
                const uri1 = `${process.env.API_URI}${id}${process.env.API_URI2}`;
                // const uri1 = "https://jsonplaceholder.typicode.com/posts/1";
                console.log("fetching data from: ", uri1);
                fetch(uri1)
                  .then(api => api.json())
                  .then(api_data => {
                    if(id === api_data.id){
                      const parsed_data = parseData(id, selected_game_data.date, api_data);
                      saveInfo(parsed_data);
                      resolve(parsed_data);
                    } else {
                      resolve("Game data incomplete. Unable to process");
                    }
                  })
              } else {
                resolve("Odd no game was played?")
              }
            })
            .catch(err => {
              resolve("Error searching database for that game you chose");
            })
        })
      }
    })
    .then(result => {
      if(result) {
        res.status(201).json(result)
      } else {
        res.status(202).json({message: "There was no data"})
      }
    })
    .catch(err => {
      console.log("Issues finding game data.", err);
      res.status(500).json({
        message: "Issues finding game data",
        error: err
      })
    })
};

exports.del_game = (req,res,next) => {
  const id = req.params.gameID;

  Matchup.remove({_id: id})
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