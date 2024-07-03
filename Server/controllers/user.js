const userService = require("../services/user");
const loginController = require("./login");
const key = "Secret";
const jwt = require("jsonwebtoken");

const createNewUser = async (req, res) => {
  const alreadyExists = await userService.getUser(req.body.username);
  if (alreadyExists) {
    return res.status(409).json({});
  }
  const addNewUser = await userService.createNewUser(
    req.body.username,
    req.body.password,
    req.body.displayName
  );
  if (!addNewUser) {
    return res.status(500).json({});
  }
  return res.status(200).json({
    username: addNewUser.username,
    displayName: addNewUser.displayName,
  });
};

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!(await loginController.isLoggedIn(token))) {
      return res.status(401).send();
    }
    const user = await userService.getUser(req.params.username);
    if (!user) {
      return res.status(404).send(null);
    }
    return res.status(200).json({
      username: username,
      displayName: displayName,
    });
  } catch (error) {
    alert(error);
  }
};

const addToFavorites = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const modifiedToken = token.substring(1, token.length - 1);
    const decoded = jwt.verify(modifiedToken, key); // Verify the token using your secret key

    if (!decoded) {
      return res.status(401).send("Unauthorized");
    }

    const username = decoded.username;
    const store = req.body;

    const result = await userService.addToFavorites(username, store);

    if (result) {
      return res.status(200).send();
    } else {
      return res.status(500).send("Failed to add to favorites");
    }
  } catch (error) {
    console.error("Error in addToFavorites:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getFavorites = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const modifiedToken = token.substring(1, token.length - 1);
    if (!(await loginController.isLoggedIn(token))) {
      return res.status(401).send();
    }
    const decoded = jwt.verify(modifiedToken, key); // Verify the token using your secret key
    const fav = await userService.getFavorites(decoded.username);
    if (!fav) {
      return res.status(404).send();
    }
    return res.status(200).json(fav.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const modifiedToken = token.substring(1, token.length - 1);

    const decoded = jwt.verify(modifiedToken, key); // Verify the token using your secret key

    if (!decoded) {
      return res.status(401).send("Unauthorized");
    }

    const username = decoded.username;
    const store = req.body; // Assuming the store details are in the body

    const result = await userService.removeFromFavorites(username, store);

    if (result) {
      return res.status(200).send();
    } else {
      return res.status(500).send("Failed to remove from favorites");
    }
  } catch (error) {
    console.error("Error in removeFromFavorites:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createNewUser,
  getUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};
