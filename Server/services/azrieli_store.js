const AzrieliStore = require("../models/azrieli_store");

const createStore = async (storename, workingHours, floor, mallname) => {
  const store = new Store({
    storename: storename,
    workingHours: workingHours,
    floor: floor,
    mallname: mallname,
  });
  return await store.save();
};

const getStoresByFloor = async (floor, mallname) => {
  return await AzrieliStore.find({ floor: floor, mallname: mallname });
};

const getStoresByMallName = async (mallname) => {
    return await AzrieliStore.find({ mallname: mallname });
};

const getStoresByName = async (partialName, mallname) => {
  const regex = new RegExp(partialName, "i"); // 'i' flag for case-insensitive search
  return await AzrieliStore.find({
    storename: { $regex: regex },
    mallname: mallname,
  });
};

const deleteStoreByName = async (storename, mallname) => {
  return await AzrieliStore.findOneAndDelete({
    storename: storename,
    mallname: mallname,
  });
};

const updateFloor = async (storename, mallname, newFloor) => {
  return await AzrieliStore.findOneAndUpdate(
    { storeName: storename, mallName: mallname },
    { floor: newFloor },
    { new: true }
  );
};

module.exports = {
  createStore,
  getStoresByFloor,
  getStoresByMallName,
  getStoresByName,
  deleteStoreByName,
  updateFloor,
};
