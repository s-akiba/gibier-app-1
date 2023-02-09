var express = require('express');
var router = express.Router();
// 追加
var {Client} = require('pg');
const db = require('../models/index');
const chalk = require('chalk');
const { Op } = require("sequelize");
const { sequelize } = require('../models/index');
const { QueryTypes } = require('sequelize');
// ファイルアップロード
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
});

const upload = multer({ storage: storage });
var func_file = require("./func_file.js");

// postgresqlとの接続
var client = new Client({
  user:'postgres',
  host:'127.0.0.1',
  database:'gibier_db_1',
  password:'postgres',
  port:5432
})
client.connect()


/* 処理施設ホーム画面の表示 */
router.get('/', function(req, res, next) {
  res.render('facility/home');
});


/* 出品情報入力画面の表示 */
router.get('/exhibit_input',function(req,res,next){
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  console.log('login user id : '+req.session.login["id"]);
  db.wild_animal_info.findAll()
  .then((result_animals) => {
    db.categories.findAll()
    .then((result_categories) => {
      let data = {
        title: "出品情報入力画面",
        animals: result_animals,
        categories: result_categories
      }
      res.render('facility/exhibit_input', data);
    })
  })
  
});

/* 出品情報の登録処理 */
router.post('/exhibit_input',upload.single('file'),function(req,res,next){
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.sequelize.sync()
  .then(()=>db.commodities.create({
    user_id : req.session.login['id'],
    vermin_hunted_id : null,  //わからんからとりあえず埋めとく
    wild_animal_info_id : req.body.animal_options,
    category_id : req.body.category_options,
    detail : req.body.text,
    image_link : req.file.filename,
    price : req.body.price,
    stock : req.body.num,
    selling_term : req.body.limit
  })).then(usr => {
    res.redirect('/facility');
  });
});

/* 出品一覧画面の表示処理 */
router.get('/exhibit_list',function(req,res,next){
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.commodities.findAll({
    where:{
      user_id : req.session.login['id']
    }
  }).then(results => {
    let data = {
      title: "出品一覧画面",
      items: results
    }
    res.render('facility/exhibit_list', data);
  });
});

/* 出品情報詳細画面 */
/*
  commodities,categories,wild_animal_infos を内部結合するsql:
    select * from commodities inner join categories on commodities.category_id=categories.id inner
    join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id
*/
// router.get('/exhibit_detail',function(req,res,next){
//   if (func_file.login_class_check(req, res, {is_facility: true})){return};
//   const com_id = req.query.id;
//   const sql = 'select * from commodities inner join categories on commodities.category_id=categories.id inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id where commodities.id=';
//   console.log(sql+com_id+';');
//   // sequelizeで３つの表を内部結合する方法分からなかったんでsql直接書いちゃいます
//   client.query(sql+com_id+';',function(err,result){
//     if (err) throw err;
//     console.log(result.rows[0]);
//     let date = result.rows[0].selling_term;
//     let limit = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
//     res.render('facility/exhibit_detail',{item:result.rows[0],limit:limit});
//   });
// });

router.get("/exhibit_detail", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.commodities.findOne({
    where: {
      id: req.query.id
    },
    include: [
      {model: db.wild_animal_info},
      {model: db.categories},
    ]
  })
  .then((result_commodity) => {
    let data = {
      title: "出品情報詳細",
      result: result_commodity
    }
    res.render("facility/exhibit_detail", data);
  })
});

/* 出品情報の取り消し処理 */
// router.post('/exhibit_delete',function(req,res,next){
//   db.commodities.findOne({
//     // idで検索して削除しようとしたがうまくいかなかったんでファイル名で削除
//     where:{image_link:req.body.image_link}
//   }).then(commodity=>{
//     commodity.destroy();
//     console.log('deleted');
//     res.redirect('/facility/exhibit_list');
//   });
// });

router.post("/exhibit_delete", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.commodities.destroy({
    where: {
      id: req.body.delete_id
    }
  })
  .then(() => {
    console.log("deleted id:", req.body.delete_id);
    res.redirect("/facility/exhibit_list");
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/facility");
  })
})

/* 狩猟者検索画面の表示 */
router.get('/search_hunter',function(req,res,next){
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  // res.render('facility/search_hunter');
  db.regions.findAll()
  .then(regs => {
    let data = {
      title: "狩猟者検索",
      regions: regs
    }
    res.render("facility/search_hunter", data);
  });
});

router.get("/search_hutner_json", (req, res, next) => {
  let query_data = {is_hunter: true};
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
    res.json([]);
    console.log(err);
  });
});



// 検索結果から/facility/hunter_detail?id=1
// みたいなかんじで遷移
/* 狩猟者詳細画面の表示 */
router.get('/hunter_detail/',function(req,res,next){
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.users.findByPk(req.query.id)
  .then((result) => {
    let data = {
      title: "狩猟者詳細",
      result: result
    }
    res.render("facility/hunter_detail", data);
  })
});

