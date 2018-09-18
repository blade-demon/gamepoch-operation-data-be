const axios = require("axios");
const Moment = require("moment");
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const fs = require('fs');
require('../config/db');

const wechatUserSummary = require('../models/wechatUserSummary');
const wechatUserCumulate = require('../models/wechatUserCumulate');
const wechatNewsUserRead = require('../models/wechatNewsUserRead');
const wechatNewsArticleTotal = require('../models/wechatNewsArticleTotal');

const clearCollectionsStore = async () => {
    await wechatUserCumulate.remove({});
    await wechatUserSummary.remove({});
    await wechatNewsArticleTotal.remove({});
    await wechatNewsUserRead.remove({});
}

const readUserSummaryFile = () => {
    let array = JSON.parse(fs.readFileSync('./weixin-user-summary.json', 'utf-8'));
    return array;
};

const readUserCumulateFile = () => {
    let array = JSON.parse(fs.readFileSync('./weixin-user-cumulate.json', 'utf-8'));
    return array;
};

const readNewsUserReadFile = () => {
    let array = JSON.parse(fs.readFileSync('weixin-news-userread.json', 'utf-8'));
    return array;
};

const readNewsArticleTotalFile = () => {
    let array = JSON.parse(fs.readFileSync('weixin-news-articletotal.json', 'utf-8'));
    return array;
};

const insertManyUserSummaryToDB = (array) => {
    return new Promise((resolve, reject) => {
        wechatUserSummary.insertMany(array).then((docs) => {
            console.log("Import wechatUserSummary Success!");
            resolve();
        }).catch((err) => {
            console.log(err);
            reject();
        });
    });
};

const insertManyUserCumulateToDB = (array) => {
    return new Promise((resolve, reject) => {
        wechatUserCumulate.insertMany(array).then((docs) => {
            console.log("Import wechatUserCumulate Success!");
            resolve();
        }).catch((err) => {
            console.log(err);
            reject();
        });
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

const start = async() => {
    await clearCollectionsStore();
    console.log("清空数据库数据");
    try {
        await insertManyUserSummaryToDB(readUserSummaryFile());
        await insertManyUserCumulateToDB(readUserCumulateFile());
        await insertManyNewsUserReadToDB(readNewsUserReadFile());
        await insertManyNewsArticleTotalToDB(readNewsArticleTotalFile());
        console.log("DataStore Initialized Done");
    }
    catch (e) {
        console.log(e);
    }
    process.exit(-1);
}

start();
