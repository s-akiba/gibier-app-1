var express = require('express');
var router = express.Router();
// 追加
var {Client} = require('pg');
const bcrypt = require('bcrypt'); 
const db = require('../models/index');

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

/* 狩猟者検索処理 */
router.post('/search',function(req,res,next){
  let name = req.body.name;
  let region = req.body.region;
  let eval = req.body.eval;
  
  //狩猟者名だけで検索
  if(name!=""&&(region==""&&eval=="")){
    db.users.findAll({
      where:{
        user_name:name
      }
    }).then(usrs=>{
      res.render('facility/hunter_list',{content:usrs});
    });
  }
  //地域だけで検索
  else if(region!=""&&(name==""&&eval=="")){
    db.users.findAll({
      where:{
        address:region
      }
    }).then(usrs=>{
      res.render('facility/hunter_list',{content:usrs});
    });
  }
  //地域と評価で検索はとりあえずスキップでおｋ

});


// 検索結果から/facility/hunter_detail?id=1
// みたいなかんじで遷移
/* 狩猟者詳細画面の表示 */
router.get('/hunter_detail/',function(req,res,next){
  db.users.findAll({
    where:{
      // urlパラメータで狩猟者のID取得
      id:req.query.id
    }
  }).then(usr=>{
    res.render('facility/hunter_detail',{content:usr[0]});
  });
});

// 狩猟者詳細画面から /facility/hunter_req_input?user_id=1
// みたいなかんじでgetして指定した狩猟者の情報と一緒に依頼情報入力画面表示
/* 狩猟者情報入力画面の表示 */
//hunter_detail/hunter_req_input
router.get('/hunter_req_input',function(req,res,next){
  res.render('facility/hunter_req_input');
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
router.post('/create_hunter_req',function(req,res,next){
  let user_1_id = req.session.login["id"];  // ログインしてる処理施設ユーザーID
  let user_2_id = req.query.id;  // 狩猟者ユーザーID
  let text = req.body.text;  // 依頼文
  let date = req.body.date;  // 納期
  let region = req.session.login["region.id"];  // 地域ID
  let animal_id;  //動物ID
  db.wild_animal_infos.findOne({
    where:{
      wild_animal_name:req.body.animal,
    }
  }).then(animal=>{
    animal_id = animal.id;
  })

  /*
  カラムの値を各変数で用意してるので、そいつら使ってCreate  
  */
  db.sequelize.sync().then(()=>db.req_from_facility.create({
    user_1_id: user_1_id,
    user_2_id: user_2_id,
    region_id: region,
    wild_animal_info_id: animal_id,
    content: text,
    appointed_day: date,
    is_public: false,
    is_acceptd: false,
    is_closed: false
  })).then(usr => {
    res.redirect('/facility');
  });
});

module.exports = router;