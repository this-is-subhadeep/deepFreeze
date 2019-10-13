const serverConfig = {
    PORT : process.env.PORT || 8040,
    environment : {
        prod : false
    },
    logLocation : process.env.SERVER_LOGS || './logs'
}

const authentication = {
    jwtSecret : 'd33pfr33z3'
}

module.exports = {
    serverConfig,
    authentication
}