var express = require('express');
var router = express.Router();
var pg = require('pg');
var crypto = require("crypto");
var conString = 'postgres://postgres:Redbird777@localhost:5432/snp';

var client = new pg.Client(conString);

function createUser(name, pass, date){
  client.connect();
  var query = client.query("INSERT INTO USERINFO(uname, password, dateCreated) VALUES($1, $2, $3)", [name, pass, date]);
  query.on("end", function(){
    client.end();
  });
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
  var users = '/users';
  if(req.secure) {
    var name = req.body.uname;
    var pass = req.body.password;
    var shasum = crypto.createHash('sha1');
    shasum.update(pass);
    var hex = shasum.digest('hex');
    var date = new Date();
    createUser(name, hex, date);
    res.json({status: 'OK'});
  }
  else{
    res.redirect('https://'+req.hostname+":3030"+users+that);
  }
});

module.exports = router;
