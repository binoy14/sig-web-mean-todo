var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
var app = express();

mongoose.connect(config.database);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

var apiRouter = require('./routes/api.js')(app, express);
app.use('/api', apiRouter);

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/404.html'));
});

app.listen(3000);
console.log('Server started');
