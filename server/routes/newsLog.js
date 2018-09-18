var express = require('express');
var router = express.Router();
var axios = require('axios');
var NewsLog = require('../../models/newsLog');

var ChinaRegion = ['cn-sh','cn-bj','cn-tj','cn-cq','cn-hlj','cn-jl','cn-ln','cn-nm','cn-hb','cn-xj',
                    'cn-gs','cn-qh','cn-sa','cn-nx','cn-he','cn-sd','cn-sx','cn-ah','cn-hu','cn-js',
                    'cn-sc','cn-gz','cn-yn','cn-gx','cn-xz','cn-zj','cn-jx','cn-gd','cn-fj','cn-hn','cn-xg','cn-3681','tw'
                  ];
var RegionName = ['Shanghai','Beijing','Tianjing','Chongqing','Heilongjiang','Jilin','Liaoning','Inner Mongolia Autonomous Region','Hebei','Xinjiang',
                  'Gansu','Qinghai','Shaanxi','Ningxia','Henan','Shandong','Shanxi','Anhui','Hubei','Jiangsu',
                  'Sichuan','Guizhou','Yunnan','Guangxi','Xizang','Zhejiang','Jiangxi','Guangdong','Fujian','Hainan','Xianggang','Aomen','Taiwan'];

router.route('/')
    .get((req, res)=>{
        var query = {};
        var limit;
        if(req.query.newsId) {
            query.newsId = req.query.newsId;    
        }
        if(req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        if(req.query.source) {
            query.source = req.query.source;
        }
        NewsLog.find(query).limit(limit || 0).then(doc => {
            res.status(200).send(doc);
        }).catch(e => {
            res.status(400).send(e);
        });
    })
    .post((req, res) => {
        var ip = req.body.ip;
        var newsId = req.body.newsId;
        var source = req.body.source;
        if(!ip) {
            return res.status(400).send('Invalid request need ip parameter');
        }
        if(!newsId) {
            return res.status(400).send('Invalid request need newsId parameter');
        }
        if(!source) {
            return res.status(400).send('Invalid request need source parameter');
        }
        var newslog = new NewsLog({
            ip: ip,
            newsId: newsId,
            source: source
        });
        newslog.save().then(doc => {
           res.status(200).send(doc); 
        });
    });
    
router.route('/mapData')
    .get((req, res) => {
        var query = {};
        if(req.query.source) {
            query.source = req.query.source;
        }
        NewsLog.aggregate([{$match:{source: query.source}},
                           {$group:{_id: "$regionName", "value": {$sum: 1}}}]).then(results => {
            var mapData = results.map(item => {
              item["hc-key"] = item._id;
              item["value"] = item.value;
              var index = RegionName.indexOf(item["hc-key"]);
              if(RegionName.indexOf(item["hc-key"]) !== -1) {
                item["hc-key"] = ChinaRegion[index];
              };
              delete item._id;
              return item;
            })
            res.status(200).send(mapData);
        }).catch(e => {
            res.status(400).send(e);
        });
    });

module.exports = router;