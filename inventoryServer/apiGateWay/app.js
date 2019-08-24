const express = require('express');
const app = express();
const service = require('./appService');
const { serverConfig } = require('./config').appConfig;
const logger = require('./log');

service.apiSetup(app);
service.setupSwagger(app);
service.setupMiddleware(app);

app.listen(serverConfig.PORT, () => {
    logger.info(`Listening to PORT ${serverConfig.PORT}`);
});