// 狩猟者詳細画面から /facility/hunter_req_input?user_id=1
// みたいなかんじでgetして指定した狩猟者の情報と一緒に依頼情報入力画面表示
/* 狩猟者情報入力画面の表示 */
//hunter_detail/hunter_req_input
router.get("/hunter_req_input", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.users.findByPk(req.query.id)
  .then((usr) => {
    console.log(usr);
    db.wild_animal_info.findAll()
    .then((animals) => {
      let data = {
        title: "狩猟者依頼作成",
        hunter_user: usr,
        animals: animals
      }
      res.render('facility/hunter_req_input', data);
    })
    .catch((err) => {
      console.log("err animal: ", err);
      res.redirect("/facility");
    })
  })
  .catch((err) => {
    console.log("err user: ", err);
    res.redirect("/facility");
  })
});


/* 
狩猟依頼情報登録処理 
  ・ユーザーID(処理施設)
    ログインユーザーのIDをセッションで持ってこれるはず
  ・ユーザーID(狩猟者)
    狩猟者詳細画面からurlパラメータで持ってくる
  ・地域ID
    セッションでログインユーザーの地域を持ってくる
  ・動物ID
    フォームで送られてきた動物名からIDを引っ張ってくる
*/
// router.post('/create_hunter_req',function(req,res,next){
//   let user_1_id = req.session.login["id"];  // ログインしてる処理施設ユーザーID
//   let user_2_id = req.query.id;  // 狩猟者ユーザーID
//   let text = req.body.text;  // 依頼文
//   let date = req.body.date;  // 納期
//   let region = req.session.login["region.id"];  // 地域ID
//   let animal_id;  //動物ID
//   db.wild_animal_infos.findOne({
//     where:{
//       wild_animal_name:req.body.animal,
//     }
//   }).then(animal=>{
//     animal_id = animal.id;
//   })

//   /*
//   カラムの値を各変数で用意してるので、そいつら使ってCreate  
//   */
//   db.sequelize.sync().then(()=>db.req_from_facility.create({
//     user_1_id: user_1_id,
//     user_2_id: user_2_id,
//     region_id: region,
//     wild_animal_info_id: animal_id,
//     content: text,
//     appointed_day: date,
//     is_public: false,
//     is_acceptd: false,
//     is_closed: false
//   })).then(usr => {
//     res.redirect('/facility');
//   });
// });

router.post("/create_hunter_req", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  let data = {
    user_1_id: req.session.login.id,
    user_2_id: null,
    category_id: null,
    wild_animal_info_id: req.body.animal_options,
    num: req.body.request_num,
    content: req.body.content,
    appointed_day: req.body.appointed_day,
    is_public: true,
    is_accepted: false,
    is_closed: false,
  }
  if (req.body.private_or_public == "private") {
    data.user_2_id = req.body.hunter_id;
    data.is_public = false;
  }
  db.req_from_facility.create(data)
  .then(result => {
    console.log("created: ", JSON.stringify(result));
    res.redirect("/facility");
  })
  .catch((error) => {
    console.log("DB create error");
    console.error(error);
    res.redirect("/facility");
  });
});

// 公開狩猟者依頼 get
router.get("/public_hunter_req_input", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.wild_animal_info.findAll()
  .then((animals) => {
    let data = {
      title: "狩猟者依頼作成",
      animals: animals
    }
    res.render('facility/public_hunter_req_input', data);
  })
  .catch((err) => {
    console.log("err animal: ", err);
    res.redirect("/facility");
  })
});

// 公開狩猟者依頼 post
router.post("/public_hunter_req_input", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  let data = {
    user_1_id: req.session.login.id,
    user_2_id: null,
    category_id: null,
    wild_animal_info_id: req.body.animal_options,
    num: req.body.request_num,
    content: req.body.content,
    appointed_day: req.body.appointed_day,
    is_public: true,
    is_accepted: false,
    is_closed: false,
  }
  db.req_from_facility.create(data)
  .then(result => {
    console.log(chalk.green("created: "), JSON.stringify(result));
    res.redirect("/facility");
  })
  .catch((error) => {
    console.log("DB create error");
    console.error(error);
    res.redirect("/facility");
  });
})


// 購入者指名依頼一覧
router.get("/show_requests_from_purchaser", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.req_from_purchaser.findAll({
    where: {
      user_2_id: req.session.login.id
    },
    include: [{
      model: db.users,
      as: "request_user"
    }],
    order: [['createdAt', 'DESC']]
  })
  .then((results) => {
    console.dir(results[0]);
    console.log(results);
    let data  = {
      title: "購入者依頼一覧",
      results: results,
    }
    res.render("facility/show_requests_from_purchaser", data);
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/facility");
  });
});

// 購入者指名依頼詳細
// 日付指定する
router.get("/request_from_purchaser_detail", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.req_from_purchaser.findOne({
    where: {
      id: req.query.id,
    },
    include: [
      {
        model: db.users,
        as: "request_user"
      },
      {model: db.wild_animal_info},
      {model: db.categories},
    ]
  })
  .then((result) => {
    console.dir(result);
    let data = {
      title: "購入者依頼詳細",
      result: result,
    }
    res.render("facility/request_from_purchaser_detail", data);
  })
});

