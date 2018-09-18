var mongoose = require("mongoose");

var wechatNewsArticleTotal = mongoose.Schema({
    "ref_date": {type: Date},
    "msgid": {type: String, unique: true},
    "title": {type: String},
    "user_source": {type: Number},
    "details": [
        {
            "stat_date": {type: Date},
            "target_user": Number,
            "int_page_read_user": Number,
            "int_page_read_count": Number,
            "ori_page_read_user": Number,
            "ori_page_read_count": Number,
            "share_user": Number,
            "share_count": Number,
            "add_to_fav_user": Number,
            "add_to_fav_count": Number,
            "int_page_from_session_read_user": Number,
            "int_page_from_session_read_count": Number,
            "int_page_from_hist_msg_read_user": Number,
            "int_page_from_hist_msg_read_count": Number,
            "int_page_from_feed_read_user": Number,
            "int_page_from_feed_read_count": Number,
            "int_page_from_friends_read_user": Number,
            "int_page_from_friends_read_count": Number,
            "int_page_from_other_read_user": Number,
            "int_page_from_other_read_count": Number,
            "feed_share_from_session_user": Number,
            "feed_share_from_session_cnt": Number,
            "feed_share_from_feed_user": Number,
            "feed_share_from_feed_cnt": Number,
            "feed_share_from_other_user": Number,
            "feed_share_from_other_cnt": Number
        }
      ]
});

module.exports = mongoose.model("wechatNewsArticleTotal", wechatNewsArticleTotal);
