var express = require("express");
var router = express.Router();
var axios = require("axios");
var _ = require("lodash");

router.route('/')
    .get(()=>{
        
    });

router.route('/weeklyGamepoch')
    .get((req, res)=>{
        getData((error, data)=>{
            if(!error) {
                var singleItemLength;
                var surveryData = data.map(item => {
                   singleItemLength = item.surveryResult.length;
                   return item.surveryResult; 
                });
                var dataLength = surveryData.length;
                
                // console.log("调查数据条数：" + dataLength);
                // console.log("每条数据个数：" + singleItemLength);
                // console.log(surveryData);
                var pieData = [[],[],[],[]];
                for(var i = 0; i < dataLength; i++) {
                    for(var j = 0; j < singleItemLength; j++) {
                        pieData[j].push(surveryData[i][j]);
                    }
                }
                /*--  Fake data -----------*/
                //pieData[0] = [{"alone":80},{"friend": 50},{"family":20}];
                //pieData[1] = [{"true": 30},{"false":120}];
                //pieData[2] = [{"oneWeek": 20},{"twoWeek":20},{"oneMonth":110}];
                //pieData[3] = [{"under20": 50},{"under30":70},{"up30":30}];
                /*-------------*/
                
                
                pieData[0] = [returnResult(pieData[0])];
                pieData[1] = [returnResult(pieData[1])];
                pieData[2] = [returnResult(pieData[2])];
                pieData[3] = [returnResult(pieData[3])];
                
                res.render('activities/weeklyGamepoch', {pieData});
            } else {
                res.status(500).send(error);
            }
        })
        
    });    

/**
 * 获取微信服务器本次活动的调查数据
 */
function getData(callback) {
    axios.get('http://wechatservice.gamepoch.com/api/survery?activity=58d0e7eae73f91f96ad266ed').then((response) => {
        callback(null, response.data);
    }).catch(error => {
        if (error.response) {
          // The request was made, but the server responded with a status code 
          // that falls out of the range of 2xx 
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          // Something happened in setting up the request that triggered an Error 
          callback(error.message);
        }
    });
}

/**
 * 返回一个数组元素出现的次数
 */
function returnResult(str) {
    var result = {};
    for (var i = 0, l = str.length; i < l; i++) {
        result[str[i]] = (result[str[i]] + 1) || 1;
    }
    console.log(JSON.stringify(result));   
    return result;
}
    
module.exports = router;

