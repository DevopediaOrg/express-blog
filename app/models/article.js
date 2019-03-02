var mongoose = require('mongoose');
var user = require('./user');
var topic = require('./topic');

var ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  text: String,
  teaserImgPath: String,
  state: {
    type: String,
    enum: [
      'draft',
      'published',
      'deleted'
    ],
    default: 'draft'
  },
  createdAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date,
  meta: {
    featured: Boolean,
    claps: Number 
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }
});

ArticleSchema.pre('save', function (next) {
  next();
});

ArticleSchema.statics.listPubLatest = function (limit=3) {
  return this.find({state: 'published'}).
    sort({publishedAt: -1}).
    limit(limit).
    populate('authorId', ['firstname', 'lastname']).
    populate('topicId', 'title');
};

ArticleSchema.statics.listPubFeatured = function (limit=3) {
  return this.find({state: 'published', 'meta.featured': true}).
    sort({'meta.claps': -1}).
    limit(limit).
    populate('authorId', ['firstname', 'lastname']).
    populate('topicId', 'title');
};

ArticleSchema.statics.countByTopic = function () {
  return this.find({state: 'published'}).
    populate('topicId', 'title');
};

ArticleSchema.statics.countByAuthor = function () {
  return this.find({}, {state: 1, 'authorId.firstname': 1, 'authorId.lastname': 1}).
    populate('authorId', ['firstname', 'lastname']);
};

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;

