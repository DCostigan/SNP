var express = require('express');
var router = express.Router();

function User(name, pass) {
  this.name = name;
  this.pass = pass;
}

//function ensureHTTPS(req, res, next){
//  if(req.secure){
//    return next();
//  };
//  res.redirect('https://'+req.host+":3030");
//};
//
//router.all('*', ensureHTTPS);

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
    console.log(name + ' ' + pass + "\n");

    //CLEAR CACHED users[]  --OR--  KEEP SMALL USERS CACHE
    //CALL DATABASE FINDUSER
    var foundUser = 1;
    //IF USER IS IN DB PUSH TO CACHE ARRAY
    var response = ({status: 'INVALID'})
    if (foundUser)
      response = ({status: 'OK'});
    res.json(response);
  }
  else{
    res.redirect('https://'+req.hostname+":3030"+that);
  }
});

module.exports = router;
