const navigationController = require('../controllers/navigation');

const express = require('express');
var router = express.Router();

router
  .route("/")
  .post(navigationController.createNode)
  .get(navigationController.getRout);
router
    .route("/order")
    .post(navigationController.createOrderedRout);

module.exports = router;