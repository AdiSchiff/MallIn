const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.route('/')
    .post(userController.createNewUser);
router.route('/:username')
    .get(userController.getUser);
router.route('/:favorites')
    .get(userController.getFavorites)
    .put(userController.addToFavorites);
router.route('/store/:store')
    .put(userController.removeFromFavorites);
module.exports = router;
