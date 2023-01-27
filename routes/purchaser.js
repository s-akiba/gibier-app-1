var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");
var func_file = require("./func_file.js");

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
  db.wild_animal_info.findAll()
  .then((result_animals) => {
    db.categories.findAll()
    .then((result_categories) => {
      let data = {
        title: "商品検索/一覧",
        animals: result_animals,
        categories: result_categories,
        item: ""
      }
      res.render('purchaser/search_item', data);
    })
  });
  
});

// 商品の検索処理
/* 
  sequelizeで表4つの内部結合分からんのでsqlベタ打ちします
  ・commodities,wild_animal_infos,categories,usersを内部結合するsql
    select commodities.id,image_link,wild_animal_name,category_name,detail,stock,price,user_name,user_id
    from commodities
    inner join categories on commodities.category_id=categories.id
    inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id
    inner join users on commodities.user_id=users.id
*/
router.post('/items_list',(req,res,next)=>{
  let animal_id = req.body.animal;
  let category_id = req.body.category;
  let facility = req.body.facility;
  let sql = 'select commodities.id,image_link,wild_animal_name,category_name,detail,stock,price,user_name,user_id from commodities inner join categories on commodities.category_id=categories.id inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id inner join users on commodities.user_id=users.id ';
  let where = '';

  db.wild_animal_info.findAll()
  .then((result_animals) => {
    db.categories.findAll()
    .then((result_categories) => {
      let data = {
        title: "商品検索/一覧",
        animals: result_animals,
        categories: result_categories,
      }
      // 動物名だけで検索
      if(animal_id!='' && category_id=='' && facility==''){
        where = 'where wild_animal_info_id=';
        client.query(sql+where+animal_id+';',function(err,result){
          if (err) throw err;
          data["item"] = result.rows;
          res.render('purchaser/items_list',data);
        });
      }
      // カテゴリだけで検索
      else if(animal_id=='' && category_id!='' && facility==''){
        where = 'where category_id=';
        client.query(sql+where+category_id+';',function(err,result){
          if (err) throw err;
          data["item"] = result.rows;
          res.render('purchaser/items_list',data);
        });
      }
      // 処理施設だけで検索
      else if(animal_id=='' && category_id=='' && facility!=''){
        where = "where user_name like '%"+facility+"%'";
        client.query(sql+where,function(err,result){
          if (err) throw err;
          data["item"] = result.rows;
          res.render('purchaser/items_list',data);
        });
      }
      // 動物名とカテゴリで検索
      else if(animal_id!='' && category_id!='' && facility==''){
        where = 'where wild_animal_info_id='+animal_id+' and category_id='+category_id+';';
        client.query(sql+where,function(err,result){
          if (err) throw err;
          data["item"] = result.rows;
          res.render('purchaser/items_list',data);
        });
      }
      // 動物名と処理施設名で検索
      else if(animal_id!='' && category_id=='' && facility!=''){
        where = "where wild_animal_info_id="+animal_id+" and user_name like '%"+facility+"%'";
        client.query(sql+where,function(err,result){
          if (err) throw err;
          data["item"] = result.rows;
          res.render('purchaser/items_list',data);
        });
      }
      // カテゴリと処理施設名で検索
      else if(animal_id=='' && category_id!='' && facility!=''){
        where = "where category_id="+category_id+" and user_name like '%"+facility+"%'";
        client.query(sql+where,function(err,result){
          if (err) throw err;
          data["item"] = result.rows;
          res.render('purchaser/items_list',data);
        });
      }
    })
  });
});

// カートに追加する機能
// purchase_infoに商品ID,処理施設ID、購入者ID、購入個数だけを登録しておく
router.post('/add_cart',(req,res,next)=>{
  db.sequelize.sync()
  .then(()=>db.purchase_info.create({
    commodity_id:req.body.id,
    user_1_id:req.body.facility_id,
    user_2_id:req.session.login['id'],
    num_purchased:req.body.quantity,
    delivery_address:'',
    is_accepted:false,
    is_closed:false
  })).then(result=>{
    res.redirect('/purchaser/search_item');
  });
});

