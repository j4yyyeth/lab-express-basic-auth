var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model')

/* GET users listing. */

router.get('/signup', (req, res, next)=>{
  res.render('signup.hbs')
})

router.post('/signup', (req, res, next)=>{
  console.log('logged in');
  const {username, password} = req.body;

  bcryptjs
  .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/users/login')
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    });
})

router.get('/login', (req, res, next)=>{
  res.render('login.hbs')
})

router.post('/login', (req, res, next)=>{
  const {username, password} = req.body;
  if (!username || !password) {
    res.render('login.hbs')
    return;
  }

  User.findOne({username})
  .then(user=>{
    if (!user) {
      res.render('login.hbs')
      return;
    }
    else if (bcryptjs.compareSync(password, user.password)) {
      req.session.user = user;
      console.log(req.session);
      res.redirect('/users');
    }
    else {
      res.render('login.hbs', { errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => next(error));
})

router.get('/', (req, res, next) => {
  const user = req.session.user
  res.render('user.hbs', {user});
});
module.exports = router;
