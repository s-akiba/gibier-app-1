var express = require('express');
var router = express.Router();
const turf = require("@turf/turf");
var fs = require("fs");
const db = require('../models/index');

var prefectures_t= fs.readFileSync("./prefectures.geojson", {encoding: 'utf-8'});
var df_t = JSON.parse(prefectures_t);

// マップテスト
router.get('/map', (req, res, next) => {
  let data = {
    title: "map"
  }
  res.render('hunter/map', data);
});

router.get("/register_vermin_info", (req, res, next) => {
  db.wild_animal_info.findAll()
  .then((result_animals) => {
    let data = {
      title: "害獣位置情報登録",
      animals: result_animals,
    }
    res.render("hunter/register_vermin_info", data);
  })
});

router.post("/register_vermin_info", (req, res, next) => {
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
    console.log("created: ", JSON.stringify(result));
    res.redirect("/");
  })
  .catch((error) => {
    console.log("DB create error");
    console.error(error);
    res.redirect("/");
  });
});

router.get("/getjson", (req, res, next) => {
  let j = {"data1": ["aiu", "eo"]};
  res.json(j);
})



module.exports = router;