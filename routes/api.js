var Note = require('../models/Note');
var moment = require('moment');

module.exports = function(app, express){
  var apiRouter = express.Router();

  apiRouter.route('/note')
    .get(function(req, res){
      Note.find({}, function(err, data){
        if(err) throw err;
        res.json(data);
      })
    })
    .post(function(req, res){
      var time = moment();

      var note = new Note({
        title : req.body.title,
        description : req.body.description,
        timestamp : time
      });

      note.save(function(err, resp){
        if(err) throw err;
        res.send(resp);
      });
    })
    .put(function(req, res){
      Note.findById(req.body.note_id, function(err, note){
        if(err) throw err;

        if(req.body.title) note.title = req.body.title;
        if(req.body.description) note.description = req.body.description;
        note.timestamp = moment();

        note.save((err, resp) => {
          if(err) throw err;
          res.send(resp);
        });
      })
    })
    .delete(function(req, res){
      console.log(req.body.note_id)
      Note.remove({
        _id : req.body.note_id
      }, function(err, resp){
        if(err) throw err;
        res.send(resp);
      });
    });

    return apiRouter;
};
