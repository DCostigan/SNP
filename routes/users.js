var express = require('express');
var router = express.Router();

//var users = [];
//
//function User(name, pass) {
//  this.name = name;
//  this.date = newDate();
//  this.pass = pass;
//}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Express' });
});

//router.get('/postuser', function(req, res, next){
//  var name = req.body.uname;
//  var pass = req.body.password;
//  var timePosted = req.body.posted;
//
//  console.log('received post: ' + name + ' (password: ' + password + ' ) at ' + timePosted);
//  users.push(new User(name, pass, timePosted));
//  res.json({status: 'OK'});
//});

module.exports = router;
