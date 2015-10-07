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
    });

    return apiRouter;
};
