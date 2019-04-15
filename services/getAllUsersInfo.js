const axios = require("axios");
const fs = require("fs");
const token = `19_aycZAYugkqJbSoMVfoXhh61kwrt1NnTNQEB28qJBdm0Ps3jCJZIeAnc_UWuj0mrLYOn5Q8jswQ2i62-4F2y6B9zx1xYR1TXpAx--UHFvqcWX07dzjSgD3AXmK1x6WWLr0ymjtcCxJ9oLRaU9UYBaACABFI`;

// 获得所有用户的用户列表
function getOpenIdList() {
  return axios.get(
    "https://api.weixin.qq.com/cgi-bin/user/get?access_token=" + token
  );
}

// 通过openid获得单个用户的信息
function getUserInfo(openid) {
  return axios.get(
    `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${openid}&lang=zh_CN`
  );
}

function delay(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

(function start() {
  getOpenIdList()
    .then(response => {
      console.log("当前粉丝" + response.data.total);
      return response.data.data.openid.reduce(
        (promiseChain, currentTask, currnetIndex) =>
          promiseChain.then(chainResults => {
            console.log(currnetIndex);
            return getUserInfo(currentTask).then(currentResult => [
              ...chainResults,
              currentResult
            ]);
          }),
        Promise.resolve([])
      );
    })
    .then(responses => {
      const userList = responses.map(response => response.data);
      console.log(userList);
      fs.writeFile("./wechatusers.json", JSON.stringify(userList), err => {
        err ? console.log("写入失败") : console.log("写入完成");
      });
    })
    .catch(e => console.log(e));
})();
