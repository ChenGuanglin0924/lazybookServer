const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const config = require('./config/config');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const billRouter = require('./routes/bill');
const uploadRouter = require('./routes/upload');
const statisticsRouter = require('./routes/statistics');

const app = express();

// https SSL证书
const options = {
    pfx: fs.readFileSync('cert/GarasChan.pfx'),
    passphrase: '983dIMDA'
};

//静态资源引用
app.use('/resources', express.static('public'));
//跨域处理
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.use(bodyParser.json());
app.get(config.root, function(req, res, next) {
    res.send("Welcome to my lazybook!");
})
app.use(config.root, loginRouter);
app.use(config.root, userRouter);
app.use(config.root, billRouter);
app.use(config.root, uploadRouter);
app.use(config.root, statisticsRouter);

app.use(function(req, res, next) {
    res.status(404).json({
        status: 404,
        error: '资源未找到'
    });
});

app.use(function(error, req, res, next) {
    res.status(500).json({
        status: 500,
        error: '服务器内部错误'
    });
});

app.listen(config.port, function(error) {
    if(error) {
        console.log('error!');
    }
    else {
        console.log(`Express start at port ${config.port}`);
    }
})

// https.createServer(options, app).listen(config.port, function(error) {
//     if(error) {
//         console.log('error!');
//     }
//     else {
//         console.log(`Express start at port ${config.port}`);
//     }
// })