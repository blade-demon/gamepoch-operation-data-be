var mongoose = require('mongoose');

var WechatTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

WechatTokenSchema.pre('save', function(next){
  // 每次修改保证token的时间都是最新的
  this.createdAt = new Date();
  next();
});

module.exports = mongoose.model('WechatToken', WechatTokenSchema);