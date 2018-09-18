const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("douyin api");
});

module.exports = router;
