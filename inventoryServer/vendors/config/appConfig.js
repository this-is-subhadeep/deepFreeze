const serverConfig = {
    PORT : process.env.PORT || 8020,
    environment : {
        prod : false
    },
    logLocation : process.env.SERVER_LOGS || './logs'
}

const dbConfig = {
    mongoURL : process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
    dbName : 'deepFreeze'
}

const authentication = {
    jwtSecret : 'd33pfr33z3'
}

module.exports = {
    serverConfig,
    dbConfig,
    authentication
}