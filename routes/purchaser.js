var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");

// 処理施設検索 get
router.get('/search_facilities', (req, res, next) => {
  db.regions.findAll()
  .then(regs => {
    let data = {
      title: "search",
      content: "",
      regions: regs,
      alert_message: "",
      result: ""
    }
    res.render("purchaser/search_facilities", data);
  });
  
});

// 処理施設検索 post
router.post('/search_facilities', (req, res, next) => {
  console.log("region_id:", req.body.region);
  console.log("word:", req.body.word);
  db.regions.findAll()
  .then((regs) => {
    if (req.body.region != 0) {
      db.users.findAll({
        where: {
          [Op.and]: {
            is_facility: true,
            region_id: req.body.region
          }
        }
      })
      .then((result) => {
        let data = {
          title: "Edit",
          content: "",
          regions: regs,
          alert_message: "",
          result: result
        }
        res.render("purchaser/search_facilities", data);
      });
    } else {
      db.users.findAll({
        where: {
          [Op.and]: {
            is_facility: true,
            user_name: {[Op.like]: '%' + req.body.word + '%'}
          }
        }
      })
      .then((result) => {
        let data = {
          title: "Edit",
          content: "",
          regions: regs,
          alert_message: "",
          result: result
        }
        res.render("purchaser/search_facilities", data);
      });
    }
  })
});

// 処理施設詳細 get
// findOne id&&is_facility にする
router.get('/facility_detail', (req, res, next) => {
  console.log("facility id: ", req.query.id);
  db.users.findByPk(req.query.id)
  .then((usr) => {
    let data = {
      title: "detail facility",
      result: usr
    }
    res.render("purchaser/facility_detail", data);
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  })
});

// 購入者依頼 get
router.get('/request_to_facility', (req, res, next) => {
  console.log("facility id: ", req.query.facility_id);
  db.users.findByPk(req.query.facility_id)
  .then((usr) => {
    console.log(usr);
    db.wild_animal_info.findAll()
    .then((animals) => {
      db.categories.findAll()
      .then((categories) => {
        let data = {
          title: "requet to facility",
          facility_user: usr,
          animals: animals,
          categories: categories
        }
        res.render('purchaser/request_to_facility', data);
      })
      .catch((err) => {
        console.log("err category: ", err);
        res.redirect("/");
      })
    })
    .catch((err) => {
      console.log("err animal: ", err);
      res.redirect("/");
    })
  })
  .catch((err) => {
    console.log("err user: ", err);
    res.redirect("/");
  })
});

// 購入者依頼 post
router.post('/request_to_facility', (req, res, next) => {
  console.log(req.body);
  let data = {
    user_1_id: req.session.login.id,
    user_2_id: req.body.facility_id,
    category_id: req.body.category_options,
    wild_animal_info_id: req.body.animal_options,
    num: req.body.request_num,
    content: req.body.content,
    appointed_day: req.body.appointed_day,
    is_public: false,
    is_accepted: false,
    is_closed: false,
  }
  db.req_from_purchaser.create(data)
  .then(result => {
    console.log("created: ", JSON.stringify(result));
    res.redirect("/");
  })
  .catch((error) => {
    console.log("DB create error");
    console.error(error);
    res.redirect("/");
  });
})

// test

module.exports = router;