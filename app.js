const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const billRouter = require('./routes/bill');
const app = express();
const port = config.port;

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

app.use(function(req, res, next) {
    res.status(404).json({
        error: '资源未找到'
    });
});

app.use(function(error, req, res, next) {
    console.log(error);
    res.status(500).json({
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
});