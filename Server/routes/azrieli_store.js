const storeController = require('../controllers/azrieli_store');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(storeController.createNewStore);
router.route('/type/:storeType')
    .get(storeController.getStoresByType);
router.route('/name/:storename')
    .get(storeController.getStoresByName)
    .delete(storeController.deleteStoreByName);
router.route('/floor/:floor')
    .get(storeController.getStoresByFloor)
    .put(storeController.updateFloor);

module.exports = router;
