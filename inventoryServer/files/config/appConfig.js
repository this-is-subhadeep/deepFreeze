const serverConfig = {
    PORT : process.env.PORT || 8040,
    environment : {
        prod : false
    },
    logLocation : process.env.SERVER_LOGS || './logs'
}

module.exports = {
    serverConfig
}