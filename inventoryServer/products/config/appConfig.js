const serverConfig = {
    PORT : 3000,
    environment : {
        prod : false
    }
}

const dbConfig = {
    mongoURL : process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
    dbName : 'deepFreeze'
}

module.exports = {
    serverConfig,
    dbConfig
}