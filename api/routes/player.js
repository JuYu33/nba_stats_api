const express = require('express');
const router = express.Router();

const checkAuth = require('../auth_middleware/check_auth');
const playerController = require('../controllers/player');


router.get('/find/:gameID', gamesController.get_game);


module.exports = router;