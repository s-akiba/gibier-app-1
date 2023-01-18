var express = require('express');
var router = express.Router();
const turf = require("@turf/turf");
var fs = require("fs");
const db = require('../models/index');
const { sequelize } = require('../models/index');
const { QueryTypes, and } = require('sequelize');
var func_file = require("./func_file.js");
const chalk = require('chalk');
const { Op } = require("sequelize");

var prefectures_t= fs.readFileSync("./prefectures.geojson", {encoding: 'utf-8'});
var df_t = JSON.parse(prefectures_t);

// マップテスト
router.get('/map', (req, res, next) => {
  let data = {
    title: "map"
  }
  res.render('hunter/map', data);
});

// 害獣情報登録 get
router.get("/register_vermin_info", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_hunter: true})){return};
  db.wild_animal_info.findAll()
  .then((result_animals) => {
    let data = {
      title: "害獣位置情報登録",
      animals: result_animals,
    }
    res.render("hunter/register_vermin_info", data);
  })
});

// 害獣情報登録 post
router.post("/register_vermin_info", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_hunter: true})){return};
  console.log("latitude:", req.body.latitude);
  console.log("longitude", req.body.longitude);

  let pt = turf.point([req.body.longitude, req.body.latitude]);
  let pref_name ="";
  let pref_num = 48;

  outer: for (let pref = 0; pref < 47; pref++) {
    // console.log(df_t["features"][pref]["properties"]["name"]);
    // console.log(df_t["features"][pref]["geometry"]["coordinates"].length);

    for (let each_polygon = 0; each_polygon < df_t["features"][pref]["geometry"]["coordinates"].length; each_polygon++) {
        var poly = turf.polygon(df_t["features"][pref]["geometry"]["coordinates"][each_polygon]);
        var tf = turf.booleanPointInPolygon(pt, poly);
        if (tf) {
            pref_name = df_t["features"][pref]["properties"]["name"];
            pref_num = df_t["features"][pref]["properties"]["pref"];
            break outer;
        }
    }
  }
  if (pref_num == 48) {
    console.log("判定できませんでした。");
  } else {
    console.log("選択された地点: ", pref_name);
  }
  let create_data = {
    wild_animal_info_id: req.body.animal_options,
    user_id: req.session.login.id,
    region_id: pref_num,
    content: req.body.content,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }
  db.vermin_info.create(create_data)
  .then((result) => {
    console.log(chalk.green("created: "), JSON.stringify(result));
    res.redirect("/");
  })
  .catch((error) => {
    console.log("DB create error");
    console.error(error);
    res.redirect("/");
  });
});


// 害獣情報検索 get
router.get("/search_vermin_infos", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_hunter: true})){return};
  db.wild_animal_info.findAll()
  .then((result_animals) => {
    db.regions.findAll()
    .then((result_regions) => {
      let data = {
        title: "害獣情報検索",
        animals: result_animals,
        regions: result_regions
      }
      res.render("hunter/search_vermin_infos", data);
    })
  })
});



// 検索 get
router.get("/search_vermin_infos_json",(req, res, next) => {
  if (func_file.login_class_check(req, res, {is_hunter: true})){return};
  console.log(req.query);

  if (req.query.animal == 0 && req.query.region == 0) {
    res.json([]);
  } else {
    let query_str2 = {};
    if (req.query.region != 0) {
      query_str2["region_id"] = req.query.region;
    }
    if (req.query.animal != 0) {
      query_str2["wild_animal_info_id"] = req.query.animal;
    }
    db.vermin_info.findAll({
      where: query_str2,
      include: [
        {model: db.wild_animal_info},
        {model: db.users},
        {model: db.regions}
      ],
    })
    .then((results) => {
      // console.log(JSON.stringify(results));
      func_file.slice_result_by_date(req, results)
      .then((slice_result) => {
        // console.log(JSON.stringify(slice_result));
        console.log("検索結果: ", slice_result.length, "件");
        res.json(slice_result);
      })
    });
  }
});

// 登録害獣位置情報一覧 get
router.get("/show_registered_vermin_infos", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_hunter: true})){return};
  res.redirect("/hunter/show_registered_vermin_infos/0");
});

router.get("/show_registered_vermin_infos/:page", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_hunter: true})){return};
  const pnum = 10;
  const pg = req.params.page *1;
  if (Number(pg) < 0) {
    res.redirect("/hunter/show_registered_vermin_infos/0")
  } else {
    db.vermin_info.findAndCountAll({
      where: {
        user_id: req.session.login.id
      },
      include: [
        {model: db.wild_animal_info},
        {model: db.regions}
      ],
      order: [['updatedAt', 'DESC']],
      offset: pg *pnum,
      limit: pnum
    })
    .then((results) => {
      if (Math.floor(results.count /pnum) < pg) {
        res.redirect("/hunter/show_registered_vermin_infos/"+Math.floor(results.count /pnum))
      } else {
        let data = {
          title: "登録害獣情報一覧",
          vermin_infos: results.rows,
          count: results.count,
          page: pg,
          pnum: pnum
        }
        res.render("hunter/show_registered_vermin_infos", data);
      }
    })
  }
});

// 登録害獣位置情報一覧 post (削除)
router.post("/show_registered_vermin_infos", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_hunter: true})){return};
  db.vermin_info.destroy({
    where: {
      id: req.body.vermin_infos_id
    }
  })
  .then(() => {
    console.log(chalk.red("deleted: "), req.body.vermin_infos_id);
    res.redirect("/hunter/show_registerd_vermin_infos");
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  });
});

// 処理施設検索 get
router.get("/search_facilities", (req, res, next) => {
  db.regions.findAll()
  .then((all_regions) => {
    let data = {
      title: "処理施設検索",
      regions: all_regions,
      result: ""
    }
    res.render("hunter/search_facilities", data);
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
router.get("/facility_detail", (req, res, next) => {
  db.users.findByPk(req.query.id)
  .then((usr) => {
    let data = {
      title: "処理施設詳細",
      result: usr
    }
    res.render("hunter/facility_detail", data);
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  });
});

module.exports = router;