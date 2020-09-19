const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: String,
  completed: Boolean,
  list: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;