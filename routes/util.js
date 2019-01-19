const moment = require('moment');
const config = require('../config/config');

//mysql配置
const mysql = require('knex')({
  client: 'mysql',
  connection: {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
  }
})

//检查登录中间件
const loginCheckMiddleware = function (req, res, next) {
  const skey = req.headers.skey;
  // 查询结果
  req.session = null;

  if (!skey) {
    next();
    return;
  }
  // session表查询
  mysql(config.dataTables.session).select('*').where({ 
    skey
  }).then(arg1 => {
    // res.json({arg1});
    // return;
    if (arg1.length > 0) {
      const session = arg1[0];
      const lastLoginTime = session.lastLoginTime;  //上次登录时间
      const expireTime = config.expireTime * 1000;  //过期时间
      if (moment(lastLoginTime, 'YYYY-MM-DD HH:mm:ss').valueOf() + expireTime > +new Date) {
        req.session = session;
      }
      next(); 
    }
  })
  .catch(err => {
    // res.json({err});
    // return;
    next();
  })
}

module.exports = {
  mysql,
  loginCheckMiddleware
}