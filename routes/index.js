var express = require('express');
var router = express.Router();

var users = [];

//Temporarily add user to be checked against
users.push(new User('admin', 'password'));

function User(name, pass) {
  this.name = name;
  this.pass = pass;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/checkuser', function(req, res, next) {
  console.log('Checking User in Database!\n');
  //CLEAR CACHED users[]
  //CALL DATABASE FINDUSER
  //IF USER IS IN users[]
  var last = parseInt(req.body.last, 10);
  var rest = users.slice(last, users.length);
  res.json(rest);
});

module.exports = router;
