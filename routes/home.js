var express = require('express');
var router = express.Router();

var friends = [];
var invites = [];

function friend(uname, fname){
    this.uname = uname;
    this.fname = fname;
}

function invite(uname, iname, type){
    this.uname = uname;
    this.iname = iname;
    this.type = type;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var that = '/';
    var home = '/home';
    if(req.secure)
        res.render('home', { title: 'Express' });
    else
        res.redirect('https://'+req.hostname+":3030"+home+that);
});

router.post('/postupdates', function(req, res, next) {
    var that = "/postupdates";
    var home = '/home';
    if(req.secure) {
        console.log('Entering Post Updates!\n');
        var name = req.body.uname;
        console.log(name + "\n");

        //GET FRIENDS FOR NAME
        //GET INVITES FOR NAME
        //CLEAR FRIENDS AND INVITE CACHE
        friends.splice(0, friends.length);
        invites.splice(0, invites.length);

        // IF FOUND PUSH TO CACHE ARRAY
        friends.push(new friend(name, "friend@test.com"));
        invites.push(new invite(name, "invite@test.com", "sent"));
        invites.push(new invite(name, "invite@test.com", "received"));

        var lastFriend = parseInt(req.body.lastFriend, 10);
        var lastInvite = parseInt(req.body.lastInvitation, 10);

        var restFriend = friends.slice(lastFriend, friends.length);
        var restInvite = invites.slice(lastInvite, invites.length);
        var fullJSON = restFriend.concat(restInvite);
        res.json(fullJSON);
    }
    else{
        res.redirect('https://'+req.hostname+":3030"+home+that);
    }
});

router.post('/checkuser', function(req, res, next) {
    var that = '/checkuser';
    var home = '/home';
    if(req.secure) {
        console.log('Checking for User in Database!\n');
        var name = req.body.uname;
        console.log("Name: " + name + "\n");

        //CLEAR CACHED users[]  --OR--  KEEP SMALL USERS CACHE
        //CALL DATABASE FINDUSER
        var foundUser = 1;
        //IF USER IS IN DB PUSH TO CACHE ARRAY
        //SEND INVITATION TO USER W/ THIS NAME
        var response = ({status: 'INVALID'})
        if (foundUser)
            response = ({status: 'OK'});
        res.json(response);
    }
    else
        res.redirect('https://'+req.hostname+":3030"+home+that);
});

router.post('/removefriend', function(req, res, next) {
    var that = '/removefriend';
    var home = '/home';
    if(req.secure) {
        console.log('Removing Friend from list!\n');
        var name = req.body.uname;
        var fname = req.body.fname;
        console.log(name + " " + fname + "\n");

        //GET FRIENDS FOR NAME
        //REMOVE FRIEND W/ FNAME FROM LIST

        var removedFriend = 1;
        //IF USER IS IN DB PUSH TO CACHE ARRAY
        //REMOVE ASSOCIATION W/ CURRENT USER
        var response = ({status: 'FAILED'})
        if (removedFriend)
            response = ({status: 'OK'});
        res.json(response);
    }
    else
        res.redirect('https://'+req.hostname+":3030"+home+that);
});

router.post('/addfriend', function(req, res, next) {
    var that = '/addfriend';
    var home = '/home';
    if(req.secure) {
        console.log('Adding Friend to list!\n');
        var name = req.body.uname;
        var iname = req.body.iname;
        console.log(name + " " + iname + "\n");

        //GET FRIENDS FOR NAME
        //REMOVE FRIEND W/ FNAME FROM LIST

        var addedFriend = 1;
        //IF USER IS IN DB PUSH TO CACHE ARRAY
        //REMOVE ASSOCIATION W/ CURRENT USER
        var response = ({status: 'FAILED'})
        if (addedFriend)
            response = ({status: 'OK'});
        res.json(response);
    }
    else
        res.redirect('https://'+req.hostname+":3030"+home+that);
});

router.post('/deleteinvite', function(req, res, next) {
    var that = '/deteleinvite';
    var home = '/home';
    if(req.secure) {
        console.log('Removing Invite from list!\n');
        var name = req.body.uname;
        var iname = req.body.iname;
        console.log(name + " " + iname + "\n");

        //GET FRIENDS FOR NAME
        //REMOVE FRIEND W/ FNAME FROM LIST

        var removedInvite = 1;
        //IF USER IS IN DB PUSH TO CACHE ARRAY
        //REMOVE ASSOCIATION W/ CURRENT USER
        var response = ({status: 'FAILED'})
        if (removedInvite)
            response = ({status: 'OK'});
        res.json(response);
    }
    else
        res.redirect('https://'+req.hostname+":3030"+home+that);
});

module.exports = router;