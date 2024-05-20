const storeService = require("../services/store");
const AztieliStoreService = require("../services/azrieli_store");
const loginController = require("./login");

const createNewStore = async (req, res) => {
  //Check if the store already exists in this mall
  const alreadyExists = await AztieliStoreService.getStoreByName(
    req.body.storename,
    req.body.mallname
  );
  if (alreadyExists) {
    return res.status(409).json({});
  }
  //Check if the store already exists in the stores collection
  alreadyExists = await storeService.getStoreByName(req.body.storename);
  if (!alreadyExists) {
    //If not add it to the stores collection
    const addNewStore = await storeService.createStore(
      req.body.storename,
      req.body.storeType,
      req.body.logoPic
    );
    if (!addNewStore) {
      return res.status(500).json({});
    }
  }
  //Add the store to the mall's collection
  const addNewAzrieliStore = await AztieliStoreService.createStore(
    req.body.storename,
    req.body.workingHours,
    req.body.floor,
    req.body.mallname
  );
  if (!addNewAzrieliStore) {
    return res.status(500).json({});
  }
  return res.status(200).json({
    storename: addNewAzrieliStore.storename,
    workingHours: addNewAzrieliStore.workingHours,
    floor: addNewAzrieliStore.floor,
    logoPic: req.body.logoPic,
    storeType: req.body.storeType,
  });
};

const getStoresByName = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!(await loginController.isLoggedIn(token))) {
      return res.status(401).send("Unauthorized");
    }

    const storename = req.params.storename;
    const mallname = req.query.mallname;

    // Check if the store exists in the mall's collection
    const azrieliStores = await AztieliStoreService.getStoresByName(
      storename,
      mallname
    );
    if (!azrieliStores || azrieliStores.length === 0) {
      return res.status(404).send("No stores found in the specified mall");
    }

    const stores = [];
    for (const azrieliStore of azrieliStores) {
      // Check if the current store exists in the stores collection
      const store = await storeService.getStoreByName(azrieliStore.storename);
      if (!store) {
        continue; // Skip this store if not found
      }

      // Create a store object
      const checkedStore = {
        storename: store.storename,
        workingHours: azrieliStore.workingHours,
        floor: azrieliStore.floor,
        logoPic: store.logoPic,
        storeType: store.storeType,
      };
      // Add the store object to the mall's stores array
      stores.push(checkedStore);
    }

    return res.status(200).json(stores);
  } catch (error) {
    console.error("Error in getStoresByName function:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getStoresByFloor = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!(await loginController.isLoggedIn(token))) {
    return res.status(401).send();
  }
  const stores = await AztieliStoreService.getStoresByFloor(
    req.params.floor,
    req.params.mallname
  );
  res.status(200).json(stores);
};

const deleteStoreByName = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (loginController.isLoggedIn(token) !== -1) {
    const store = await AztieliStoreService.deleteStoreByName(
      req.params.storename,
      req.params.mallname
    );
    if (!store) {
      return res.status(404).send();
    }
    return res.status(200).json(store);
  }
  res.status(401).send();
};

const updateFloor = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (loginController.isLoggedIn(token) !== -1) {
    const store = await AztieliStoreService.updateFloor(
      req.params.storename,
      req.params.mallname,
      req.params.floor
    );
    if (!store) {
      return res.status(404).send();
    }
    return res.status(200).json(store);
  }
  res.status(401).send();
};

const getStoresByType = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (loginController.isLoggedIn(token) !== -1) {
      const storeType = req.params.storeType;
      const mallName = req.query.mallname; // Use req.query.mallname for the query parameter
      // Get an array of all the stores from the given storeType
      const stores = await storeService.getStoresByType(storeType);
      if (!stores || stores.length === 0) {
        return res
          .status(404)
          .send("No stores found for the given store type.");
      }
      const azrieliStores = [];
      for (const store of stores) {
        // Check if the current store exists in the mall
        const mallStores = await AztieliStoreService.getStoresByName(
          store.storename,
          mallName
        );
        if (!mallStores || mallStores.length === 0) {
          continue;
        }

        // Create a store object
        const checkedStore = {
          storename: store.storename,
          workingHours: mallStores[0].workingHours,
          floor: mallStores[0].floor,
          logoPic: store.logoPic,
          storeType: store.storeType,
        };
        // Add the store object to the mall's stores array
        azrieliStores.push(checkedStore);
      }
      const category = {
        categoryName: storeType,
        storesList: azrieliStores,
      };
      return res.status(200).json(category);
    }
    res.status(401).send("Unauthorized");
  } catch (error) {
    console.error("Error in getStoresByType function: ", error);
    res.status(500).send("Internal Server Error");
  }
};

const getTypes = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (loginController.isLoggedIn(token) !== -1) {
    //Get an array of all the stores from the given mallname
    const azrieliStores = await AztieliStoreService.getStoresByMallName(
      req.params.mallname
    );
    if (!azrieliStores) {
      return res.status(404).send();
    }

    // Initialize an empty object to store unique categories
    const uniqueCategories = {};

    // Iterate through the stores
    let i = 0;
    for (; i < azrieliStores.length; i++) {
      const store = await storeService.getStoreByName(
        azrieliStores[i].storename
      );
      const category = store.storeType;
      // If the category is not already in the object, add it
      if (!uniqueCategories[category]) {
        uniqueCategories[category] = true;
      }
    }

    // Extract the unique categories into an array
    const uniqueCategoriesArray = Object.keys(uniqueCategories);

    return res.status(200).json(uniqueCategoriesArray);
  }
  res.status(401).send();
};

module.exports = {
  createNewStore,
  getStoresByName,
  getStoresByFloor,
  deleteStoreByName,
  updateFloor,
  getStoresByType,
  getTypes,
};
