var express = require('express');
var router = express.Router();

// マップテスト
router.get('/map', (req, res, next) => {
    let data = {
        title: "map"
    }
    res.render('hunter/map', data);
});

router.get("/register_vermin_info", (req, res, next) => {
    let data = {
        title: "害獣位置情報登録",
    }
    res.render("hunter/register_vermin_info", data);
});

router.get("/getjson", (req, res, next) => {
    let j = {"data1": ["aiu", "eo"]};
    res.json(j);
})


module.exports = router;