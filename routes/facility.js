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

module.exports = router;