const axios = require("axios");
const Moment = require("moment");
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const fs = require('fs');
const CronJob = require('cron').CronJob;
require('../config/db');

const wechatUserSummary = require('../models/wechatUserSummary');
const wechatUserCumulate = require('../models/wechatUserCumulate');
const wechatNewsUserRead = require('../models/wechatNewsUserRead');
const wechatNewsArticleTotal = require('../models/wechatNewsArticleTotal');

// 定时每天从微信服务器拉取Gamepoch的数据
const getusersummary = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getusersummary?startDate=${date}&endDate=${date}`);
const getusercumulate = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getusercumulate?startDate=${date}&endDate=${date}`);
const getarticletotal = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getarticletotal?startDate=${date}&endDate=${date}`);
const getnewsuserread = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getuserread?startDate=${date}&endDate=${date}`);

const insertManyUserSummaryToDB = (array) => {
  return new Promise((resolve, reject) => {
    wechatUserSummary.insertMany(array).then((docs) => {
      console.log("Import wechatUserSummary Success!");
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    })
  })
};

const insertManyUserCumulateToDB = (array) => {
  return new Promise((resolve, reject) => {
    wechatUserCumulate.insertMany(array).then((docs) => {
      console.log("Import wechatUserCumulate Success!");
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    })
  });
};

