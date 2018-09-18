var mongoose = require('mongoose');

var weiboSchema = mongoose.Schema({
  mid: String,
  publishAt: String,
  status: String,
  readTimes: Number,
  readAmounts: Number,
  interAmounts: Number,
  clickNumber: Number,
  reposts: Number,
  comments: Number,
  favs: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('weibo', weiboSchema);