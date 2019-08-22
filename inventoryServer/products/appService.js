const bodyParser = require('body-parser');
const api = require('./api/v1');
const db = require('./db');
const logger = require('./log');

const setupDbConnection = () => {
    db.getDbConnection().on('connected', () => {
        logger.debug('Mongo DB Connected');
    }).on('error', (err) => {
        logger.error('Mongo DB Connection error Occured');
        if(err) {
            logger.error({err});
        }
    });
};

const setAppMiddleware = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : false}));
};

const apiSetup = (app) => {
    app.use('/api/v1', api)
};

module.exports = {
    setupDbConnection,
    setAppMiddleware,
    apiSetup
}