const express           = require('express');
const listRoutes     = express.Router();

const User = require('../models/user');
const List = require('../models/list');
const Task = require('../models/task');


// POST new list


module.exports = listRoutes;