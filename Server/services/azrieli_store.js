const AzrieliStore = require('../models/azrieli_store');

const createStore = async (storename, workingHours, floor, mallname) => {
    const store = new Store({
        "storename": storename,
        "workingHours": workingHours,
        "floor": floor,
        "mallname": mallname
    });
    return await store.save();
};

const getStoresByFloor = async (floor, mallname) => {
    return await AzrieliStore.find({floor: floor, mallname: mallname});
};

const getStoreByName = async (storename, mallname) => {
    return await AzrieliStore.findOne({storename: storename, mallname: mallname});
};

//להוסיף פונקציות שליפה לפי תחיליות של שמות וכאלה

const deleteStoreByName = async (storename, mallname) => {
    return await AzrieliStore.findOneAndDelete({storename: storename, mallname: mallname});
};

const updateFloor = async (storename, mallname, newFloor) => {
    return await AzrieliStore.findOneAndUpdate(
        { storeName: storename, mallName: mallname },
        { floor: newFloor },
        { new: true }
    );
};


module.exports = { createStore, getStoresByFloor, getStoreByName, deleteStoreByName, updateFloor }