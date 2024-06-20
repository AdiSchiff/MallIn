const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router
  .route("/")
  .post(userController.createNewUser)
  .get(userController.getFavorites);
router.route("/:username").get(userController.getUser);
router.put("/favorites/remove", userController.removeFromFavorites);
router.put("/favorites/add", userController.addToFavorites);

module.exports = router;
