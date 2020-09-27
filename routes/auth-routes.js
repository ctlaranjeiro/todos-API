const express    = require('express');
const authRoutes = express.Router();
const passport   = require('passport');
const bcrypt     = require('bcrypt');

const User = require('../models/user');
const List = require('../models/list');

// POST signup
authRoutes.post('/signup', (req, res, next) => {
  
  const { username, password } = req.body;

  // error checking
  if (!username || !password) {
    res.status(400).json({ message: 'Please, provide username and password.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    return;
  }


  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({message: "Username check went bad."});
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'Username already registered. Try to login' });
      return;
    }

    // encrypt password
    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    // create new user
    const newUser = new User({
      username: username,
      password: hashPass,
      profilePicture: 'https://res.cloudinary.com/ctlaranjeiro/image/upload/v1600545427/todos-app/defaultAvatar_yuyo0v.jpg'
    });

    newUser.save(err => {
      if (err) {
        res.status(400).json({ message: 'Saving user to database went wrong.' });
        console.log('err:', err);
        return;
      }

      List.findOne({ $and: [ { user: newUser._id }, { listName: `Todo List` } ]}, (err, foundList) => {
        if (err) {
          res.status(500).json({message: "List check went bad."});
          return;
        }
    
        if (foundList) {
          res.status(400).json({ message: 'List already exists.' });
          return;
        }

        const defaultList = new List({
          listName: `Todo List`,
          color: '#D8660D',
          user: newUser._id
        });

        defaultList.save(err => {
          if (err) {
            res.status(400).json({ message: 'Saving default list to database went wrong.' });
            console.log('err:', err);
            return;
          }

          User.updateOne({ _id: newUser._id }, { $set: { lists: defaultList._id }})
            .then(() => {

              User.findOne({ _id: newUser._id })
                .then(userFromDB => {
                  req.login(userFromDB, (err) => {
                    if (err) {
                      res.status(500).json({ message: 'Login after signup went bad.' });
                      console.log('err:', err);
                      return;
                    }
          
                    // send the user information to the frontend
                    res.status(200).json(req.user);
                  });
                })
                .catch(err => {
                  res.status(400).json({message: "Error while fetching user from DB."});
                  console.log('err:', err);
                });
            })
            .catch(err => {
              res.status(500).json({message: "Updating user list in DB went bad."});
              console.log('err:', err);
            });

        });
      });
    });

  });
});


// POST login
authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }

      res.status(200).json(theUser);
    });
  })(req, res, next);
});


// POST logout
authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Logout successful!' });
});


// GET loggedin
authRoutes.get('/isloggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(200).json({});
});


module.exports = authRoutes;