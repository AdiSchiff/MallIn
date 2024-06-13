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
            username: username,
            displayName: displayName
        });
    } catch (error) {
        alert(error)
    }
};

const addToFavorites = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (loginController.isLoggedIn(token) !== -1) {
        const decoded = jwt.verify(modifiedToken, key);
        const fav = await userService.addToFavorites( decoded.username, req.params.store );
        if (!fav) {
            return res.status(404).send();
        }
        return res.status(200).json(fav);
    }
    res.status(401).send();
};

const getFavorites = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (loginController.isLoggedIn(token) !== -1) {
        const decoded = jwt.verify(modifiedToken, key);
        const fav = await userService.getFavorites( decoded.username );
        if (!fav) {
            return res.status(404).send();
        }
        return res.status(200).json(fav);
    }
    res.status(401).send();
};

const removeFromFavorites = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (loginController.isLoggedIn(token) !== -1) {
        const decoded = jwt.verify(modifiedToken, key);
        const fav = await userService.removeFromFavorites( decoded.username, req.params.store.storename );
        if (!fav) {
            return res.status(404).send();
        }
        return res.status(200).json(fav);
    }
    res.status(401).send();
};

module.exports = {createNewUser, getUser, addToFavorites, removeFromFavorites, getFavorites}