var express = require('express');
var router = express.Router();

const { loggedIn, loggedOut } = require('../middleware/route-secure.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main', loggedIn,(req, res, next)=>{
  res.render('main.hbs')
})

router.get('/private', loggedIn, (req, res, next)=>{
  res.render('private.hbs')
})


module.exports = router;
