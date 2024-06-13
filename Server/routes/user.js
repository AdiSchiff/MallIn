const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.route('/')
    .post(userController.createNewUser)
    .get(userController.getFavorites)
    .put(userController.addToFavorites);
router.route('/:username')
    .get(userController.getUser);
router.route('/:favorites')
    .put(userController.removeFromFavorites);
module.exports = router;
