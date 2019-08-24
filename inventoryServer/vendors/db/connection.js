const mongoose = require('mongoose');
const { dbConfig } = require('../config').appConfig;

const getDbConnection = () => {
    mongoose.connect(dbConfig.mongoURL+'/'+dbConfig.dbName, {useNewUrlParser : true});
    return mongoose.connection;
};

module.exports = {
    getDbConnection
}