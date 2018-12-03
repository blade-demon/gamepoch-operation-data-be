const express = require('express');
const path = require('path');
const app = express();
const serveStatic = require('serve-static');
const bodyParser = require("body-parser");
const cors = require('cors');
// configure views path
app.use(express.static(path.join(__dirname, '../app/public')));
app.set('views', path.join(__dirname,'../app/views'));

// bodyParser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require("../config/db");

var indexRouter = require('./routes/index');
var wechatRouter = require('./routes/wechat');
var weiboRouter = require('./routes/weibo');
var douyinRouter = require("./routes/douyin");

// API Router
app.use(cors());
app.use('/api/wechat', wechatRouter);
app.use('/api/weibo', weiboRouter);
app.use('/api/douyin', douyinRouter);
// Page Router
app.use('/', indexRouter);


app.listen(8080, function () {
  console.log('App listening on port 80!');
});