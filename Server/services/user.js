const User = require("../models/user");

const createNewUser = async (username, password, displayName) => {
  const newUser = new User({
    username: username,
    password: password,
    displayName: displayName,
  });
  return await newUser.save();
};

const getUser = async (username) => {
  return User.findOne({ username: username });
};

const getFavorites = async (username) => {
  return User.findOne({ username: username }, "favorites");
};

const addToFavorites = async (username, newStore) => {
  try {
    await User.findOneAndUpdate(
      { username: username },
      { $push: { favorites: newStore } },
      { new: true, useFindAndModify: false }
    );
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return false;
  }
};

const removeFromFavorites = async (username, store) => {
  try {
    await User.findOneAndUpdate(
      { username: username },
      { $pull: { favorites: { storename: store.storename } } },
      { new: true, useFindAndModify: false }
    );
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }
};

module.exports = {
  createNewUser,
  getUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};
