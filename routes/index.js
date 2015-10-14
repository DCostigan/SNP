var express = require('express');
var router = express.Router();
var pg = require('pg');
var crypto = require("crypto");
var conString = 'postgres://postgres:Redbird777@localhost:5432/snp';

function User(name, pass) {
  this.name = name;
  this.pass = pass;
}

var Users = [];

function checkUserPassExists(name, pass, cb){
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query("SELECT EXISTS(SELECT 1 FROM USERINFO WHERE USERINFO.uname = $1 AND USERINFO.password = $2)", [name, pass]);
  query.on('error', function(error){
    console.log("GOT A QUERY ERROR on checkUserPassExists\n " + error);
  });
  query.on("row", function(row, result){
    result.addRow(row);
  });
  query.on("end", function(result){
    client.end();
    cb(result.rows);
  });
}

function checkUserCache(name, password){
  for(var i = 0;i<Users.length;i++){
    if(Users[i].name === name && Users[i].pass === password){
      return 1;
    }
  }
  return 0;
}

function addToCache(name, hex) {
  if (Users.length < 10) {
    Users.push(new User(name, hex));
  }
  else if (Users.length > 10) {
    Users.splice(0, Users.length);
    Users.push(new User(name, hex));
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var that = '/';
  if(req.secure)
    res.render('index', { title: 'Express' });
  else
    res.redirect('https://'+req.hostname+":3030"+that);
});

router.post('/checkuser', function(req, res, next) {
  var that = '/checkuser';
  if(req.secure) {
    console.log('Checking for User in Database!\n');
    var name = req.body.uname;
    var pass = req.body.password;
    var shasum = crypto.createHash('sha1');
    shasum.update(pass);
    var hex = shasum.digest('hex');
    var userExists = checkUserCache(name, hex);
    if(userExists){
      console.log("User Already Exists in Cache!");
      res.json({status: 'OK'});
    }
    else{
      checkUserPassExists(name, hex, function(result){
        if(result[0].exists === true){
          addToCache(name, hex);
          console.log("User Already Exists in DB!");
          res.json({status: 'OK'});
        }
        else{
          res.json({status: 'INVALID'});
        }
      });
    }
  }
  else{
    res.redirect('https://'+req.hostname+":3030"+that);
  }
});

module.exports = router;
