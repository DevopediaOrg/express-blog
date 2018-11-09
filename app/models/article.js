var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  text: String,
  teaserImgPath: String,
  topic: {
    type: String,
    required: true
  },
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
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  meta: {
    claps: Number 
  }
});

ArticleSchema.pre('save', function (next) {
  next();
});

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;

