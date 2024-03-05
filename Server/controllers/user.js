const userService = require('../services/user');
const loginController = require("./login");

const createNewUser = async (req, res) => {
    const alreadyExists = await userService.getUser(req.body.username)
    if (alreadyExists) {
        return res.status(409).json({});
    }
    const addNewUser = await userService.createNewUser(req.body.username, req.body.password,
        req.body.displayName);
    if (!addNewUser) {
        return res.status(500).json({});
    }
    return res.status(200).json({
        "username": addNewUser.username,
        "displayName": addNewUser.displayName
    })
};

const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        const user = await userService.getUser(req.params.username);
        if (!user) {
            return res.status(404).send(null);
        }
        return res.status(200).json({
            username: user.username,
            displayName: user.displayName
        });
    } catch (error) {
        alert(error)
    }
};

module.exports = {createNewUser, getUser}