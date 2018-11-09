var mongoose = require('mongoose');
var timestamp = require('mongoose-timestamp');

var TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: String,
  teaserImgPath: String
});

TopicSchema.plugin(timestamp);

TopicSchema.pre('save', function (next) {
  next();
});

var Topic = mongoose.model('Topic', TopicSchema);
module.exports = Topic;

