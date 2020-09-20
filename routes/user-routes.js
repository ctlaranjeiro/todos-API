const express      = require('express');
const userRoutes   = express.Router();
const mongoose     = require('mongoose');

const User = require('../models/user');
const List = require('../models/list');
const Task = require('../models/task');


// PUT update user settings
userRoutes.put('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Specified id is not valid'});
  }

  /* const {
    username,
    password,
    profilePicture
  } =  req.body; */

  // Update username
  User.findByIdAndUpdate({ _id: id }, req.body)
    .then((responseFromAPI) => {
      res.status(200).json({message: `User ${responseFromAPI} was updated successfully!`});
    })
    .catch(err => {
      res.status(400).json({ message: `${err}`});
    });
});

userRoutes.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Specified id is not valid'});
  }

  req.session.destroy(() => {
    // Delete all tasks created by the user
    // Delete all lists created by the user
    // Delete user
  });

});


module.exports = userRoutes;