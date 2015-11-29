/**
 * Created by Derek on 11/28/2015.
 */
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    var that = '/';
    var home = '/about';
    if(req.secure)
        res.render('about', { title: 'Express' });
    else
        res.redirect('https://'+req.hostname+":3030"+home+that);
});

module.exports = router;