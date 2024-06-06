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
    },
    workingHours: {
        type: String,
    },
    floor: {
        type: Number,
    },
    mallname: {
        type: String
    }
});

const User = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    displayName: {
        type: String,
    },
    favorites: {
        type: [Store],
        default: []
    }
   
});


const user = mongoose.model('User',User);
