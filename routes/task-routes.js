const express       = require('express');
const taskRoutes    = express.Router();
const mongoose      = require('mongoose');

const List = require('../models/list');
const Task = require('../models/task');


// POST new task
taskRoutes.post('/task', (req, res, next) => {
  const { task, listId, userId } = req.body;

  Task.create({
    task,
    completed: false,
    list: listId,
    user: userId
  })
    .then(response => {
      List.findByIdAndUpdate(listId, {
        $push: { tasks: response._id }
      })
        .then(response => {
          // ****** I get a delayed response - it doesn't include the most recent task created in the list
          res.status(200).json(response);
        })
        .catch(err => {
          res.status(500).json({ message: `Error while updating list: ${err}` });
        });
    })
    .catch(err => {
      res.status(500).json({ message: `Error while creating new task: ${err}` });
    });
});

// PUT update task details
taskRoutes.put('/task/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid'});
  }

  // change task name or completed state
  Task.findByIdAndUpdate(req.params.id, req.body)
    .then(response => {
      res.status(200).json({ message: `Task ${response} was updated successfully.`});
    })
    .catch(err => {
      res.status(400).json({ message: `Error while updating task: ${err}` });
    });
});


// DELETE task
taskRoutes.delete('/task/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Specified id is not valid'});
  }

  Task.findByIdAndDelete(id)
    .then(response => {
      List.findOneAndUpdate(
        {tasks: { $in: [id] }}, 
        {$pull: {tasks: { $in: [id] }}}
      )
      .then(response => {
        res.status(200).json({ message: `List ${response} was deleted successfully.`});
      })
      .catch(err => {
        res.status(400).json({ message: `Error while updating tasks in list: ${err}` });
      });
    })
    .catch(err => {
      res.status(400).json({ message: `Error while deleting task: ${err}` });
    });
});


module.exports = taskRoutes;