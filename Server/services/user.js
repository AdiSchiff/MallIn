const User = require('../models/user');

const createNewUser = async (username, password, displayName) => {
    const newUser = new User.user({
        "username": username,
        "password": password,
        "displayName": displayName
    });
    return await newUser.save();
};

const getUser = async (username) => {
    return User.findOne({username: username});
};

const getFavorites = async (username) => {
    return User.findOne({username: username}, 'favorites');
};

const addToFavorites = async (username, newStore) => {
    return await User.findOneAndUpdate(
        { username: username },
        { $push: { favorites: newStore } },
        { new: true, useFindAndModify: false }
    );
  };

  const removeFromFavorites = async (username, storename) => {
    return await User.findOneAndUpdate(
        { username: username },
        { $pull: { favorites: { storename: storename } } },
        { new: true, useFindAndModify: false }
    );
};

module.exports = {createNewUser, getUser, addToFavorites, removeFromFavorites, getFavorites};