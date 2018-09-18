var express = require("express");
var router = express.Router();
var axios = require("axios");
var moment = require("moment");
const WebsiteList = require("../../config/config").WebsiteList;
var NewsLog = require("../../models/newsLog");
var weibo = require("../../models/weibo");
var WechatToken = require("../../models/wechatToken");

const { google } = require('googleapis');
const key = require('../../config/ga_auth.json')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
// NBA2K18网站id: 160342634
// gamepoch官网viewID: 127823870
// 拳皇14： 127777903
// const view_id = '160342634';

/*
Dimensions
ga:hostname
ga:pagePath
ga:pagePathLevel1
ga:pagePathLevel2
ga:pagePathLevel3
ga:pagePathLevel4
ga:pageTitle
ga:landingPagePath
ga:secondPagePath
ga:exitPagePath
ga:previousPagePath
ga:pageDepth


Metrics
ga:pageValue
ga:entrances
ga:pageviews
ga:uniquePageviews
ga:timeOnPage
ga:exits

Calculated Metrics


ga:entranceRate
ga:pageviewsPerSession
ga:pageviewsPerVisit
ga:avgTimeOnPage
ga:exitRate


*/

async function getData(view_id) {
  const defaults = {
    'auth': jwt,
    'ids': 'ga:' + view_id,
  }
  const response = await jwt.authorize();

  const daysOf7Result = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '7daysAgo',
    'end-date': 'yesterday',
    'metrics': 'ga:pageviews, ga:uniquePageviews, ga:avgtimeOnPage, ga:entrances, ga:entranceRate, ga:exitRate',
    'dimensions':'ga:pageTitle'
  });
  
  const daysOf30Result = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '30daysAgo',
    'end-date': 'yesterday',
    'metrics': 'ga:pageviews, ga:uniquePageviews, ga:avgtimeOnPage, ga:entrances, ga:entranceRate, ga:exitRate',
    'dimensions':'ga:pageTitle'
  });


  const daysOf7PageViewsResult = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '7daysAgo',
    'end-date': 'yesterday',
    'metrics': 'ga:pageviews',
    'dimensions':'ga:date'
  });
  
    const daysOf30PageViewsResult = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '30daysAgo',
    'end-date': 'yesterday',
    'metrics': 'ga:pageviews',
    'dimensions':'ga:date'
  });

  return {
    daysOf7Result: daysOf7Result.data.rows,
    daysOf30Result: daysOf30Result.data.rows,
    daysOf7PageViewsResult: daysOf7PageViewsResult.data.rows,
    daysOf30PageViewsResult: daysOf30PageViewsResult.data.rows
  }
}


router.get('/', (req, res) => {
  console.log("获得数据！");
  res.send('Gamepoch运营数据服务接口');
});

router.get('/gamepoch', async(req, res) => {
  const result = await getData("127823870");
  res.send(result);
});

router.get('/nba2k18', async(req, res) => {
  const result = await getData("160342634");
  res.send(result);
});

router.get('/nba2k19', async(req, res) => {
  const result = await getData("179374574");
  res.send(result);
});

router.get('/kof14', async(req, res) => {
  const result = await getData("127777903");
  res.send(result);
});


// 微信
// router.get('/newsTypeGamepochWechat', (req, res) => {

//   var previousDate = transformDate(new Date(moment().add(-1, "days")));
//   var before7Days = transformDate(new Date(moment().add(-7, "days")));
//   var before8Days = transformDate(new Date(moment().add(-8, "days")));
//   var before14Days = transformDate(new Date(moment().add(-14, "days")));
//   // 上周的文章数据
//   var p1 = axios.get(req.protocol + "://" + req.hostname + `/api/wechat/getarticlesummary?startDate=${previousDate}&endDate=${previousDate}`);
//   var p2 = axios.get(req.protocol + "://" + req.hostname + `/api/wechat/getarticletotal?startDate=${previousDate}&endDate=${previousDate}`);
//   // 上周的用户数据信息
//   var p3 = axios.get(req.protocol + "://" + req.hostname + `/api/wechat/getusersummary?startDate=${before7Days}&endDate=${previousDate}`);
//   var p4 = axios.get(req.protocol + "://" + req.hostname + `/api/wechat/getusercumulate?startDate=${before7Days}&endDate=${previousDate}`);
//   // 上上周的用户数据信息
//   // var p5 = axios.get(req.protocol + "://" + req.hostname + `/api/wechat/getusersummary?startDate=${before14Days}&endDate=${before8Days}`);
//   // var p6 = axios.get(req.protocol + "://" + req.hostname + `/api/wechat/getusercumulate?startDate=${before14Days}&endDate=${before8Days}`);


//   Promise.all([p1, p2, p3, p4]).then(results => {
//     // 关注用户数据变化
//         console.log(results[0].data);
//     console.log(results[1].data.list);
//     console.log(results[2].data);
//     console.log(results[3].data.list);
//     var usersChanges = sumUsersChange(filterData(results[2].data.list, previousDate));
//     var totalUsers = sumUsersTotal(filterData(results[3].data.list, previousDate));

//     // var usersChangesLastWeek = sumUsersChange(filterData(results[2].data.list, before7Days));
//     var totalUsersLastWeek = sumUsersTotal(filterData(results[3].data.list, before7Days));

//     // console.log(usersChanges);
//     // console.log(totalUsers);
//     // console.log(totalUsersLastWeek);