// カート一覧の表示
/*
  欲しい情報：カートID、動物名、カテゴリ、詳細、値段、個数
  purchase_info、commodities、categories、wild_animal_infosの内部結合
  ・commodities、categories、wild_animal_infosの内部結合sql
    select *
    from commodities
    inner join categories on commodities.category_id=categories.id
    inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id
  ・purchase_infoと表３つを内部結合した表を内部結合
    select *
    from purchase_info
    inner join 内部結合した表 on purchase_info.commodity_id=内部結合.id
    where user_2_id=login user
  
    select purchase_infos.id,commodity_id,wild_animal_name,category_name,image_link,price
    from purchase_infos
    inner join (
      select commodities.id,wild_animal_name,detail,category_name,image_link,price
      from commodities
      inner join categories on commodities.category_id=categories.id
      inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id
    ) as ccw on purchase_infos.commodity_id=ccw.id
    where user_2_id=
*/
router.get('/cart_list',(req,res,next)=>{
  let msg_num = 0;
  // console.log(req.query.msg); 
  if (req.query.msg != undefined) {
    msg_num = req.query.msg;
  }
  let sql = 'select purchase_infos.id,commodity_id,wild_animal_name,category_name,detail,image_link,price,num_purchased from purchase_infos inner join (select commodities.id,wild_animal_name,detail,category_name,image_link,price from commodities inner join categories on commodities.category_id=categories.id inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id) as ccw on purchase_infos.commodity_id=ccw.id where user_2_id=';
  client.query(sql+req.session.login['id']+" and is_accepted=false",function(err,result){
    if(err) throw err;
    let data = {
      title: "カート",
      items: result.rows,
      alert_message: msg_num
    }
    res.render('purchaser/cart_list', data);
  })
});

// カート削除機能
router.post('/delete_cart_list',(req,res,next)=>{
  console.log(req.body.id);
  db.purchase_info.destroy({
    where:{id:req.body.id}
  }).then(()=>{
    res.redirect('/purchaser/cart_list');
  });
});

// 決済画面の表示
router.get('/payment',(req,res,next)=>{
  db.users.findByPk(req.session.login.id)
  .then((result_user) => {
    let data = {
      title: "決済画面",
      user: result_user,
      items:req.query.pur_info_id,
    }
    res.render('purchaser/payment',data);
  })
})

async function update_and_decrement(params) {
  
}

// 決済処理
router.post('/payment',(req,res,next)=>{
  console.log(req.body.id_list);
  let id_list = req.body.id_list.split(',').map(function(e){
    return Number(e);
  });
  let address_use = "";
  if (req.body.select_address == "old_address") {
    address_use = req.body.hidden_old_address;
  } 
  if (req.body.select_address == "new_address") {
    address_use = req.body.input_new_address;
  }
  
  db.sequelize.sync()
  .then(() => {
    // let error_exists = false;
    for (var pur_info_id of id_list) {
      console.log("for purchase_info id :", pur_info_id);
      db.purchase_info.findByPk(pur_info_id)
      .then((purcahse_data) => {
        db.commodities.findByPk(purcahse_data.commodity_id)
        .then((commodity_data) => {
          // 購入数が出品数を超えなければ購入を確定する
          if (commodity_data.stock >= purcahse_data.num_purchased) {
            db.commodities.decrement(
              'stock',
              { by: purcahse_data.num_purchased,
              where: {id: purcahse_data.commodity_id}})
            .then(() => {
              console.log("decriment commodity");
              purcahse_data.delivery_address = address_use;
              purcahse_data.is_accepted = true;
              purcahse_data.save()
              .then(() => {
                console.log("updated purchase_info");
              })
            })
          } else {
            // console.log("here")
            // error_exists = true;
            // console.log("here exists:", error_exists);
          }
          // console.log("here exists2:", error_exists);
        })
        // console.log("here exists3:", error_exists);
      })
      // console.log("here exists4:", error_exists);
    }
    // return error_exists;
  })
  .then((error_exists_2) => {
    // console.log("error_exists:", error_exists_2);
    // if (error_exists_2) {
    //   res.redirect("/purchaser/cart_list?msg=1");
    // } else {
    //   res.redirect("/purchaser/cart_list?msg=2");
    // }
    db.purchase_info.count({
      where: {
        user_2_id: req.session.login.id,
        is_accepted: false
      }
    })
    .then((data_count) => {
      if (data_count == 0){
        // success
        res.redirect("/purchaser/cart_list?msg=1");
      } else {
        res.redirect("/purchaser/cart_list?msg=2");
      }
    })
  })
});

