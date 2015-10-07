var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  title : {
      type : 'String',
      required : true,
  },
  description : 'String',
  timestamp : 'String'
});

module.exports = mongoose.model('note', noteSchema);
