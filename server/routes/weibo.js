var express = require("express");
var router = express.Router();
var axios = require("axios");
var Weibo = require("../../models/weibo");
var WeiboToken = require("../../models/weiboToken");
var weibodata;

require("fs").readFile('./services/weiboseed.json', 'utf-8', (err, data) => { 
    if(err){ 
        console.log(err); 
        weibodata = [];
    }else{ 
        weibodata = data;
    } 
});

router.route('/')
    .get((req, res) => {
        Weibo.find({}).skip(parseInt(req.query.skip)||0).limit(parseInt(req.query.length) || 0).then(docs => {
           res.send(docs); 
        });    
    })
    .post((req, res) => {
        var publishAt = req.query.publishAt;
        var status =  req.query.status;
        var readTimes = req.query.readTimes ;
        var readAmounts = req.query.readAmounts;
        var interAmounts = req.query.interAmounts;
        var clickTimes = req.query.clickTimes;
        var reposts =  req.query.reposts;
        var comments = req.query.comments;
        var favAmounts = req.query.favAmounts;
        
        var weibo = new Weibo({publishAt, status, readTimes, readAmounts,interAmounts, clickTimes, reposts, comments, favAmounts});
        
        weibo.save().then((doc)=> {
            res.send(doc);
        }).catch(e => {
            res.send(e);
        });
    });

router.route('/insertWeiboData')
    .post((req, res) => {
        //console.log(JSON.parse(weibodata).length);
        var dataArray = JSON.parse(weibodata);
        //dataArray = req.query.data;
        Weibo.insertMany(dataArray).then((results) => {
            res.status(200).send("Insert successfully.");
        }).catch(e => {
            res.status(500).send("Insert data error.");
        });
    });

router.use('/:mid', (req, res, next) => {
    Weibo.findOne({mid: req.params.mid}).then((doc)=> {
       if(doc) {
           req.doc = doc;
           next();
       } else {
           res.status(404).send('Not found');
       }
    });
});

router.route('/:mid')
    .get((req, res) => {
        res.send(req.doc);
    })
    .patch((req, res) => {
        if(req.doc._id) {
            delete req.body._id;
        }
        if(req.doc.mid) {
            delete req.body.mid;
        }
        for(var p in req.body)
        {
            req.doc[p] = req.body[p];
        }
        
        req.doc.save().then(() => {
           res.send(req.doc);
        }).catch(e => {
           res.status(500).send(e);
        });
    });



module.exports = router;