// 購入履歴画面の表示
/*
  欲しい情報：カートID、動物名、カテゴリ、詳細、値段、個数、更新日時
  purchase_info、commodities、categories、wild_animal_infosの内部結合
*/
// データベースに列があるのを確認したが、updatedAtを取得しようとするとなぜか存在しない言われる
// router.get('/items_history_list',(req,res,next)=>{
//   let sql = 'select purchase_infos.id,commodity_id,wild_animal_name,category_name,detail,image_link,price,delivery_address,num_purchased from purchase_infos inner join (select commodities.id,wild_animal_name,detail,category_name,image_link,price from commodities inner join categories on commodities.category_id=categories.id inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id) as ccw on purchase_infos.commodity_id=ccw.id where user_2_id=';
//   client.query(sql+req.session.login['id']+" and not delivery_address=''",function(err,result){
//     if(err) throw err;
//     console.log(result.rows);
//     res.render('purchaser/items_history_list',{items:result.rows});
//   })
// });

router.get('/items_history_list',(req,res,next)=>{
  db.purchase_info.findAll({
    where: {
      user_2_id: req.session.login.id,
      is_accepted: true
    },
    include: [
      {model: db.users,
      as: "facility_user"},
      {model: db.commodities}
    ]
  })
  .then((history_results) => {
    console.log(history_results);
    let data = {
      title: "購入履歴",
      items: history_results
    }
    res.render('purchaser/items_history_list', data);
  })
});

// 購入履歴詳細画面の表示
/*
  結合する表：commodities,users,purchase_infos,wild_animal_infos
*/
// router.get('/items_history_detail',(req,res,next)=>{
//   let sql = 'select user_name,num_purchased,purchase_infos.id,commodity_id,wild_animal_name,category_name,detail,image_link,price,delivery_address from purchase_infos inner join (select commodities.id,wild_animal_name,detail,category_name,image_link,price from commodities inner join categories on commodities.category_id=categories.id inner join wild_animal_infos on commodities.wild_animal_info_id=wild_animal_infos.id) as ccw on purchase_infos.commodity_id=ccw.id inner join users on purchase_infos.user_1_id=users.id where user_2_id=';
//   client.query(sql+req.session.login['id']+" and not delivery_address=''",function(err,result){
//     if(err) throw err;
//     console.log(result.rows);
//     res.render('purchaser/items_history_detail',{items:result.rows});
//   })
// });

router.get("/items_history_detail", (req, res, next) => {
  db.purchase_info.findByPk(req.query.id)
  .then((result_purchase_info) => {
    db.commodities.findByPk(result_purchase_info.commodity_id, {
      include: [
        {model: db.users},
        {model: db.wild_animal_info},
        {model: db.categories}
      ]
    })
    .then((result_commodity) => {
      let data = {
        title: "購入履歴詳細",
        purchase_info: result_purchase_info,
        commodity: result_commodity
      }
      res.render("purchaser/items_history_detail", data);
    })
  })
})

// 購入取り消し
router.post('/cancel_purchase',(req,res,next)=>{
  db.purchase_info.findOne({
    where:{id:req.body.purchase_id}
  }).then(result=>{
    result.destroy();
    console.log('deleted');
    res.redirect('/purchaser/items_history_list');
  });
});

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
      title: "処理施設詳細",
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
          title: "購入者依頼作成",
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