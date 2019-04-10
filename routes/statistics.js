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

/** 
 * 我的页面统计总量
 */
router.get('/statistics/count', function(req, res, next) {
    let getAllDays = mysql(config.dataTables.bill).count('date as num').where('openID', '=', req.session.openID).groupBy('date');
    let getAllTimes = mysql(config.dataTables.bill).count('id as num').where({openID: req.session.openID});
    
    Promise.all([getAllDays, getAllTimes]).then(function(arg) {
        res.json({ 
          allDays: arg[0].length,
          allTimes: arg[1][0].num
        })
    }).catch(function(err) {
        res.json({ err })
    })
})

router.get('/statistics/title', function(req, res, next) {
  mysql(config.dataTables.bill)
    .select('title', 'icon', 'color')
    .count('title as count')
    .sum('price as price')
    .where({
      openID: req.session.openID,
      bookType: req.query.bookType
    })
    .groupBy('title')
    .orderBy('count', 'desc').then(arg => {
      res.json(arg)
    })
})

module.exports = router;