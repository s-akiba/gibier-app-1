var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");
var {Client} = require('pg');

// postgresqlとの接続
var client = new Client({
  user:'postgres',
  host:'127.0.0.1',
  database:'gibier_db_1',
  password:'postgres',
  port:5432
})
client.connect()

// 購入者ホーム画面の表示
router.get('/',(req,res,next)=>{
  res.render('purchaser/home');
})

// 商品検索画面の表示
router.get('/search_item',(req,res,next)=>{
  res.render('purchaser/search_item');
});

// 商品の検索処理
/* 
  sequelizeで表4つの内部結合分からんのでsqlベタ打ちします
  ・commodities,wild_animal_infos,categories,usersを内部結合するsql
    select *
    from commodities 
    inner join categories on commodities.category_id=categories.id
    inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id
    inner join users on commodities.user_id=users.id
*/
router.post('/items_list',(req,res,next)=>{
  let animal_id = req.body.animal;
  let category_id = req.body.category;
  let facility = req.body.facility;
  let sql = 'select * from commodities inner join categories on commodities.category_id=categories.id inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id inner join users on commodities.user_id=users.id ';
  let where = '';
  let values = [];
  // 動物名だけで検索
  if(animal_id!='' && category_id=='' && facility==''){
    where = 'where wild_animal_info_id=';
    client.query(sql+where+animal_id+';',function(err,result){
      if (err) throw err;
      console.log(result.rows);
      res.render('purchaser/items_list',{item:result.rows});
    });
  }
  // カテゴリだけで検索
  else if(animal_id=='' && category_id!='' && facility==''){
    where = 'where category_id=';
    client.query(sql+where+category_id+';',function(err,result){
      if (err) throw err;
      res.render('purchaser/items_list',{item:result.rows});
    });
  }
  // 処理施設だけで検索
  else if(animal_id=='' && category_id=='' && facility!=''){
    where = "where user_name like '%"+facility+"%'";
    client.query(sql+where,function(err,result){
      if (err) throw err;
      res.render('purchaser/items_list',{item:result.rows});
    });
  }
  // 動物名とカテゴリで検索
  else if(animal_id!='' && category_id!='' && facility==''){
    where = 'where wild_animal_info_id='+animal_id+' and category_id='+category_id+';';
    client.query(sql+where,function(err,result){
      if (err) throw err;
      res.render('purchaser/items_list',{item:result.rows});
    });
  }
  // 動物名と処理施設名で検索
  else if(animal_id!='' && category_id=='' && facility!=''){
    where = "where wild_animal_info_id="+animal_id+" and user_name like '%"+facility+"%'";
    client.query(sql+where,function(err,result){
      if (err) throw err;
      res.render('purchaser/items_list',{item:result.rows});
    });
  }
  // カテゴリと処理施設名で検索
  else if(animal_id=='' && category_id!='' && facility!=''){
    where = "where category_id="+category_id+" and user_name like '%"+facility+"%'";
    client.query(sql+where,function(err,result){
      if (err) throw err;
      res.render('purchaser/items_list',{item:result.rows});
    });
  }
});

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
});

// 公開購入者依頼作成 get
router.get("/public_request_to_facility", (req, res, next) => {
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