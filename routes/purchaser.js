var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");
var func_file = require("./func_file.js");

// 処理施設検索 get
router.get('/search_facilities', (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_purchaser: true})){return};
  db.regions.findAll()
  .then(regs => {
    let data = {
      title: "処理施設検索",
      regions: regs,
      alert_message: "",
      result: ""
    }
    res.render("purchaser/search_facilities", data);
  });
});


router.get("/search_facilities_json", (req, res, next) => {
  let query_data = {is_facility: true};
  if (req.query.region != 0) {
    query_data["region_id"] = req.query.region;
  }
  if (req.query.search_word.length != 0) {
    query_data["user_name"] = {[Op.like]: '%' + req.query.search_word + '%'};
  }
  console.log(query_data);
  db.users.findAll({
    where: query_data
  })
  .then((results) => {
    console.log(JSON.stringify(results));
    res.json(results);
  })
  .catch((err) => {
    console.log(err);
  });
});

// 処理施設詳細 get
// findOne id&&is_facility にする
router.get('/facility_detail', (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_purchaser: true})){return};
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
  if (func_file.login_class_check(req, res, {is_purchaser: true})){return};
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
  if (func_file.login_class_check(req, res, {is_purchaser: true})){return};
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
});

// 公開購入者依頼作成 get
router.get("/public_request_to_facility", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_purchaser: true})){return};
  db.wild_animal_info.findAll()
  .then((animals) => {
    db.categories.findAll()
    .then((categories) => {
      let data = {
        title: "公開購入者依頼作成",
        animals: animals,
        categories: categories
      }
      res.render('purchaser/public_request_to_facility', data);
    })
    .catch((err) => {
      console.log("err category: ", err);
      res.redirect("/");
    });
  })
  .catch((err) => {
    console.log("err animal: ", err);
    res.redirect("/");
  });
});

// 公開購入者依頼 post
router.post('/public_request_to_facility', (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_purchaser: true})){return};
  console.log(req.body);
  let data = {
    user_1_id: req.session.login.id,
    user_2_id: null,
    category_id: req.body.category_options,
    wild_animal_info_id: req.body.animal_options,
    num: req.body.request_num,
    content: req.body.content,
    appointed_day: req.body.appointed_day,
    is_public: true,
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
});

module.exports = router;