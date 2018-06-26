const express = require('express');
const router = express.Router();

const checkAuth = require('../auth_middleware/check_auth');
const gamesController = require('../controllers/games');


router.get('/find/:gamesDate', gamesController.get_games_on_date);

// router.patch('/fixdates', gamesController.sort_game_dates);

// router.get('/AFDX/:endix', gamesController.get_all_games);

router.get("/teamthings/:teamname", gamesController.get_team_info);

// router.delete("/del_teams/:date", gamesController.remove_games);

// router.get("/create1", gamesController.create_team);

// router.patch('/testAFDX', gamesController.test_the_waters);

// router.post('/save', gamesController.save_game);
// router.patch('/fix_save', gamesController.fix_and_save);



// router.post('/request', gamesController.api_request);



// router.patch('/edit/:oldDate/:index/:newDate', gamesController.fix_game_schedule);

// router.post('/AFDX_SAVE', gamesController.special_save);

// router.get('/:gameId', gamesController.get_games);

module.exports = router;
