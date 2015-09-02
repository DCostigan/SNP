var express = require('express');
var router = express.Router();

function User(name, pass) {
  this.name = name;
  this.pass = pass;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/checkuser', function(req, res, next) {
  console.log('Checking for User in Database!\n');
  var name = req.body.uname;
  var pass = req.body.password;
  console.log(name + ' ' + pass + "\n");

  //CLEAR CACHED users[]  --OR--  KEEP SMALL USERS CACHE
  //CALL DATABASE FINDUSER
  var foundUser = 0;
  //IF USER IS IN DB PUSH TO CACHE ARRAY
  var response = ({status: 'INVALID'})
  if(foundUser)
    response = ({status: 'OK'});
  res.json(response);
});

module.exports = router;
