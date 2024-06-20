const Store = require('../models/store');

const createStore = async (storename, storeType, logoPic) => {
    const store = new Store({
        "storename": storename,
        "storeType": storeType,
        "logoPic": logoPic
    });
    return await store.save();
};

const getAll = async () => {
    return await Store.find();
}

const getStoresByType = async (storeType) => {
    return await Store.find({storeType: storeType});
};

const getStoreByName = async (storename) => {
    return await Store.findOne({storename: storename});
};

module.exports = { createStore, getAll, getStoresByType, getStoreByName }