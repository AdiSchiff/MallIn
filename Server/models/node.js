const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  x: {
    type: String,
    required: true
  },
  y: {
    type: String,
    required: true
  },
  w: {
    type: String,
    required: true
  },
  h: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  raisedBorder: {
    type: String,
    required: true
  },
  fill: {
    type: String,
    required: true
  },
  outline: {
    type: String,
    required: true
  },
  edges: {
    type: [String],
    required: true
  }
}, { collection: 'nodes' }); // Explicitly specify the collection name

const Node = mongoose.model('Node', nodeSchema);
