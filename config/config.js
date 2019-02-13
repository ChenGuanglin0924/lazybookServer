var config = {
    host: 'https://www.garaschan.online',
    root: '/lazybook/wx',
    port: 4290,
    //过期时间，秒
    expireTime: 24 * 3600,
    appid: 'wx408ec043ed2eaaa1',
    secret: '8f70b5d51e5ea32ec49071cd74610c9f',
    mysql: {
        host: '118.25.214.118',
        port: 3306,
        user: 'root',
        password: '123',  
        database:'lazybook',
    },
    dataTables: {
        session: 'session',
        user: 'user',
        bill: 'bill'
    }
}

module.exports = config;