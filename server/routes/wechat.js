const express = require("express");
const router = express.Router();
const axios = require("axios");
const moment = require("moment");
moment.locale('zh_CN');
const WeChat = require("../../config/config").WeChat;
const WechatToken = require("../../models/wechatToken");
const wechatNewsArticleTotal = require("../../models/wechatNewsArticleTotal");
const wechatUserSummary = require("../../models/wechatUserSummary");
const wechatUserCumulate = require("../../models/wechatUserCumulate");
const wechatNewsUserRead = require("../../models/wechatNewsUserRead");

const wechatFans = require("../../models/wechatFans");

router.use(async(req, res, next) => {
    getWechatAccessToken(function(token) {
        console.log("从微信服务器获取的token:", token);
        if (token.token) {
            req.wechattoken = token.token;
            next();
        }
        else {
            res.status(500).send("获取token失败！");
        }
    })
});

/**
 * 从Gamepoch后台获取图文统计数据（getuserread）
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 */

router.route('/gamepoch/getuserread')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            const dataArray = await wechatNewsUserRead.find({
                ref_date: {
                    $gte: req.query.startDate,
                    $lte: req.query.endDate
                },
            }).sort({ ref_date: 1 });
            console.log(dataArray);
            res.status(200).send(dataArray);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

/**
 * 通过API从微信获取图文统计数据（getuserread），并直接返回到界面，并不储存到Gamepoch后台。
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/getuserread')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            var response = await axios.post(`https://api.weixin.qq.com/datacube/getuserread?access_token=${req.wechattoken}`, { "begin_date": req.query.startDate, "end_date": req.query.endDate });
            res.status(200).send(response.data);
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e.stack);
        };
    });


/**
 * 从微信获取图文群发每日数据(getarticlesummary)
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/getarticlesummary')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            var response = await axios.post(`https://api.weixin.qq.com/datacube/getarticlesummary?access_token=${req.wechattoken}`, { "begin_date": req.query.startDate, "end_date": req.query.endDate });
            res.status(200).send(response.data);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

/**
 * 从Gamepoch服务器查询已经获得的图文群发总数据（getarticletotal）
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/gamepoch/getarticletotal')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            const dataArray = await wechatNewsArticleTotal.find({
                ref_date: {
                    $gte: req.query.startDate,
                    $lte: req.query.endDate
                },
            }).sort({ ref_date: 1 });
            res.status(200).send(dataArray);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

/**
 * 从微信服务器获得图文群发总数据（getarticletotal）
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/getarticletotal')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            var response = await axios.post(`https://api.weixin.qq.com/datacube/getarticletotal?access_token=${req.wechattoken}`, { "begin_date": req.query.startDate, "end_date": req.query.endDate });
            res.status(200).send(response.data);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

/**
 * 从Gamepoch服务器获取用户增减数据(getusersummary)
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/gamepoch/getusersummary')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            const dataArray = await wechatUserSummary.find({
                ref_date: {
                    $gte: req.query.startDate,
                    $lte: req.query.endDate
                },
            }).sort({ ref_date: 1 });
            console.log(dataArray.length);
            res.status(200).send(dataArray);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

/**
 * 从微信服务器获取用户增减数据(getusersummary)
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/getusersummary')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            var response = await axios.post(`https://api.weixin.qq.com/datacube/getusersummary?access_token=${req.wechattoken}`, { "begin_date": req.query.startDate, "end_date": req.query.endDate });
            var data = response.data.list;
            res.status(200).send(response.data);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

/**
 * 从Gamepoch服务器获取累计用户数据(getusercumulate)
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/gamepoch/getusercumulate').get(async(req, res) => {
    try {
        checkDateValid(req.query.startDate, req.query.endDate);
        const dataArray = await wechatUserCumulate.find({
            ref_date: {
                $gte: req.query.startDate,
                $lte: req.query.endDate
            },
        }).sort({ ref_date: 1 });
        console.log(dataArray.length);
        res.status(200).send(dataArray);
    }
    catch (e) {
        res.status(500).send(e.stack);
    };
});

/**
 * 从微信服务器获取累计用户数据(getusercumulate)
 * @param   startDate   {String} 开始日期
 * @param   endDate     {String} 结束日期
 * @return              {Array}  返回指定日期区间的数据列表
 */
