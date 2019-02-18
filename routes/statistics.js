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

module.exports = router;