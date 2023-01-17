var express = require('express');
var router = express.Router();
const turf = require("@turf/turf");
var fs = require("fs");
const db = require('../models/index');
const { sequelize } = require('../models/index');
const { QueryTypes, and } = require('sequelize');
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
});

function fmt(template, values) {
  return !values
  ? template
  : new Function(...Object.keys(values), `return \`${template}\`;`)(...Object.values(values).map(value => value ?? ''));
}

// 害獣情報検索 get
router.get("/search_vermin_infos", (req, res, next) => {
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

// 害獣情報検索 post
router.post("/search_vermin_infos", (req, res, next) => {
  console.log("animal:", req.body.animal);
  console.log("regions:", req.body.region);

  let query_str = "select * from vermin_infos where ";
  let where_str = [];
  if (req.body.region != 0) {
    where_str.push(fmt("region_id = ${region_id}", {region_id: req.body.region}));
  }
  if (req.body.animal != 0) {
    where_str.push(fmt("wild_animal_info_id = ${animal_id}", {animal_id: req.body.animal}));
  }
  let join_query;
  if (where_str.length == 1) {
    query_str += where_str[0];
  } else {
    join_query = where_str.join(" AND ");
    query_str += join_query
  }
  console.log(query_str);
  sequelize.query(query_str, { type: QueryTypes.SELECT })
  .then((results) => {
    console.log(JSON.stringify(results));
    res.redirect("/");
  });

  
});


function slice_result_by_date(req, original_results) {
  return new Promise((resolve, reject) => {
    let slice_result = [];
    let start_day_to_date = null;
    let end_day_to_date = null;
    if (req.query.start_day != 0) {
      start_day_to_date = new Date(req.query.start_day);
    }
    if (req.query.end_day != 0) {
      end_day_to_date = new  Date(req.query.end_day);
    }
    
    if (req.query.start_day == 0 && req.query.end_day == 0) {
      slice_result = original_results;
    } else {
      for (i in original_results) {
        console.log(original_results[i])
        const createdAt_to_date = new Date(original_results[i]["createdAt"].toString())
        if (req.query.start_day.length != 0 && req.query.end_day.length != 0) {
          if (createdAt_to_date >= start_day_to_date && createdAt_to_date <= end_day_to_date) {
            slice_result.push(original_results[i]);
          }
        } else {
          if (req.query.start_day.length != 0 && createdAt_to_date >= start_day_to_date) {
            slice_result.push(original_results[i]);
          } 
          if (req.query.end_day.length != 0 && createdAt_to_date <= end_day_to_date) {
            slice_result.push(original_results[i]);
          }
        }
      }
    }
    console.log(slice_result.length);
    resolve(slice_result);
  })
}


// 検索 get
router.get("/search_vermin_infos_json",(req, res, next) => {
  console.log(req.query);

  if (req.query.animal == 0 && req.query.region == 0) {
    res.json([]);
  } else {
    let query_str = "select * from vermin_infos where ";
    let where_str = [];
    if (req.query.region != 0) {
      where_str.push(fmt("region_id = ${region_id}", {region_id: req.query.region}));
    }
    if (req.query.animal != 0) {
      where_str.push(fmt("wild_animal_info_id = ${animal_id}", {animal_id: req.query.animal}));
    }

    let join_query;
    if (where_str.length == 1) {
      query_str += where_str[0];
    } else {
      join_query = where_str.join(" AND ");
      query_str += join_query
    }
    console.log("query: ",query_str);
    sequelize.query(query_str, { type: QueryTypes.SELECT })
    .then((results) => {
      console.log(JSON.stringify(results));
      
      // console.log("result", results.length, "to slice", slice_result.length);
      slice_result_by_date(req, results)
      .then((slice_result) => {
        res.json(slice_result);
      })
    });
  }
});


module.exports = router;