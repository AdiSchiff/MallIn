const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Store = new Schema({
    storename: {
        type: String,
    },
    storeType: {
        type: String
    },
    logoPic: {
        type: String,
    }
});

module.exports = mongoose.model('Store',Store);