router.route('/getusercumulate')
    .get(async(req, res) => {
        try {
            checkDateValid(req.query.startDate, req.query.endDate);
            var response = await axios.post(`https://api.weixin.qq.com/datacube/getusercumulate?access_token=${req.wechattoken}`, { "begin_date": req.query.startDate, "end_date": req.query.endDate });
            var data = response.data.list;
            res.status(200).send(response.data);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

/**
 * 获得所有用户的信息
 * @return
 */
router.route('/getopenidlist')
    .get(async(req, res) => {
        try {
            var response = await axios.get(`https://api.weixin.qq.com/cgi-bin/user/get?access_token=${req.wechattoken}`);
            var data = response.data.list;
            res.status(200).send(response.data);
        }
        catch (e) {
            res.status(500).send(e.stack);
        };
    });

// 获取openid用户的基本信息
router.route('/getuserinfo')
    .get(async(req, res) => {
        try {
            var openid = req.query.openid;
            var response = await axios.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${req.wechattoken}&openid=${openid}&lang=zh_CN`);
            var data = response.data.list;
            res.status(200).send(response.data);
        }
        catch (e) {
            res.status(500).send(e.stack);
        }
    });

// 从微信服务器获取最新所有用户的基本信息
router.route('/batchgetuserinfo')
    .post(async(req, res) => {
        try {
            var user_list = req.body.user_list;
            // 微信的接口每次最多获得100个粉丝
            var response = await axios.post(`https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=${req.wechattoken}`, {
                user_list: [...user_list].map(function(user) {
                    return {
                        openid: user
                    }
                })
            });
            var data = response.data.list;
            res.status(200).send(response.data);
        }
        catch (e) {
            res.status(500).send(e.stack);
        }
    });


/**
 * 检查日期合法性
 * @param    {String}    startDate    -查询的起始日期
 * @param    {String}    endDate      -查询的截至日期
 */
function checkDateValid(startDate, endDate) {
    var previousDate = new Date(moment().add(-1, 'days'));

    if (!startDate) {
        throw new Error("startDate not allowed empty");
    }
    if (!endDate) {
        throw new Error("endDate not allowed empty");
    }
    if (endDate > previousDate) {
        throw new Error("Date invalid");
    }
}

/**
 * 获得微信的AccessToken
 * 先查找数据库是否有token, 如果有token,然后看当前token是否已经过期。如果过期就重新获取token, 未过期就直接使用该token。如果没有token直接通过API获取。
 */
function getWechatAccessToken(cb) {
    WechatToken.findOne().then((token) => {
        if (token) {
            //console.log("数据库的Token" + token);
            var createdAt = token.createdAt.getTime();
            var currentTime = new Date().getTime();
            var timeDelay = (currentTime - createdAt) / (3600 * 1000);
            if (timeDelay >= 1.5) {
                // token已过期,通过API获取
                fetchToken((newToken) => {
                    token.token = newToken.access_token;
                    //console.log("新的token是：" + newToken);
                    //console.log("修改后的token：" + token);
                    //console.log("token已过期，已重新获取，新Token：" + JSON.stringify(token));
                    token.save();
                    cb(token);
                });
            }
            else {
                //console.log('token已存在且未过期，直接使用');
                cb(token);
            }
        }
        else {
            // 通过API获取
            fetchToken((token) => {
                var token = new WechatToken({ token: token.access_token, createdAt: new Date() });
                //console.log("数据库没有Token, 获得的token是：" + token);   
                token.save();
                cb(token);
            });
        }
    }).catch(e => {
        return e;
    });
}

/**
 * 通过API获取token
 * 
 */
function fetchToken(callback) {
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WeChat.appId}&secret=${WeChat.appSecret}`).then((response) => {
        callback(response.data);
    }).catch(e => {
        callback(e);
    });
}

module.exports = router;
