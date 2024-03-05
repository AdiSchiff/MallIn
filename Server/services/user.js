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
    return User.user.findOne({username: username});
};

module.exports = {createNewUser, getUser};