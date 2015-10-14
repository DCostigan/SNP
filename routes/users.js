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

function createUser(name, pass, date, cb){
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query({
    text: "INSERT INTO USERINFO(uname, password, dateCreated) VALUES($1, $2, $3)",
    values: [name, pass, date]
  });
  query.on('error', function(error){
    console.log("GOT A QUERY ERROR on createUser\n " + error);
  });
  query.on("end", function(){
    client.end();
    cb();
  });
}

function checkUserExists(name, cb){
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query("SELECT EXISTS (SELECT 1 FROM USERINFO WHERE USERINFO.uname = $1)", [name]);
  query.on('error', function(error){
    console.log("GOT A QUERY ERROR on checkUserExists\n " + error);
  });
  query.on("row", function(row, result){
    result.addRow(row);
  });
  query.on("end", function(result){
    client.end();
    cb(result.rows);
  });
}

function checkUserCache(name){
  for(var i = 0;i<Users.length;i++){
    if(Users[i].name === name){
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
    var userExists = checkUserCache(name);
    if(userExists){
      console.log("User Already Exists in Cache!");
      res.json({status: 'INVALID'});
    }
    else{
      checkUserExists(name, function(result){
        if(result[0].exists === true){
          addToCache(name, hex);
          console.log("User Already Exists in DB!");
          res.json({status: 'INVALID'});
        }
        else{
          createUser(name, hex, date, function(){
            res.json({status: 'OK'});
          });
        }
      });
    }
  }
  else{
    res.redirect('https://'+req.hostname+":3030"+users+that);
  }
});

module.exports = router;
