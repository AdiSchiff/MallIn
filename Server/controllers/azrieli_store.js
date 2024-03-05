const storeService = require('../services/store');
const AztieliStoreService = require('../services/azrieli_store');
const loginController = require("./login");

const createNewStore = async (req, res) => {
    //Check if the store already exists in this mall
    const alreadyExists = await AztieliStoreService.getStoreByName(req.body.storename, req.body.mallname)
    if (alreadyExists) {
        return res.status(409).json({});
    }
    //Check if the store already exists in the stores collection
    alreadyExists = await storeService.getStoreByName(req.body.storename)
    if (!alreadyExists) {
        //If not add it to the stores collection
        const addNewStore = await storeService.createStore(req.body.storename, req.body.storeType, req.body.logoPic);
        if (!addNewStore) {
            return res.status(500).json({});
        }
    }
    //Add the store to the mall's collection
    const addNewAzrieliStore = await AztieliStoreService.createStore(req.body.storename, req.body.workingHours,
        req.body.floor, req.body.mallname);
    if (!addNewAzrieliStore) {
        return res.status(500).json({});
    }
    return res.status(200).json({
        "storename": addNewAzrieliStore.storename,
        "workingHours": addNewAzrieliStore.workingHours,
        "floor": addNewAzrieliStore.floor,
        "logoPic": req.body.logoPic,
        "storeType": req.body.storeType
    })
};

const getStoreByName = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        //Convert the storename to upper case
        const storeName = req.params.storename.toUpperCase();
        //Check if the store exists in the mall's collection
        const azrieliStore = await AztieliStoreService.getStoreByName(storeName, mallname);
        if (!azrieliStore) {
            return res.status(404).send(null);
        }
        //Check if the store exists in the stores collection
        const store = await storeService.getStoreByName(storeName);
        if (!store) {
            return res.status(404).send(null);
        }
        return res.status(200).json({
            "storename": azrieliStore.storename,
            "workingHours": azrieliStore.workingHours,
            "floor": azrieliStore.floor,
            "logoPic": store.logoPic,
            "storeType": store.storeType
        });
    } catch (error) {
        alert(error)
    }
};

const getStoresByFloor = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!await loginController.isLoggedIn(token)) {
        return res.status(401).send();
    }
    const stores = await AztieliStoreService.getStoresByFloor(req.params.floor, req.params.mallname);
    res.status(200).json(stores);
};

const deleteStoreByName = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if(loginController.isLoggedIn(token) !== -1){
        const store = await AztieliStoreService.deleteStoreByName(req.params.storename, req.params.mallname);
        if(!store){
            return res.status(404).send();
        }
        return res.status(200).json(store);
    }
    res.status(401).send();
}

const updateFloor = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if(loginController.isLoggedIn(token) !== -1){
        const store = await AztieliStoreService.updateFloor(req.params.storename, req.params.mallname, req.params.floor);
        if(!store){
            return res.status(404).send();
        }
        return res.status(200).json(store);
    }
    res.status(401).send();
};

const getStoresByType = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if(loginController.isLoggedIn(token) !== -1){
        //Get an array of all the stores from the given storeType
        const stores = await storeService.getStoresByType(req.params.storeType);
        if(!stores){
            return res.status(404).send();
        }
        const azrieliStores = [];
        let i = 0
        for(; i < stores.length; i++){
            //Check if the current store exsists in the mall
            const store = await AztieliStoreService.getStoreByName(stores[i].storename, req.params.mallname);
            if (!store) {
                continue;
            }
            //Create a store object
            const checkedStore = {
                "storename": stores[i].storename,
                "workingHours": store.workingHours,
                "floor": store.floor,
                "logoPic": stores[i].logoPic,
                "storeType": stores[i].storeType
            }
            //Add the store object to the mall's stores array
            azrieliStores.push(checkedStore);
        }
        return res.status(200).json(azrieliStores);
    }
    res.status(401).send();
};

module.exports = { createNewStore, getStoreByName, getStoresByFloor, deleteStoreByName, updateFloor, getStoresByType }