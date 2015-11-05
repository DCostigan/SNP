var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var http = require('http');
var io = require('socket.io');

var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/home', home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var options = {
  key: fs.readFileSync('./agent2-key.pem'),
  cert: fs.readFileSync('./agent2-cert.pem')
};

var server = https.createServer(options, app).listen(3030);
var ios = io.listen(server);

var pg = require('pg');
var conString = 'postgres://postgres:Redbird777@localhost:5432/snp';

function getUsersFriendKeys(name, cb){
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query("SELECT * FROM Sessions");
  query.on('error', function(error){
    console.log("GOT A QUERY ERROR on getUsersFriendKeys\n " + error);
  });
  query.on("row", function(row, result){
    result.addRow(row);
  });
  query.on("end", function(result){
    client.end();
    cb(result.rows);
  });
}


ios.sockets.on('connection', function(socket) {
  console.log("ESTABLSIHING CONNECTION\n");
  socket.emit('hello');
  socket.on('response', function (data) {
    console.log("CREATING RESPONSE\n");
    if(data.user !== '') {
      getUsersFriendKeys(data.user, function (result) {
        socket.emit('info', {'data': result});
      });
    }
    else{
      socket.emit('info', {'data': null});
    }
  });
});


module.exports = app;
