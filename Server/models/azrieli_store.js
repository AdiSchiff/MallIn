const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AzrieliStore = new Schema({
    storename: {
        type: String,
    },
    workingHours: {
        type: String,
    },
    floor: {
        type: Number,
    },
    mallname: {
        type: String
    },
    id: {
        type: String
    }
});

module.exports = mongoose.model('AzrieliStore',AzrieliStore);