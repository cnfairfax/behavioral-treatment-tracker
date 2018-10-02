var express = require('express');
var router = express.Router();
var loggedIn = () => { return false };

/* GET */
router.get('/', function(req, res, next) {
  if(!loggedIn()) {
    res.render('login', { title: 'Login'});
  } else {
    res.render('index', { title: 'Express' });
  }
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* POST */
router.post('/register', function(req, res, next) {
  console.log(JSON.stringify(req.body))
  res.render('/login', { title: 'Login' });
});

module.exports = router;
