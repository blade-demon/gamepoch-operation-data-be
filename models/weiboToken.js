var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TokenSchema = new Schema({
  access_token: String,
  expires_in: Number,
  uid: String,
  date: {type: Date, default: Date.now}
});


mongoose.model('WeiboToken', TokenSchema);