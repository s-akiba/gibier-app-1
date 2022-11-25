var express = require('express');
var router = express.Router();

// マップテスト
router.get('/map', (req, res, next) => {
    let data = {
        title: "map"
    }
    res.render('hunter/map', data);
});




module.exports = router;