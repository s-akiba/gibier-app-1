var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); 
const sendmail = require('sendmail')();
const db = require('../models/index');
const uuid = require('uuid');
const chalk = require('chalk');

// ログインチェックの関数
function lgcheck(req, res) {
  if (req.session.login == null) {
      req.session.back = "/";
      res.redirect("/user/login");
      return true;
  } else {
      return false;
  }
}

// バリデーションする
// バリデーションのエラー表示するようにする
// HTMLでもバリデーションしておく



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 新規登録 get
router.get('/add', (req, res, next) => {
  let data = {
    title: "アカウント登録",
    form: new db.email_verify_info(),
    err:null,
    content:"",
    alert_message: ""
    }
  res.render("user/add", data);
});


// アカウント作成時、メール認証前にメールアドレスが既に使われてないか確認
async function checkUnique(req) {
  console.log(chalk.blue("check unique"));
  db.sequelize.sync()
  .then(() => {
    db.users.findOne({
      where: {
        email: req.body.email
      }
    })
  })
  .then(usr => {
    if (usr != null) {
      console.log("not unique");
      return false
    } else {
      console.log("unique");
      return true
    }
  })
  .catch((err) => {
    console.error(err);
    res.redirect("/");
  });
} ;

// メール認証のメール送信
async function sendEmail(req, res) {
  console.log(chalk.blue("send email"));
  db.sequelize.sync()
    .then(() => bcrypt.hash(req.body.pass, 10))
    .then((hashed_pass) => {

      let data = {
        id: uuid.v4(),
        email: req.body.email,
        password: hashed_pass,
        is_facility: false,
        is_purchaser: false,
        is_hunter: false,
        effective_date: new Date
      };

      if (req.body.usertype == "facility") {
        data.is_facility = true
      } else if (req.body.usertype == "purchaser") {
        data.is_purchaser = true
      } else {
        data.is_hunter = true
      }

      return data
    })
    .then((data) => {
      console.log("then:",data);
      db.email_verify_info.create(data)
      .then(result => {
        console.log("created : ", JSON.stringify(result));
        sendmail({
          from: 'ah9hp@yahoo.co.jp',
          to: data.email,
          subject: 'メールのタイトルです',
          text: 'メールの本文です。この例はテキストです。html形式でもOK。\n 127.0.0.1:3000/user/auth?code=' + result.id ,
        }, function(err, reply) {
          console.log("メール送信に失敗");
          console.log(err && err.stack);
          console.dir(reply);
        });
        console.log("send mail");
        res.redirect("/");
      })
      .catch((error) => {
        console.log("DB create error");
        console.error(error);
        res.redirect("/");
      });
    })
    .catch(err => {
      console.error(err);
      res.redirect("/");
    });
};

// メールアドレスが使用されているものだったらエラーメッセージを表示
async function emailUsed(res) {
  console.log(chalk.blue("email address is used"));
  let data = {
    title: "アカウント登録",
    form: new db.email_verify_info(),
    err:null,
    content:"",
    alert_message: "そのメールアドレスは既に使用されています。"
    }
  res.render("user/add", data);
};

// 新規登録 post
router.post('/add', async(req, res, next) => {
  // sync → 同期処理
  let finduser = await checkUnique(req);
  
  if (finduser) {
    await sendEmail(req, res);
  } else {
    await emailUsed(res);
  }
});


// メール認証 get
router.get('/auth', (req, res, next) => {
  const code = req.query.code;
  db.email_verify_info.findByPk(code)
  .then(verify_data => {
    if (!verify_data) {
      console.log("not found pk");
      let resdata = {
        title: "メール認証",
        result: "データが見つかりませんでした。"
      }
      res.render("user/auth", resdata);
    } else {
      let data = {
        email: verify_data.email,
        password: verify_data.password,
        is_facility: verify_data.is_facility,
        is_purchaser: verify_data.is_purchaser,
        is_hunter: verify_data.is_hunter,
        region_id: 1,
        user_name: "",
        address: "",
        bio: "",
        is_invalid: false,
        balance: 0,
        last_logged_on: new Date
      };
      return data
    }
  })
  .then((data) => {
    db.users.create(data)
    .then(result => {
      console.log("created: ", JSON.stringify(result));
      let resdata = {
        title: "メール認証",
        result: "メール認証, アカウント作成完了"
      }
      res.render("user/auth", resdata);
    })
    .catch((error) => {
      console.log("DB create error");
      console.error(error);
      let resdata = {
        title: "メール認証",
        result: "DB エラー"
      }
      res.render("user/auth", resdata);
    });
  })
  .catch(err => {
    console.error(err);
    let resdata = {
      title: "メール認証",
      result: "エラー"
    }
    res.render("user/auth", resdata);
  });
});

// ログイン get
router.get('/login', (req, res, next) => {
  let data = {
    title: "Login",
    content: "登録したメールアドレスとパスワードを入力してください",
    alert_message: ""
  }
  res.render("user/login", data);
});

// ログイン post
router.post('/login', (req, res, next) => {
  db.users.findOne({
    where: {
      email: req.body.email,
    }
  })
  .then(usr => {
    if (usr != null) {
      if (bcrypt.compareSync(req.body.pass, usr.password)) {
        req.session.login = usr;
        console.log("ログイン成功 id:", usr.id);
        usr.last_logged_on = new Date();
        usr.save()
        .then(() => {
          res.redirect("/");
        })
      } else {
        let data = {
          title: "Login",
          content: "",
          alert_message: "名前かパスワードに問題があります。再度入力してください。"
        }
        res.render("user/login", data);
      }
      
    } else {
      let data = {
        title: "Login",
        content: "",
        alert_message: "名前かパスワードに問題があります。再度入力してください。"
      }
      res.render("user/login", data);
    }
  });
});

// 編集 get
router.get('/edit', (req, res, next) => {
  // findByPk → 指定したIDのモデルを取り出す
  if(lgcheck(req, res)){return};
  db.users.findByPk(req.session.login.id)
  .then(usr => {
    db.regions.findAll()
    .then(regs => {
      let data = {
        title: "Edit",
        form: usr,
        content: "",
        regions: regs
      }
    res.render("user/edit", data);
    })
    
  });
});

// 編集 post
router.post('/edit', (req, res, next) => {
  if(lgcheck(req, res)){return};
  console.log("req body",req.body);
  db.users.findByPk(req.body.id)
  .then(usr => {
    usr.email = req.body.email;
    usr.region_id = parseInt(req.body.region);
    usr.user_name = req.body.name;
    usr.address = req.body.address;
    usr.bio = req.body.bio;
    if (req.body.pass != '') {
      let hashed_pass = bcrypt.hashSync(req.body.pass, 10);
      console.log(hashed_pass);
      usr.password = hashed_pass;
    }
    usr.save()
    .then(() => {
      console.log("更新成功");
      res.redirect("/");
    })
    .catch(err => {
      console.log("更新失敗:", err);
      res.redirect("/");
    })
  })
  .catch(err => {
    console.error(err);
    res.redirect("/");
  });
});



module.exports = router;
