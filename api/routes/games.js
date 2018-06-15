const express = require('express');
const router = express.Router();

const checkAuth = require('../auth_middleware/check_auth');
const gamesController = require('../controllers/games');


router.get('/find/:gamesDate', gamesController.get_games_on_date);

router.get('/AFDX', gamesController.get_all_games);

// router.post('/save', gamesController.save_game);

// router.post('/request', gamesController.api_request);





// router.patch('/edit/:oldDate/:index/:newDate', gamesController.fix_game_schedule);

// router.post('/AFDX_SAVE', gamesController.special_save);

// router.get('/:gameId', gamesController.get_games);

module.exports = router;
