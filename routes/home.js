var express = require('express');
var router = express.Router();
var pg = require('pg');
var crypto = require("crypto");
var conString = 'postgres://postgres:Redbird777@localhost:5432/snp';

var friends = [];
var invites = [];
var Users = [];

function friend(uname, fname){
    this.uname = uname;
    this.fname = fname;
}

function invite(uname, iname, type){
    this.uname = uname;
    this.iname = iname;
    this.type = type;
}

function User(name) {
    this.name = name;
}

function checkUserCache(name){
    for(var i = 0;i<Users.length;i++){
        if(Users[i].name === name){
            return 1;
        }
    }
    return 0;
}

function addToUserCache(name) {
    if (Users.length < 10) {
        Users.push(new User(name));
    }
    else if (Users.length > 10) {
        Users.splice(0, Users.length);
        Users.push(new User(name));
    }
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

function sendInviteToUser(sname, rname, cb){
    var client = new pg.Client(conString);
    client.connect();
    var oneResult = 0;
    var twoResult = 0;
    var queryOne = client.query("SELECT id FROM USERINFO WHERE uname = $1", [sname]);
    queryOne.on('error', function(error){
        console.log("GOT A QUERY ERROR on sendInviteToUser getting ID from sname\n " + error);
    });
    queryOne.on("row", function(row, result){
        result.addRow(row);
    });
    queryOne.on("end", function(result){
        console.log(result.rows[0].id);
        oneResult = result.rows[0].id;
        var queryTwo = client.query("SELECT id FROM USERINFO WHERE uname = $1", [rname]);
        queryTwo.on('error', function(error){
            console.log("GOT A QUERY ERROR on sendInviteToUser getting ID from rname\n " + error);
        });
        queryTwo.on("row", function(row, result){
            result.addRow(row);
        });
        queryTwo.on("end", function(result){
            twoResult = result.rows[0].id;
            var queryThree = client.query("INSERT INTO INVITES VALUES($1, $2)", [oneResult, twoResult]);
            queryThree.on('error', function(error){
                console.log("GOT A QUERY ERROR on sendInviteToUser inserting values\n " + error);
            });
            queryThree.on("end", function(result){
                client.end();
                cb();
            });
        });
    });
}

function retrieveFriends(name, cb){
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query("SELECT u1.uname as fname, u2.uname as fname2, fid, fid2 FROM FRIENDS, USERINFO u1, USERINFO u2 WHERE ((u1.id = FRIENDS.fid AND u2.id = FRIENDS.fid2) OR (u2.id = FRIENDS.fid AND u1.id = FRIENDS.fid2)) AND u1.uname = $1", [name]);
    query.on('error', function(error){
        console.log("GOT A QUERY ERROR on retrieveFriends\n " + error);
    });
    query.on("row", function(row, result){
        result.addRow(row);
    });
    query.on("end", function(result){
        client.end();
        cb(result.rows);
    });
}

function retrieveSentInvites(name, cb){
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query("SELECT u1.uname AS sname, u2.uname AS rname, sid, rid FROM INVITES, USERINFO u1, USERINFO u2 WHERE u1.id = INVITES.sid AND u2.id = INVITES.rid AND u1.uname = $1", [name]);
    query.on('error', function(error){
        console.log("GOT A QUERY ERROR on retrieveSentInvites\n " + error);
    });
    query.on("row", function(row, result){
        result.addRow(row);
    });
    query.on("end", function(result){
        client.end();
        cb(result.rows);
    });
}

function retrieveReceivedInvites(name, cb){
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query("SELECT u1.uname AS sname, u2.uname AS rname, sid, rid FROM INVITES, USERINFO u1, USERINFO u2 WHERE u1.id = INVITES.sid AND u2.id = INVITES.rid AND u2.uname = $1", [name]);
    query.on('error', function(error){
        console.log("GOT A QUERY ERROR on retrieveReceivedInvites\n " + error);
    });
    query.on("row", function(row, result){
        result.addRow(row);
    });
    query.on("end", function(result){
        client.end();
        cb(result.rows);
    });
}

function validateSession(name, session, cb){
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query("SELECT EXISTS(SELECT 1 FROM SESSIONS, USERINFO WHERE USERINFO.uname = $1 AND USERINFO.id = SESSIONS.id AND SESSIONS.session = $2)", [name, session]);
    query.on('error', function(error){
        console.log("GOT A QUERY ERROR on validateSession\n " + error);
    });
    query.on("row", function(row, result){
        result.addRow(row);
    });
    query.on("end", function(result){
        client.end();
        cb(result.rows);
    });
}

function removeFriend(name, fname, cb){
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query("DELETE FROM FRIENDS WHERE (fid = (SELECT id FROM USERINFO WHERE uname = $1) AND fid2 = (SELECT id FROM USERINFO WHERE uname = $2)) OR (fid = (SELECT id FROM USERINFO WHERE uname = $3) AND fid2 = (SELECT id FROM USERINFO WHERE uname = $4))", [name,fname,fname,name]);
    query.on('error', function(error){
        console.log("GOT A QUERY ERROR on removeFriend\n " + error);
    });
    query.on("end", function(){
        client.end();
        cb();
    });
}

function addFriend(name, iname, cb){
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query("INSERT INTO FRIENDS VALUES ((SELECT id FROM USERINFO WHERE uname = $1), (SELECT id FROM USERINFO WHERE uname = $2))", [name, iname]);
    query.on('error', function(error){
        console.log("GOT A QUERY ERROR on removeFriend\n " + error);
    });
    query.on("end", function(){
        client.end();
        cb();
    });
}

function removeInvite(name, iname, cb){
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query("DELETE FROM INVITES WHERE (sid = (SELECT id FROM USERINFO WHERE uname = $1) AND rid = (SELECT id FROM USERINFO WHERE uname = $2)) OR (sid = (SELECT id FROM USERINFO WHERE uname = $3) AND rid = (SELECT id FROM USERINFO WHERE uname = $4))", [name,iname,iname,name]);
    query.on('error', function(error){
        console.log("GOT A QUERY ERROR on removeFriend\n " + error);
    });
    query.on("end", function(){
        client.end();
        cb();
    });
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
        var session = req.body.session;
        var shakey = crypto.createHash('sha1');
        shakey.update(session);
        var hexkey = shakey.digest('hex');
        console.log(name + ' ' +  hexkey + "\n");

        validateSession(name, hexkey, function(result){
            if(result[0].exists === false){
                //Add to Session cache
                res.json({status: 'INVALID'});
            }
            else{
                retrieveFriends(name, function(result){
                    console.log("Friends: " + result.length);
                    friends.splice(0, friends.length);
                    if(result.length > 0){
                        for(var i = 0;i<result.length;i++){
                            friends.push(new friend(result[i].fname, result[i].fname2));
                        }
                    }
                    retrieveSentInvites(name, function(result){
                        console.log("Sent Invites: "+ result.length);
                        invites.splice(0, invites.length);
                        if(result.length > 0){
                            for(var i = 0;i<result.length;i++){
                                invites.push(new invite(result[i].sname, result[i].rname, "sent"));
                            }
                        }
                        retrieveReceivedInvites(name, function(result){
                            console.log("Recieved Invites: " + result.length);
                            // IF FOUND PUSH TO CACHE ARRAY
                            if(result.length > 0){
                                for(var i = 0;i<result.length;i++){
                                    invites.push(new invite(result[i].rname, result[i].sname, "received"));
                                }
                            }

                            var lastFriend = parseInt(req.body.lastFriend, 10);
                            var lastInvite = parseInt(req.body.lastInvitation, 10);

                            var restFriend = friends.slice(lastFriend, friends.length);
                            var restInvite = invites.slice(lastInvite, invites.length);
                            var fullJSON = restFriend.concat(restInvite);
                            res.json(fullJSON);
                        });
                    });
                });
            }
        });
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
        var cookie = req.body.cookiename;
        var userExists = checkUserCache(name);
        if(userExists){
            console.log("User Already Exists in Cache!");
            sendInviteToUser(cookie, name, function(){
                res.json({status: 'OK'});
            });
        }
        else{
            checkUserExists(name, function(result){
                if(result[0].exists === true){
                    addToUserCache(name);
                    console.log("User Already Exists in DB!");
                    sendInviteToUser(cookie, name, function(){
                        res.json({status: 'OK'});
                    });
                }
                else{
                    res.json({status: 'INVALID'});
                }
            });
        }
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

        removeFriend(name, fname, function(){
            //DO SOMETHING ABOUT PKeys
            //IF USER IS IN DB PUSH TO CACHE ARRAY
            res.json({status: 'OK'});
        });
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

        addFriend(name, iname, function(){
            removeInvite(name, iname, function(){
                //DO SOMETHING ABOUT Pkeys
                //IF USER IS IN DB PUSH TO CACHE ARRAY
                res.json({status: 'OK'});
            });
        });
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

        removeInvite(name, iname, function(){
            res.json({status: 'OK'});
        });
    }
    else
        res.redirect('https://'+req.hostname+":3030"+home+that);
});

module.exports = router;