const mongoose = require('mongoose');
const { dbConfig } = require('../config').appConfig;

const getDbConnection = () => {
    mongoose.connect(dbConfig.mongoURL+'/'+dbConfig.dbName, {useNewUrlParser : true, useFindAndModify: false});
    return mongoose.connection;
};

module.exports = {
    getDbConnection
}