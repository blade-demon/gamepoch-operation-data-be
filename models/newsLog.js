var mongoose = require('mongoose');
var axios = require("axios");
var fakeIp = require("../tests/seed/ip");

var NewsLogSchema = mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  newsId: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: new Date().getTime() + 3600 * 8 * 1000
  },
  regionName:{
    type: String
  },
  source: {
    type: String,
    required: true,
    enum:["gamepoch.com","gamepoch.cn","kof"]
  }
});

NewsLogSchema.pre('save', function(next) {
  var log = this;
  var ipArrays = fakeIp;
  console.log(fakeIp);
  //axios.get('http://ip-api.com/json/' + this.ip).then(response => {
  axios.get('http://ip-api.com/json/' + ipArrays[parseInt(Math.random()*100)]).then(response => {
    this.regionName = response.data.regionName;
    next();
  }).catch(e => {
    console.log(e);
    next(e);
  });
});

module.exports = mongoose.model('NewsLog', NewsLogSchema);