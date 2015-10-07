var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Note = require('./models/Note');
var app = express();

mongoose.connect('mongodb://localhost:27017/mean-todo');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  //res.send('Hello World');
  res.sendFile('index.html');
});

app.post('/api/note', function(req, res){
  // console.log(req.body);
  // res.end();

  var note = new Note({
    title : req.body.title,
    description : req.body.description
  });

  note.save(function(err, resp){
    if(err) throw err;
    res.send(resp);
  });
});

app.listen(3000);
console.log('Server started');
