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

router.get('/bill', function(req, res, next) {
    const page = req.query.page,
      pageSize = req.query.pageSize;
    // let condition = {
    //   openID: req.session.openID
    // };
    mysql(config.dataTables.bill).select('*').where({
      openID: req.session.openID
    }).orderByRaw('date desc, time desc, id desc').limit(pageSize).offset((page - 1) * pageSize).then(function(arg) {
      // if (arg.length > 0) {
        res.json(arg);
      // } else {
      //   res.status(400).json({
      //     error: '数据不存在'
      //   });
      // }
    })
})

router.post('/bill', function (req, res, next) {
    let billInfo = req.body;
    if (!billInfo) {
      res.status(400).json({
        error: '参数错误'
      });
      return;
    }
    billInfo.openID = req.session.openID;
    mysql(config.dataTables.bill).insert(billInfo).then(function() {
        res.json({ success: true });
    });
})

router.put('/bill', function(req, res, next) {
  let billInfo = req.body;
  if (!billInfo || !billInfo.id) {
    res.status(400).json({
      error: '参数错误'
    });
    return;
  }
  mysql(config.dataTables.bill).update(billInfo).where({ 
    id: billInfo.id,
    openID: req.session.openID
  }).then(function() {
    res.json({ success: true });
  });
})

router.delete('/bill', function(req, res, next) {
  const id = req.query.id;
  if (!id) {
    res.status(400).json({
      error: '参数错误'
    });
    return;
  }
  mysql(config.dataTables.bill).del().where({
    id,
    openID: req.session.openID
  }).then(function() {
    res.json({ success: true });
  })
})



module.exports = router;