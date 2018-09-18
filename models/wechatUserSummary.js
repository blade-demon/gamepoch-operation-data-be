const mongoose = require('mongoose');

const wechatUserSummary = mongoose.Schema({
    ref_date: Date,
    user_source: Number,
    new_user: Number,
    cancel_user: Number
});

module.exports = mongoose.model("wechatUserSummary", wechatUserSummary);
