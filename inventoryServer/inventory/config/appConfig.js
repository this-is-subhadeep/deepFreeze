const serverConfig = {
    PORT : process.env.PORT || 8030,
    environment : {
        prod : false
    },
    logLocation : process.env.SERVER_LOGS || './logs'
}

const dbConfig = {
    mongoURL : process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
    dbName : 'deepFreeze'
}

module.exports = {
    serverConfig,
    dbConfig
}