const storeController = require('../controllers/azrieli_store');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(storeController.createNewStore);
router.route('/:storename')
    .get(storeController.getStoreByName)
    .delete(storeController.deleteStoreByName);
router.route('/:floor')
    .get(storeController.getStoresByFloor)
    .put(storeController.updateFloor);
router.route('/:storeType')
    .get(storeController.getStoresByType);

module.exports = router;
