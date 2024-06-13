const User = require('../models/user');

const checkUsernameAndPassword = async (username, password) => {
    const user = await User.findOne({ username });
    //if a user with this username and password exist return true else return false.
    return user && user.password === password;
}

module.exports = { checkUsernameAndPassword }