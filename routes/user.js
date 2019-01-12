const express = require('express');
const router = express.Router();
const loginCheckMiddleware = require('./util').loginCheckMiddleware;
const mysql = require('./util').mysql;
const config = require('../config/config');

router.use(loginCheckMiddleware);

router.all('*', function (req, res, next) {
  if (!req.session) {
    res.status(401).json({
      error: '未登录'
    });
    return;
  }
  next();
});

router.get('/user', (req, res) => {
  // res.json(req.session);
  // return;
  mysql(config.dataTables.user).select('*').where({
    open_id: req.session.open_id
  }).then(function (arg) {
    if (arg.length > 0) {
      const data = arg[0];
      delete data.open_id;
      res.json(data);
    } else {
      res.status(400).json({
        error: '用户不存在'
      });
    }
  });
})

//新增用户
router.post('/user', function (req, res, next) {
  let userInfo = req.body;
  if (!userInfo) {
    res.status(400).json({
      error: '参数错误'
    });
    return;
  }

  mysql(config.dataTables.user).count('open_id').where({
    open_id: req.session.open_id
  }).then(function (arg1) {
      if (arg1[0] && arg1[0].open_id) {
        res.status(400).json({
          error: '用户已存在'
        });
      } else {
        userInfo.open_id = req.session.open_id;
        mysql(config.dataTables.user).insert(userInfo).then(function() {
          // delete userInfo.open_id;
          // res.json(userInfo);
          res.json({ success: true });
        });
      }
    });
});

//更新用户
router.put('/user', function (req, res, next) {
  let userInfo = req.body;
  if (!userInfo) {
    res.status(400).json({
      error: '参数错误'
    });
    return;
  }

  mysql(config.dataTables.user).update(userInfo).where({
    open_id: req.session.open_id
  }).then(function () {
    res.json(userInfo);
  });
});

module.exports = router;