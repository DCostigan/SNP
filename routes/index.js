var express = require('express');
var router = express.Router();

//var users = [];
//
//function User(name, pass) {
//  this.name = name;
//  this.date = newDate();
//  this.pass = pass;
//}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//router.post('/checkuser', function(req, res, next) {
//
//});

module.exports = router;
