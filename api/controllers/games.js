const mongoose = require("mongoose");
const Games = require('../models/games');
const TeamInfo = require('../models/teams');

exports.get_games_on_date = (req, res, next) => {
  const date = req.params.gamesDate;
  Games.find({"date":date})
    .exec()
    .then(data => data.length > 0 ? data[0] : "no games played")
    .then(response => {
      console.log("need to add scores", response);
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

exports.get_team_info = (req, res, next) => {
  const team_name = req.params.teamname;
  TeamInfo.find({"team_name": team_name})
    .exec()
    .then(results => {
      console.log("Games played: ", results[0].dates.length);
      res.status(200).json({
        message: "All teams info",
        results
      })
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

exports.find_all = (req, res, next) => {

  Games.find()
    .exec()
    .then(response => {
      const alldates = {};
      const months = {};
      const teams = [];
      response.forEach(x => {
        alldates[x.date] = x.games.length;
        const [year, month, ...rest] = x.date.split('-');
        if(months[month]) {
          months[month] += x.games.length;
        } else {
          months[month] = x.games.length;
        }
      })


      res.status(200).json({
        message: "all games",
        data: [months, alldates]
      })

    })
    .catch(err => {
      res.status(400).json({
        message: "Failure getting all",
        error: err
      })
    })
}

/*
exports.fix_and_save = (req,res,next) => {
  const xlsx = require('xlsx');
  const wkbk = xlsx.readFile('./sch.xlsx');
  const wksht = wkbk.Sheets[wkbk.SheetNames[0]];
  const colE = {};
  for (let i in wksht) {
    if(i.toString()[0] === 'A'){
      const temp1 = wksht[i].v;
      const [mo,dy] = temp1.toString().split('.');
      const new_dy = dy.length === 1 ? '0'+dy : dy;
      let date = mo > 6 ? `2017-${mo}-${new_dy}` : `2018-0${mo}-${new_dy}`;
      colE[i.toString().slice(1,)] = {date:date};
    }
    if(i.toString()[0] === 'E'){
      colE[i.toString().slice(1,)].games_played = wksht[i].v;
    }
  }
  const correct_games_on_date = {}
  // let qpqp = 0;
  for (let i in colE) {
    // qpqp++;
    correct_games_on_date[colE[i].date] = colE[i].games_played;
  }
  // console.log(qpqp);
  


  Games.find()
    .sort({date: 1})//1 to indicate descending
    .exec()
    .then(all_data => {
      let all_the_games = [];
      let test_length_flag = true;

      all_data.forEach(x => {
        if(test_length_flag) {
          all_the_games = all_the_games.concat(x.games);
        }
        if(x.date === "2018-04-12"){
          test_length_flag = false;
        }
      })

      for (let i in correct_games_on_date) {
        let use_this = all_the_games.splice(0,correct_games_on_date[i]);
        
        if(i === '2017-10-17') {
          use_this = all_the_games.splice(0,correct_games_on_date[i]);
        }
        Games.findOneAndUpdate({'date': i},{games:use_this}).exec().then();
      }
      
      res.status(200).json({
        message: "I can do that yeah!"
      })
    })
    .catch(err => {
      console.log(err);
      res.status(501).json({
        message: "Error sorting",
        error: err
      })
    })

};
exports.test_the_waters = (req,res,next) => {
  const xlsx = require('xlsx');
  const wkbk = xlsx.readFile('./sch.xlsx');
  const wksht = wkbk.Sheets[wkbk.SheetNames[0]];
  const colE = {};
  for (let i in wksht) {
    if(i.toString()[0] === 'A'){
      const temp1 = wksht[i].v;
      const [mo,dy] = temp1.toString().split('.');
      const new_dy = dy.length === 1 ? '0'+dy : dy;
      let date = mo > 6 ? `2017-${mo}-${new_dy}` : `2018-0${mo}-${new_dy}`;
      colE[i.toString().slice(1,)] = {date:date};
    }
    if(i.toString()[0] === 'E'){
      colE[i.toString().slice(1,)].games_played = wksht[i].v;
    }
  }
  const correct_games_on_date = {}
  let corr_count = 0;
  let games_count = 0;
  let corr_dates = [];
  for (let i in colE) {
    correct_games_on_date[colE[i].date] = colE[i].games_played;
    corr_count++
    games_count += colE[i].games_played;
    corr_dates.push(colE[i].date);
  }
  // console.log(corr_dates);
  // console.log(corr_count);
  // console.log("Correct games count: ", games_count);

  corr_dates.forEach(i => {
    Games.findOne({"date": i}) 
      .exec()
      .then(x=>{
        console.log(i);
        if(x.games.length !== correct_games_on_date[i]){
          // console.log("poop: " + i);
          console.log(x.games.length + " VS " + correct_games_on_date[i])
        }
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
    
  })
  res.status(200).json({message: "Seems good"})
  
  Games.find()
    .exec()
    .then(all_data => {
      let flag = true;
      let date_count = 0;
      let db_game_count = 0;
      let sum_of_games = 0;
      let all_dates = [];
      all_data.forEach(x=>{
                
        delete correct_games_on_date[x.date];
      })
      console.log(correct_games_on_date);
      console.log(sum_of_games);
      return "Just a formality"
    })
    .then(hi_there => {
      res.status(200).json({
        message: hi_there
      })
    })
    .catch(err => {
      
      res.status(500).json({
        error: err
      })
    })
    

};
const saveMatchupInfo = (inputArr) => {
  const [team,opponent,id,date,isHome] = inputArr;

  TeamInfo.findOne({"team_name": team})
    .exec()
    .then(team_exists => {
      if(team_exists) {
        // TeamInfo.findOneAndUpdate(
        return TeamInfo.findOneAndUpdate(
          {"team_name": team}, 
          {$push: 
            {dates: date,
            games_list: {
              [date]: {id: id, opponent: opponent, isHome: isHome}
          }}})
          .exec()
          // .then()
      } else {
        // const new_team = new TeamInfo({
        //   _id: new mongoose.Types.ObjectId(),
        //   team_name: team,
        //   dates: [date],
        //   games_list: [{[date]: {id: id, opponent: opponent, isHome: isHome}}]
        // })
        // // new_team.save()
        // return new_team.save()
      }
    })
};
exports.remove_games = (req,res,next) => {
  console.log(req.params.date);
  TeamInfo.deleteMany({
      // "list_games.date": req.params.date
  })
    .exec()
    .then(result1 => {
      res.status(200).json({
        message: "removed",
        result1
      })
    })
    .catch(err => {
      res.status(500).json({error: err});
    })
};
exports.create_team = (req,res,next) => {
  const new_team = new TeamInfo({
    _id: new mongoose.Types.ObjectId(),
    team_name: "DAL",
    dates: [],
    games_list: []
  })

  new_team
    .save()
    .then(gen1 => {
      res.status(200).json({message: "Generated DAL"})
    })
    .catch(err => {
      re.status(500).json({
        message: "Error generating",
        error: err
      })
    })

};
exports.get_all_games = (req, res, next) => {
  const entry_index = req.params.endix
  Games.find()
    .exec()
    .then(all_data => {
      const parsed_data = [];
      const all_teams = {};
      all_data.forEach(x => {
        // const x = all_data[entry_index];
        x.games.forEach(y => {
          const {id} = y;
          const home = y.home.alias;
          const away = y.away.alias;
          parsed_data.push([home,away,id,x.date,true]);
          parsed_data.push([away,home,id,x.date,false]);
          // saveMatchupInfo(home, away, id, this_date, true);
          // saveMatchupInfo(away, home, id, this_date, false);
          // all_teams[home] ? null : all_teams[home] = home;
          // all_teams[away] ? null : all_teams[away] = away;
        })
      })
      // for (let i in all_teams) {
      //   const new_team = new TeamInfo({
      //     _id: new mongoose.Types.ObjectId(),
      //     team_name: i,
      //     dates: [],
      //     games_list: []
      //   })
      
      //   new_team
      //     .save()
      //     .then()
      // }
      return parsed_data;
    })
    .then(result => {
      let chain = Promise.resolve();  
      console.log("Games to save: ", result.length);
      // result.forEach(x => {
      //   chain = chain.then(()=>saveMatchupInfo(x))
      //     .then()
      // })
      return `completed`
    })
    .then(result1 => {
      res.status(200).json({
        message: "All the games fetched",
        completed: result1
      })
    })
    .catch(err => {
      console.log("doh");
      res.status(500).json({
        error: err
      })
    })
};
exports.sort_game_dates = (req, res, next) => {
  TeamInfo.find()
    .exec()
    .then(all_teams => {
           
      all_teams.forEach(i => {
        const newDate = i.dates.sort();
        TeamInfo.findOneAndUpdate({"team_name": i.team_name}, {$set: {dates: newDate}})
          .exec()
          .then()
      })

      res.status(200).json({
        message: "fixed em"
      })
    })
    .catch(err => {
      res.status(500).json({
        message: "Didn't find teams",
        error: err
      })
    })
};
exports.serve_new_data = (req, res, next) => {
  const teams = {};
  
  Games.find()
    .then(all_data => {
      all_data.forEach(games_this_date => {
        const game_date = games_this_data.date;
        games_this_date.games.forEach(game_data => {
          const game_id = game_data.id
          const home_team = game_data.home.alias;
          const away_team = game_data.away.alias;

          addGameData(home_team, game_date, game_id);
          addGameData(away_team, game_date, game_id);

          function addGameData(team,date,gameID) {
            if(teams[team]){
              teams[team].push({[date]:gameID});
            } else {
              teams[team] = [{[date]:gameID}];
            }
          }
        })
      })


    })

  
};
exports.save_game = (req, res, next) => {
  const gamesThisDate = new Games({
    _id: new mongoose.Types.ObjectId(),
    date: "2017-10-17",
    games: []
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
};
*/