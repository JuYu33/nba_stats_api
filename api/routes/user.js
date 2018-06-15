const express = require('express');
const router = express.Router();

const checkAuth = require("../auth_middleware/check_auth");
const userController = require("../controllers/user");


router.post('/signup', userController.user_create);

router.post('/login', userController.user_login);

router.delete('/delete/:userId', checkAuth, userController.delete_user);

router.get('/lookup', userController.find_users);


module.exports = router;