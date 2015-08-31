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

module.exports = router;