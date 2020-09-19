const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  profilePicture: String,
  lists: [{ type: Schema.Types.ObjectId, ref: 'List', autopopulate: true }]
});

userSchema.plugin(require('mongoose-autopopulate'));

const User = mongoose.model('User', userSchema);

module.exports = User;