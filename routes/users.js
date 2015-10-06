var express = require('express');
var router = express.Router();

function User(name, pass) {
  this.name = name;
  this.date = newDate();
  this.pass = pass;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var that = '/';
  var users = '/users'
  if(req.secure)
    res.render('users', { title: 'Express' });
  else
    res.redirect('https://'+req.hostname+":3030"+users+that);
});

router.post('/postuser', function(req, res, next){
  var that = '/postuser';
  var users = '/users'
  if(req.secure) {
    var name = req.body.uname;
    var pass = req.body.password;

    console.log(name + " " + pass + "\n");
    //ADD USER TO DB
    //IF SUCCESSFULL RESPOND W/ OK
    res.json({status: 'OK'});
  }
  else{
    res.redirect('https://'+req.hostname+":3030"+users+that);
  }
});

module.exports = router;
