var mongoose = require("mongoose");

var WechatFansSchema = mongoose.Schema({
    subscribe: Number,
    openid: String,
    nickname: String,
    sex: Number,
    language: String,
    city: String,
    province: String,
    country: String,
    headimgurl: String,
    subscribe_time: Number,
    unionid: String,
    remark: String,
    groupid: Number,
    tagid_list: [
        String
    ],
    subscribe_scene: String,
    qr_scene: Number,
    qr_scene_str: String
});

module.exports = mongoose.model("WechatFansSchema", WechatFansSchema);