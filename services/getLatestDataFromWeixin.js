const axios = require("axios");
const Moment = require("moment");
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const fs = require('fs');


// 该文件从微信服务器获得最新的数据存放到服务器
/*
    1. 获得每天用户的累计关注量，最大时间跨度7
    https://news-summary-ziweigamepoch.c9users.io/api/wechat/getusercumulate?startDate=2018-07-12&endDate=2018-07-18
    
    2. 获得每天用户的详细新增，减少，净增关注量
    https://news-summary-ziweigamepoch.c9users.io/api/wechat/getusersummary?startDate=2018-07-12&endDate=2018-07-18
    
    获取图文群发每日数据（getarticlesummary）	1	https://api.weixin.qq.com/datacube/getarticlesummary?access_token=ACCESS_TOKEN
    获取图文群发总数据（getarticletotal）	1	https://api.weixin.qq.com/datacube/getarticletotal?access_token=ACCESS_TOKEN
    获取图文统计数据（getuserread）	3	https://api.weixin.qq.com/datacube/getuserread?access_token=ACCESS_TOKEN
    获取图文统计分时数据（getuserreadhour）	1	https://api.weixin.qq.com/datacube/getuserreadhour?access_token=ACCESS_TOKEN
    获取图文分享转发数据（getusershare）	7	https://api.weixin.qq.com/datacube/getusershare?access_token=ACCESS_TOKEN
    获取图文分享转发分时数据（getusersharehour）	1	https://api.weixin.qq.com/datacube/getusersharehour?access_token=ACCESS_TOKEN

*/


const getusersummary = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getusersummary?startDate=${date}&endDate=${date}`);
const getusercumulate = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getusercumulate?startDate=${date}&endDate=${date}`);

const getarticletotal = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getarticletotal?startDate=${date}&endDate=${date}`);
const getnewsuserread = async(date) => axios.get(`https://news-summary-ziweigamepoch.c9users.io/api/wechat/getuserread?startDate=${date}&endDate=${date}`);


const getDateRange = (startDate, endDate) => {
    const range = moment.range(startDate, endDate);
    return Array.from(range.by('days')).map((date) => date.format("YYYY-MM-DD"));
}

const writeFile = (data, filename, cb) => {
    fs.writeFile(filename, data, function(err) {
        if (err) {
            cb(err)
        }
        else {
            cb(null);
        }
    });
}


const start = async() => {
    const dateRange = getDateRange("2018-07-24", "2018-09-13");
    let data = [];
    for (let i = 0; i < dateRange.length; i++) {
        console.log("正在计算" + dateRange[i] + "的数据");
        const res = await getarticletotal(dateRange[i]);
        console.log(res.data.list);
        data = data.concat(res.data.list);
    }
    console.log(JSON.stringify(data));
    // writeFile(JSON.stringify(data), "weixin-news-articletotal-2016.json", function(err) {
    //     if (!err) {
    //         console.log("写入成功！");
    //     }
    //     else {
    //         console.log("写入失败！");
    //     }
    // });
}


start();