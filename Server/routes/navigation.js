const navigationController = require('../controllers/navigation');

const express = require('express');
var router = express.Router();

router
  .route("/")
  .post(navigationController.createNode)
router
  .route("/opt")
  .post(navigationController.createRout);
router
    .route("/order")
    .post(navigationController.createOrderedRout);

module.exports = router;