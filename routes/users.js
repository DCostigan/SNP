var express = require('express');
var router = express.Router();

function User(name, pass) {
  this.name = name;
  this.date = newDate();
  this.pass = pass;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Express' });
});

router.post('/postuser', function(req, res, next){
  var name = req.body.uname;
  var pass = req.body.password;

  console.log( name + " " + pass + "\n");
  //ADD USER TO DB
  //IF SUCCESSFULL RESPOND W/ OK
  res.json({status: 'OK'});
});

module.exports = router;
