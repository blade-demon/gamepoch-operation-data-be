const mongoose = require('mongoose');

const wechatUserCumulate = mongoose.Schema({
    ref_date: Date,
    user_source: Number,
    cumulate_user: Number
});

module.exports = mongoose.model("wechatUserCumulate", wechatUserCumulate);
