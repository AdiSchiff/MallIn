const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Node = new Schema({
    id: {
        type: String,
    },
    x: {
        type: Number
    },
    y: {
        type: Number,
    },
    edges: {
        type: [String],
    },
    floor: {
        type: Number,
    },
    name: {
        type: String
    }
});

module.exports = mongoose.model('Node',Node);