var express = require('express');
var router = express.Router();

function User(name, pass) {
    this.name = name;
    this.pass = pass;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Express' });
});

router.post('/checkuser', function(req, res, next) {
    console.log('Checking for User in Database!\n');
    var name = req.body.uname;
    console.log(name + "\n");

    //CLEAR CACHED users[]  --OR--  KEEP SMALL USERS CACHE
    //CALL DATABASE FINDUSER
    var foundUser = 1;
    //IF USER IS IN DB PUSH TO CACHE ARRAY
    //SEND INVITATION TO USER W/ THIS NAME
    var response = ({status: 'INVALID'})
    if(foundUser)
        response = ({status: 'OK'});
    res.json(response);
});

router.post('/removefriend', function(req, res, next) {
    console.log('Removing Friend from list!\n');
    var name = req.body.uname;
    console.log(name + "\n");

    //CLEAR CACHED users[]  --OR--  KEEP SMALL USERS CACHE
    //CALL DATABASE FINDUSER
    var foundUser = 1;
    //IF USER IS IN DB PUSH TO CACHE ARRAY
    //REMOVE ASSOCIATION W/ CURRENT USER
    var response = ({status: 'FAILED'})
    if(foundUser)
        response = ({status: 'OK'});
    res.json(response);
});

module.exports = router;