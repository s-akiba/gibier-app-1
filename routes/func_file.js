
/** 
 *  Usage
 *  ログインだけチェック
 *      login_class_check(req, res, {});
 *      login_class_check(req, res, {redirect_url: req.originalUrl});
 *  アカウント種別チェック
 *      login_class_check(req, res, {is_facility: true});
 *      login_class_check(req, res, {redirect_url: req.originalUrl, is_facility: true});
*/

function log_redirect(req, res) {
    console.log("アクセス権限がありません");
    req.session.back = "/";
    res.redirect("/user/login");
}

exports.login_class_check = function (req, res, {redirect_url = "/", is_facility = false, is_purchaser = false, is_hunter = false, is_admin = false}) {
    // ログインだけチェックの場合
    if (is_facility == false && is_purchaser == false && is_hunter == false && is_admin == false) {
        if (req.session.login == null) {
            console.log("未ログイン");
            req.session.back = redirect_url;
            res.redirect("/user/login");
            return true;
        }
    } else {
        if (req.session.login == null) {
            console.log("未ログイン");
            req.session.back = redirect_url;
            res.redirect("/user/login");
            return true;
        }
        if (is_facility) {
            if (req.session.login.is_facility == true) {
                return false;
            } else {
                log_redirect(req, res);
                return true;
            }
        }
        if (is_purchaser) {
            if (req.session.login.is_purchaser == true) {
                return false;
            } else {
                log_redirect(req, res);
                return true;
            }
        }
        if (is_hunter) {
            if (req.session.login.is_hunter == true) {
                return false;
            } else {
                log_redirect(req, res);
                return true;
            }
        }
        if (is_admin) {
            if (req.session.login.is_admin == true) {
                return false;
            } else {
                log_redirect(req, res);
                return true;
            }
        }
    }
}


exports.fmt = function (template, values) {
    return !values
    ? template
    : new Function(...Object.keys(values), `return \`${template}\`;`)(...Object.values(values).map(value => value ?? ''));
  }


exports.slice_result_by_date = function (req, original_results) {
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
        // console.log(original_results[i]);
        original_results[i]["user"]["password"] = "";
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
    // console.log(slice_result.length);
    resolve(slice_result);
  })
}