const insertManyNewsUserReadToDB = (array) => {
  return new Promise((resolve, reject) => {
    wechatNewsUserRead.insertMany(array).then((docs) => {
      console.log("Import wechatNewsUserRead Success!");
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
};

// 批量导入
const insertManyNewsArticleTotalToDB = (array) => {
  return new Promise((resolve, reject) => {
    wechatNewsArticleTotal.insertMany(array).then((docs) => {
      console.log("Import wechatNewsArticleTotal Success!");
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
};

// 每天更新
const updateNewsArticleTotalForDB = async(date, newData) => {
  // 当天没有推送新的新闻，更新历史数据
  console.log("debug articleTotal data");
  await wechatNewsArticleTotal.remove({ ref_date: { $gte: date } });
  await wechatNewsArticleTotal.insertMany(newData);
}

const getDateRange = (startDate, endDate) => {
  const range = moment.range(startDate, endDate);
  return Array.from(range.by('days')).map((date) => date.format("YYYY-MM-DD"));
}


// updateNewsArticleTotalForDB(new moment().add(-2, 'days').format("YYYY-MM-DD"));

// 每天获取的信息：
//    1.  获取
function getNewStatus() {
  getWeiboAccessToken().then(data => {
    getUserTimeLine(data.access_token, data.uid).then(statuses => {
      console.log(statuses.statuses.length);
    });
  });
}


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
 * @param  {String}     token      授权码
 * @param  {String}     uid        用户id    
 * @return {Promise} 
 */
var getUserTimeLine = (token, uid) => {
  return axios.get(`https://api.weibo.com/2/statuses/user_timeline.json?access_token=${token}&uid=${uid}`).then(response => {
    //console.log(response.data);
    return response.data;
  }).catch(e => {
    console.log(e);
    return new Error(e);
  });
}


/**
 * 获得数据库最后一条数据的最新日期
 */
var getLatestArticleTotalDate = () => {
  return wechatNewsArticleTotal.find().sort({ ref_date: -1 }).limit(1).then(docs => {
    console.log(docs[0].ref_date);
    return docs[0].ref_date;
  }).catch(err => {
    return null;
  });
}

/**
 * 获得数据库最后一条数据的最新日期
 */
var getLatestNewsUserReadDate = () => {
  return wechatNewsUserRead.find().sort({ ref_date: -1 }).limit(1).then(docs => {
    console.log(docs[0].ref_date);
    return docs[0].ref_date;
  }).catch(err => {
    return null;
  });
}



/**
 * 获得数据库最后一条数据的最新日期
 */
var getLatestUserSummaryDate = () => {
  return wechatUserSummary.find().sort({ ref_date: -1 }).limit(1).then(docs => {
    console.log(docs[0].ref_date);
    return docs[0].ref_date;
  }).catch(err => {
    return null;
  });
}



/**
 * 获得数据库最后一条数据的最新日期
 */
var getLatestUserCumulateDate = () => {
  return wechatUserCumulate.find().sort({ ref_date: -1 }).limit(1).then(docs => {
    console.log(docs[0].ref_date);
    return docs[0].ref_date;
  }).catch(err => {
    return null;
  });
}

var start = async function() {
  console.log(new moment().format("L"));
  // 一共需要执行4项更新工作
  try {
    // step1: 更新userRead数据
    // 起始时间按照数据库中已存在数据的后一天
    let date = await getLatestNewsUserReadDate();
    let dateRange = getDateRange(new moment(new Date(date.toLocaleDateString())).add(1, "days"), new moment().add(-1, "days"));
    dateRange = dateRange[0] === new moment().format("YYYY-MM-DD") ? [] : dateRange;
    let data = [];
    for (let date of dateRange) {
      console.log("正在计算" + date + "的数据");
      const res = await getnewsuserread(String(date));
      data = data.concat(res.data.list);
    }
    if (data.length > 0) {
      await insertManyNewsUserReadToDB(data);
      console.log("更新news user read数据成功！");
    }
    else {
      console.log("news user read数据没有更新！");
    }
  }
  catch (e) {
    console.log("更新news user read失败！");
  }


  // step2: 更新userSummary数据
  // 起始时间按照数据库中已存在数据的后一天
  try {
    let date = await getLatestUserSummaryDate();
    let dateRange = getDateRange(new moment(new Date(date.toLocaleDateString())).add(1, "days"), new moment().add(-1, "days"));
    dateRange = dateRange[0] === new moment().format("YYYY-MM-DD") ? [] : dateRange;
    console.log(dateRange);
    let data = [];
    for (let date of dateRange) {
      console.log("正在计算" + date + "的数据");
      const res = await getusersummary(String(date));
      data = data.concat(res.data.list);
    }
    console.log(data);
    if (data.length > 0) {
      await insertManyUserSummaryToDB(data);
      console.log("更新user summary数据!");
    }
    else {
      console.log("user summary 没有数据更新！");
    }
  }
  catch (e) {
    console.log("更新user summary数据失败!");
  }


  // step3: 更新userCumulate数据
  // 起始时间按照数据库中已存在数据的后一天
  try {
    let date = await getLatestUserCumulateDate();
    let dateRange = getDateRange(new moment(new Date(date.toLocaleDateString())).add(1, "days"), new moment().add(-1, "days"));
    dateRange = dateRange[0] === new moment().format("YYYY-MM-DD") ? [] : dateRange;
    console.log(dateRange);
    let data = [];
    for (let date of dateRange) {
      console.log("正在计算" + date + "的数据");
      const res = await getusercumulate(String(date));
      data = data.concat(res.data.list);
    }
    console.log(data);
    if (data.length > 0) {
      await insertManyUserCumulateToDB(data);
      console.log("更新user cumulate数据!");
    }
    else {
      console.log("user cumulate没有数据更新！");
    }
  }
  catch (e) {
    console.log("更新user cumulate数据失败!");
  }


  // step4: 更新article total数据
  // 起始时间按照数据库中已存在数据的后一天
  try {
    let date = await getLatestArticleTotalDate();
    date = date === null ? new Date(2016, 1, 1) : date;
    let dateRange = getDateRange(new moment(new Date(date.toLocaleDateString())).add(-7, "days"), new moment().add(-1, "days"));
    dateRange = dateRange[0] === new moment().format("YYYY-MM-DD") ? [] : dateRange;
    console.log(dateRange);
    let data = [];
    for (let date of dateRange) {
      console.log("正在计算" + date + "的数据");
      const res = await getarticletotal(String(date));
      data = data.concat(res.data.list);
    }
    console.log(data);
    if (data.length > 0) {
      await updateNewsArticleTotalForDB(dateRange[0], data);
      console.log("更新article total数据!");
    }
    else {
      console.log("article total没有数据更新！");
    }
  }
  catch (e) {
    console.log(e);
    console.log("更新数据失败!");
  }
  
  // 正常推出程序
  process.exit(0);
}

start();
