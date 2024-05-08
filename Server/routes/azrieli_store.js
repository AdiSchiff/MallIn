const storeController = require('../controllers/azrieli_store');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(storeController.createNewStore);
router.route('/:storeType')
    .get(storeController.getStoresByType);
    //find solution to the string problame
router.route('/:storename')
    .get(storeController.getStoresByName)
    .delete(storeController.deleteStoreByName);
router.route('/:floor')
    .get(storeController.getStoresByFloor)
    .put(storeController.updateFloor);

module.exports = router;
