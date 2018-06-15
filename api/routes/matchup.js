const express = require("express");
const router = express.Router();
const checkAuth = require("../auth_middleware/check_auth");
const matchupController = require("../controllers/matchup");


router.get('/search/:gameID', matchupController.search_for_game_data);

router.get("/findall", matchupController.findall);

router.delete('/remove/:gameID', matchupController.del_game);


module.exports = router;