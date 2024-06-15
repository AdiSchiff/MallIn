const loginService = require("../services/login");
const jwt = require("jsonwebtoken");

const key = "Secret";

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await loginService.checkUsernameAndPassword(
      username,
      password
    );
    if (result) {
      const data = {
        username: username,
        role: "admin",
      };
      const token = jwt.sign(data, key);
      res.status(200).json(token);
    } else
      res
        .status(404)
        .send("User with the given username and/or password was not found");
  } catch (error) {
    res.status(500).send("Sorry, we got an error");
  }
};
function isLoggedIn(token) {
  try {
    const modifiedToken = token.substring(1, token.length - 1);
    const decoded = jwt.verify(modifiedToken, key);
    // Token verification successful
    return decoded.username;
  } catch (error) {
    // Token verification failed
    return -1;
  }
}

module.exports = { login, isLoggedIn };