//     res.render('gamepochWechat', {
//       getarticlesummary: results[0].data,
//       getarticletotal: results[1].data,
//       getuserssummary: results[2].data,
//       getuserstotal: results[3].data,
//       // getuserssummaryBefore: results[4].data,
//       // getuserstotalBefore: results[5].data,
//       totalUsers: totalUsers,
//       totalUsersLastWeek: totalUsersLastWeek,
//       increaseRate: Number((totalUsers - totalUsersLastWeek) * 100 / totalUsers).toFixed(2),
//       usersChanges: usersChanges,
//       userChangesRate: Number(usersChanges * 100 / totalUsersLastWeek).toFixed(2)
//     });
//   }).catch(e => {
//     console.log(e.message);
//     res.status(500).send('获取信息失败，请稍后重试');
//   });
// });

// 新浪微博
// router.get('/newsTypeGamepochWeibo', (req, res) => {
//   var p1 = weibo.find({});

//   getWeiboAccessToken().then(data => {
//     var access_token = data.access_token;
//     var uids = data.uid;
//     if (!access_token) {
//       return res.status(400).send('access_token获取失败');
//     }
//     if (!uids) {
//       return res.status(400).send('uid获取失败');
//     }
//     Promise.all([p1, getUserCountsLatest() /*, getTimeLineIds(access_token, data.uid)*/ ]).then(values => {
//       if (values) {
//         console.log(values[0].length);
//         console.log(values[1]);
//         res.render('gamepochWeibo', { weiboInfo: values[0], userCounts: values[1] });
//       }
//       else {
//         res.send('微博信息为空');
//       }
//     });
//   }).catch(e => {
//     console.log(e);
//     res.status(500).send(e);
//   });
// });


/**
 * 从本地数据库获得微博数据
 */
var getWeiboData = () => {
  return axios.get(req.protocol + "://" + req.hostname + `/api/weibo`).then(response => {
    return response.data;
  }).catch(e => {
    console.log(e);
    return new Error(e);
  });
};

/**
 * 获得微博的AccessToken
 * 
 * @return {Promise}  
 */
var getWeiboAccessToken = () => {
  return axios.get(`http://weibo.gamepoch.com/getAccessToken`).then((response) => {
    return response.data;
  }).catch(e => {
    console.log(e);
    return new Error(e);
  });
}

/**
 * 获取某个用户最新发表的微博列表
 * 
 * @param  {String}     token       授权码
 * @return {Promise} 
 */
var getUserTimeLine = (token) => {
  return axios.get(`https://api.weibo.com/2/statuses/user_timeline.json?access_token=${token}`).then(response => {
    //console.log(response.data);
    return response.data;
  }).catch(e => {
    console.log(e);
    return new Error(e);
  });
}

/**
 * 获取用户的粉丝数、关注数、微博数
 */
var getUserCounts = () => {
  return axios.get(`http://weibo.gamepoch.com/UserCounts?limit=7`).then(response => {
    return response.data;
  });
};

/**
 * 获取用户最新一天的粉丝数、关注数、微博数
 */
var getUserCountsLatest = () => {
  return axios.get(`http://weibo.gamepoch.com/UserCounts/latest`).then(response => {
    return response.data;
  });
};


/**
 * 获取用户发布的微博的ID
 * @param   {string}	access_token  采用OAuth授权方式为必填参数，OAuth授权后获得。
 * @param 	{string}	uid           需要获取数据的用户UID
 */
var getTimeLineIds = (token, uid) => {
  return axios.get(`https://api.weibo.com/2/statuses/user_timeline/ids.json?access_token=${token}&uid=${uid}`).then(response => {
    return response.data;
  });
};

/**
 * 转换日期格式
 * @param     {Date}        date        - 日期形式：Mon Sep 11 2017 05:51:41 GMT+0000 (UTC)
 * @return    {String}      String      - 日期形式：2017-09-11
 */
var transformDate = function(date) {
  var month = '0' + (date.getMonth() + 1);
  var day = '0' + date.getDate();
  return date.getFullYear() + '-' + month.slice(-2) + '-' + day.slice(-2);
};

/**
 * 从指定数组中查找出数据
 * @param      {Array}       dataList        - 数据列表
 * @param      {Date}        date            - 日期  
 */
var filterData = function(dataList, date) {
  var returnDataList = [];
  returnDataList = dataList.filter(function(item) {
    return item.ref_date == date;
  });
  return returnDataList;
};

/**
 * 累加指定日期各个渠道的数据总和
 * @param     {Array}       dataList            - 数据列表
 * @return    {Number}      data                - 累加数据
 */
var sumUsersChange = function(dataList) {
  var newUsers = dataList.reduce(function(prev, next) {
    return prev.new_user + next.new_user;
  });
  var cancelUsers = dataList.reduce(function(prev, next) {
    return prev.cancel_user + next.cancel_user;
  });
  return newUsers - cancelUsers;
};

/**
 * 从数组中累加数据
 * @param     {Array}       dataList            - 数据列表
 * @return    {Number}      data                - 累加数据
 */
var sumUsersTotal = function(dataList) {
  var result = 0;
  if (dataList.length === 0) {
    return 0;
  }
  if (dataList.length === 1) {
    result = dataList[0].cumulate_user;
    return result;
  }
  var result = dataList.reduce(function(prev, next) {
    return prev.new_user + next.new_user;
  });
  return result;
};

module.exports = router;
