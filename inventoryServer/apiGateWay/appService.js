const bodyParser = require('body-parser');
const { serverConfig } = require('./config').appConfig;
const cors = require('cors');
const morgan = require('morgan');
const httpProxy = require('http-proxy-middleware');
const swaggerUi = require ('swagger-ui-express');
const swaggerDocument = require ('./swagger.json');

const apiSetup = (app) => {
    app.use(cors({
        credentials: true,
        origin: '*'
    }));
};

const setupSwagger = (app) => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

const setupMiddleware = (app) => {
    morgan.token('time', () => new Date().toISOString());
    app.use(morgan('[:time] :remote-addr :method :url :status :res[content-length] :response-time ms'));
    
    app.use('/product', httpProxy({
        target : serverConfig.productURL,
        changeOrigin : true,
        pathRewrite : {
            '^/product' : '/api/v1'
        }
    }));

};

module.exports = {
    apiSetup,
    setupSwagger,
    setupMiddleware
}