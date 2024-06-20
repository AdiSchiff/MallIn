const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Node = new Schema({
    id: {
        type: String,
    },
    x: {
        type: float
    },
    y: {
        type: float,
    },
    edges: {
        type: [String],
    }
});

module.exports = mongoose.model('Node',Node);