const express = require('express');
const router = express.Router();
const loginCheckMiddleware = require('./util').loginCheckMiddleware;
const mysql = require('./util').mysql;
const config = require('../config/config');
const multer  = require('multer');

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/avatar/');
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + req.session.openID + '.' + file.mimetype.split('image/')[1]);
    }
})
const upload = multer({ storage });

router.post('/upload', upload.single('avatar'), function(req, res, next) {
    const name = req.file.filename;
    mysql(config.dataTables.user).update({ avatar: name }).where({ 
        openID: req.session.openID
    }).then(function(arg) {
        res.json({ success: true });
    }).catch(function(err) {
        res.json({ err });
    })
})

module.exports = router;