var express = require('express');
var router = express.Router();
// 追加
var {Client} = require('pg');
const bcrypt = require('bcrypt'); 
const db = require('../models/index');
const chalk = require('chalk');
const { Op } = require("sequelize");
const { sequelize } = require('../models/index');
const { QueryTypes } = require('sequelize');


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

/* 狩猟者検索画面の表示 */
router.get('/search_hunter',function(req,res,next){
  res.render('facility/search_hunter');
});

// 未完成
/* 狩猟者検索処理 */
router.post('/search',function(req,res,next){
  let name = req.body.name;
  let region = req.body.region;
  let eval = req.body.eval;
  let sql;
  let values;
  
  //狩猟者名だけで検索
  // if(name!=""&&(region==""&&eval=="")){
  //   sql = "select * from users where user_name=?";
  //   values = [name];
  // }
  // //地域だけで検索
  // else if(region!=""&&(name==""&&eval=="")){
  //   sql = "select * from users where region=?";
  //   values = [region];
  // }
  //地域と評価で検索はとりあえずスキップでおｋ

  client.query(
    'select * from users where user_name=(?)',
    [req.body.name],
    (error,results)=>{
      //res.render('facility/hunter_list',{hunters:results});
      console.log(results);
      res.redirect('/facility');
    }
  );
  
});


// 検索結果から/facility/hunter_detail?id=1
// みたいなかんじで遷移
router.get("/hunter_detail")

// 狩猟者詳細画面から /facility/hunter_req_input?user_id=1
// みたいなかんじでgetして指定した狩猟者の情報と一緒に依頼情報入力画面表示
//狩猟依頼情報入力画面の表示
router.get('/hunter_req_input',function(req,res,next){
  res.render('facility/hunter_req_input');
});

//狩猟依頼情報の登録処理
router.post('/create_hunter_req',function(req,res,next){
  let text = req.body.text;
  let animal = req.body.animal;
  let date = req.body.date;
  
  
});



// 購入者指名依頼一覧
// 受注済みでないものだけ取得するようにする
router.get("/show_requests_from_purchaser", (req, res, next) => {
  db.req_from_purchaser.findAll({
    where: {
      [Op.and]: {
        user_2_id: req.session.login.id,
        is_accepted: false,
        is_closed: false
      }
    },
    include: [{
      model: db.users,
      as: "request_user"
    }]
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
    res.redirect("/");
  });
});

// 購入者指名依頼詳細
// 日付指定する
router.get("/request_from_purchaser_detail", (req, res, next) => {
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
  console.log(req.body.accept);
  db.req_from_purchaser.findByPk(req.body.req_id)
  .then((result) => {
    if (req.body.accept == "true") {
      result.is_accepted = true
      result.save()
      .then(() => {
        console.log(chalk.blue("saved is_accepted: true"));
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      })
    } else if (req.body.accept == "false") {
      result.is_closed = true
      result.save()
      .then(() => {
        console.log(chalk.blue("saved is_accepted: false, is_closed: true"));
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      })
    } else {
      console.log("errr");
      res.redirect("/");
    }
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  })
});

// 受注済み購入者依頼一覧
router.get("/show_accepted_requests", (req, res, next) => {
  db.req_from_purchaser.findAll({
    where: {
      [Op.and]: {
        user_2_id: req.session.login.id,
        is_accepted: true,
        is_closed: false,
      }
    },
    include: [{
      model: db.users,
      as: "request_user"
    }]
  })
  .then((results) => {
    let data = {
      title: "受注済み購入者依頼一覧",
      results: results
    }
    res.render("facility/show_accepted_requests", data);
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  })
});

// 受注済み購入者依頼詳細
router.get("/accepted_request_detail", (req, res, next) => {
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
      title: "受注済み購入者依頼詳細",
      result: result,
    }
    res.render("facility/accepted_request_detail", data);
  })
});


// 受注済み購入者依頼状態変更
router.post("/response_to_accepted_request", (req, res, next) => {
  db.req_from_purchaser.findByPk(req.body.req_id)
  .then((result) => {
    if (req.body.completed == "true") {
      result.is_closed = true
      result.save()
      .then(() => {
        console.log(chalk.blue("saved is_closed: true"));
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      })
    } else if (req.body.completed == "false") {
      result.is_closed = true
      result.is_accepted = false
      result.save()
      .then(() => {
        console.log(chalk.blue("saved is_accepted: false, is_closed: true"));
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      })
    } else {
      console.log("errr");
      res.redirect("/");
    }
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  })
});


// 購入者公開依頼検索 get
router.get("/search_requests_from_purchaser", (req, res, next) => {
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


function fmt(template, values) {
  return !values
  ? template
  : new Function(...Object.keys(values), `return \`${template}\`;`)(...Object.values(values).map(value => value ?? ''));
}


// 購入者公開依頼検索 post
router.post("/search_requests_from_purchaser", (req, res, next) => {
  let query_str = "select * from req_from_purchasers where is_public = true AND ";
  let where_str = [];
  if (req.body.word != "") {
    where_str.push(fmt("content LIKE '%${word}%'", {word: req.body.word}));
  }
  if (req.body.categories != 0) {
    where_str.push(fmt("category_id = ${category_id}", {category_id: req.body.categories}));
  }
  if (req.body.animals != 0) {
    where_str.push(fmt("wild_animal_info_id = ${animal_id}", {animal_id: req.body.animals}));
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
    let list_user = [];
    for (let i in results) {
      console.log(results[i]);
      list_user.push(results[i].user_1_id)
    }
    db.users.findAll({
      where: {
        id: {
          [Op.in]: list_user
        }
      }
    })
    .then((req_users) => {
      console.log(chalk.blue(req_users));
      db.categories.findAll()
      .then((result_categories) => {
        db.wild_animal_info.findAll()
        .then((result_animals) => {
          let data = {
            title: "購入者公開依頼検索",
            results: results,
            users: req_users,
            categories: result_categories,
            animals: result_animals,
          }
          res.render("facility/search_requests_from_purchaser", data);
        })
        .catch((err) => {
          console.log("2:", err);
          res.redirect("/");
        });
      })
      .catch((err) => {
        console.log("1:",err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    })
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  })
});


// 購入者公開依頼詳細 get
router.get("/public_request_from_purchaser_detail", (req, res, next) => {
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
  db.req_from_purchaser.findByPk(req.body.req_id)
  .then((result) => {
    result.is_accepted = true
    result.user_2_id = req.session.login.id
    result.save()
    .then(() => {
      console.log(chalk.blue("saved is_accepted: true"));
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    })
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  })
});

module.exports = router;