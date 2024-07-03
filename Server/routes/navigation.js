const navigationController = require('../controllers/navigation');

const express = require('express');
var router = express.Router();

router
  .route("/")
  .post(navigationController.createNode)
  .get(navigationController.getRout);
router
    .route("/order")
    .get(navigationController.getOrderedRout);

module.exports = router;