const express        = require('express');
const listRoutes     = express.Router();
const mongoose       = require('mongoose');

const User = require('../models/user');
const List = require('../models/list');
const Task = require('../models/task');


// POST new list
listRoutes.post('/list', (req, res, next) => {
  const { listName, color, userId } = req.body;

  List.create({
    listName,
    color,
    user: userId
  })
    .then(response => {
      User.findByIdAndUpdate(userId, {
        $push: { lists: response._id }
      })
        .then(response => {
          // ****** I get a delayed response - it doesn't include the most recent task created in the list
          res.status(200).json(response);
        })
        .catch(err => {
          res.status(400).json({ message: `Error while updating user's lists: ${err}` });
        });
    })
    .catch(err => {
      res.status(500).json({ message: `Error while creating new list: ${err}` });
    });
});


// PUT update list details
listRoutes.put('/list/:id', (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Specified id is not valid'});
  }

  // change list name or color
  List.findByIdAndUpdate(id, req.body)
    .then(response => {
      res.status(200).json({ message: `List ${response} was updated successfully.`});
    })
    .catch(err => {
      res.status(400).json({ message: `Error while updating list: ${err}` });
    });

});


// DELETE list
listRoutes.delete('/list/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Specified id is not valid'});
  }

  List.findByIdAndDelete(id)
    .then(response => {
      User.findOneAndUpdate(
        {lists: { $in: [id] }}, 
        {$pull: {lists: { $in: [id] }}}
      )
      .then(response => {
        Task.deleteMany({list: id})
          .then(response => {
            res.status(200).json({ message: `Tasks ${response} were deleted successfully.`});
          })
          .catch(err => {
            res.status(400).json({ message: `Error while deleting list tasks: ${err}` });
          });
      })
      .catch(err => {
        res.status(400).json({ message: `Error while updating lists in user: ${err}` });
      });
    })
    .catch(err => {
      res.status(400).json({ message: `Error while deleting task: ${err}` });
    });
});


module.exports = listRoutes;