// 依頼受諾処理
router.post("/response_to_request", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  console.log(req.body.change_status);
  db.req_from_purchaser.findByPk(req.body.req_id)
  .then((result) => {
    if (req.body.change_status == "accept") {
      result.is_accepted = true
      result.save()
      .then(() => {
        console.log(chalk.blue("saved is_accepted: true"));
        res.redirect("/facility");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/facility");
      })
    } else if (req.body.change_status == "refuse") {
      result.is_closed = true
      result.save()
      .then(() => {
        console.log(chalk.blue("saved is_accepted: false, is_closed: true"));
        res.redirect("/facility");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/facility");
      })
    } else if (req.body.change_status == "close") {
      result.is_closed = true
      result.save()
      .then(() => {
        console.log(chalk.blue("saved is_accepted: true, is_closed: true"));
        res.redirect("/facility");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/facility");
      })
    } else {
      console.log("errr");
      res.redirect("/facility");
    }
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/facility");
  })
});

// 受注一覧
router.get("/show_order_list", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.purchase_info.findAll({
    where: {
      user_1_id: req.session.login.id,
      is_accepted: true
    },
    include: [
      {model: db.users},
      {model: db.commodities},
    ],
    order: [['createdAt', 'DESC']]
  })
  .then((results) => {
    let data = {
      title: "受注一覧",
      results: results
    }
    console.dir(results);
    res.render("facility/show_order_list", data);
  })
});

// 受注詳細
router.get("/order_detail", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.purchase_info.findOne({
    where: {
      id: req.query.id
    },
    include: [
      {model: db.users}
    ]
  })
  .then((result) => {
    db.commodities.findOne({
      where: {
        id: result.commodity_id
      },
      include: [
        {model: db.wild_animal_info},
        {model: db.categories}
      ]
    })
    .then((result_commodity) => {
      let data = {
        title: "受注詳細",
        result: result,
        commodity: result_commodity
      }
      res.render("facility/order_detail", data);
    })
  })
});

// 受注状態変更 post
router.post("/order_change_status", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.purchase_info.findByPk(req.body.req_id)
  .then((result) => {
    if (req.body.change_status == "close") {
      result.is_closed = true;
    }
    result.save()
    .then(() => {
      console.log(chalk.blue("saved"));
      res.redirect("/facility");
    })
  })
});


// 購入者公開依頼検索 get
router.get("/search_requests_from_purchaser", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.categories.findAll()
  .then((result_categories) => {
    db.wild_animal_info.findAll()
    .then((result_animals) => {
      let data = {
        title: "購入者公開依頼検索",
        categories: result_categories,
        animals: result_animals,
        results: "",
        users: "",
      }
      res.render("facility/search_requests_from_purchaser", data);
    })
    .catch((err) => {
      console.log("2:", err);
    });
  })
  .catch((err) => {
    console.log("1:",err);
  });
});


// 購入者公開依頼検索 post

router.get("/search_requests_from_purchaser_json", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  let query_data = {
    is_public: true,
    is_accepted: false,
    is_closed: false,
    appointed_day: {[Op.gt]: new Date()}
  }
  if (req.query.search_word.length != 0) {
    query_data["content"] = {[Op.like]: '%' + req.query.search_word + '%'};
  }
  if (req.query.category != 0) {
    query_data["category_id"] = req.query.category;
  }
  if (req.query.animal != 0) {
    query_data["wild_animal_info_id"] = req.query.animal;
  }
  db.req_from_purchaser.findAll({
    where: query_data,
    include: [
      {
        model: db.users,
        as: "request_user"
      },
      {model: db.wild_animal_info},
      {model: db.categories},
    ]
  })
  .then((results) => {
    console.log(JSON.stringify(results));
    res.json(results);
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/facility");
  })
});


// 購入者公開依頼詳細 get
router.get("/public_request_from_purchaser_detail", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.req_from_purchaser.findOne({
    where: {
      id: req.query.id,
    },
    include: [
      {
        model: db.users,
        as: "request_user"
      },
      {model: db.wild_animal_info},
      {model: db.categories},
    ]
  })
  .then((result) => {
    console.dir(result);
    let data = {
      title: "購入者公開依頼詳細",
      result: result,
    }
    res.render("facility/public_request_from_purchaser_detail", data);
  })
});

// 購入者公開依頼受注処理 post
router.post("/response_to_public_request", (req, res, next) => {
  if (func_file.login_class_check(req, res, {is_facility: true})){return};
  db.req_from_purchaser.findByPk(req.body.req_id)
  .then((result) => {
    result.is_accepted = true;
    result.user_2_id = req.session.login.id;
    result.save()
    .then(() => {
      console.log(chalk.blue("saved is_accepted: true"));
      res.redirect("/facility");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/facility");
    })
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/facility");
  })
});


module.exports = router;