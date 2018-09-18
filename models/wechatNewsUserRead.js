const mongoose = require('mongoose');

const wechatNewsUserRead = mongoose.Schema({
    ref_date: Date,
    user_source: Number,
    int_page_read_user: Number,
    int_page_read_count: Number,
    ori_page_read_user: Number,
    ori_page_read_count: Number,
    share_user: Number,
    share_count: Number,
    add_to_fav_user: Number,
    add_to_fav_count: Number
});

module.exports = mongoose.model("wechatNewsUserRead", wechatNewsUserRead);
