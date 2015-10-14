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

function verifyUser(name, pass){
  client.connect();
  var query = client.query("SELECT EXISTS(SELECT 1 FROM USERINFO WHERE USERINFO.uname = $1 AND USERINFO.password = $2", [name, pass]);
  query.on("error", function(){
    console.log("SOMETHING WENT HORRIBLE WITH THE QUERY\n");
  });
  query.on("row", function(row, result){
    result.addRow(row);
  });
  query.on("end", function(result){
    client.end();
    if(result.rows.length > 0)
      return 1;
    else
      return 0;
  });
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

    //CLEAR CACHED users[]  --OR--  KEEP SMALL USERS CACHE
    //CALL DATABASE FINDUSER
    var foundUser = 1;
    //checkCache(name, hex);

    //verifyUser(name, hex);
    //IF USER IS IN DB PUSH TO CACHE ARRAY
    var response = ({status: 'INVALID'});
    if (foundUser)
      response = ({status: 'OK'});
    res.json(response);
  }
  else{
    res.redirect('https://'+req.hostname+":3030"+that);
  }
});

module.exports = router;
