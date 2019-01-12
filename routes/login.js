const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');
const config = require('../config/config');
const mysql = require('./util').mysql;

//加密算法
function sha1(text) {
  return crypto.createHash('sha1').update(text, 'utf8').digest('hex');
}

router.get('/login', function(req, res) {
  const code = req.query.code;
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

  axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    params: {
      appid: config.appid,
      secret: config.secret,
      js_code: code,
      grant_type: "authorization_code"
    }
  }).then(arg1 => {
    if (arg1.status === 200) {
      const sessionKey = arg1.data.session_key;
      const openId = arg1.data.openid;
      //对session_key进行加密保存在客服端
      const skey = sha1(sessionKey);
      const sessionData = {
        skey,
        create_time: currentTime,
        last_login_time: currentTime,
        session_key: sessionKey
      }

      mysql(config.dataTables.session).select('open_id').where({
        open_id: openId
      }).then(arg2 => {
        if (arg2[0] && arg2[0].open_id) {
          return mysql(config.dataTables.session).update(sessionData).where({
            open_id: openId
          })
        } else {
          sessionData.open_id = openId;
          return mysql(config.dataTables.session).insert(sessionData);
        }
      }).then(() => {
        res.json({
          skey
        });
      }).catch(() => {
        res.json({
          skey: null
        });
      })
    } else {
      res.json({
        skey: null
      });
    }
  })
})


module.exports = router;