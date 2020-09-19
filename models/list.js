const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  listName: String,
  color: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const List = mongoose.model('List', listSchema);

module.exports = List;