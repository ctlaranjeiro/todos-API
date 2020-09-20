const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  list: String,
  color: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' , autopopulate: true}],
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

listSchema.plugin(require('mongoose-autopopulate'));

const List = mongoose.model('List', listSchema);

module.exports = List;