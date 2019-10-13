const { serverConfig } = require('./config').appConfig;
const cors = require('cors');
const morgan = require('morgan');
const httpProxy = require('http-proxy-middleware');
const swaggerUi = require ('swagger-ui-express');
const swaggerDocument = require ('./swagger.json');
const logger = require('./log');

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
    app.use(morgan(
        '[:time] :remote-addr :method :url :status :res[content-length] :response-time ms',
        {
            stream : logger.stream
        }
    ));
    
    app.use('/product', httpProxy({
        target : serverConfig.productURL,
        changeOrigin : true,
        pathRewrite : {
            '^/product' : '/api/v1'
        }
    }));

    app.use('/vendor', httpProxy({
        target : serverConfig.vendorURL,
        changeOrigin : true,
        pathRewrite : {
            '^/vendor' : '/api/v1'
        }
    }));

    app.use('/inventory', httpProxy({
        target : serverConfig.inventoryURL,
        changeOrigin : true,
        pathRewrite : {
            '^/inventory' : '/api/v1'
        }
    }));

    app.use('/file', httpProxy({
        target : serverConfig.fileURL,
        changeOrigin : true,
        pathRewrite : {
            '^/file' : '/api/v1'
        }
    }));

    app.use('/user', httpProxy({
        target : serverConfig.userURL,
        changeOrigin : true,
        pathRewrite : {
            '^/user' : '/api/v1'
        }
    }));

};

module.exports = {
    apiSetup,
    setupSwagger,
    setupMiddleware
}