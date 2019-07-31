const express = require('express');
const app = express();
const service = require('./appService');
const { serverConfig } = require('./config').appConfig;
const logger = require('./log');

service.setupDbConnection();
service.setAppMiddleware(app);
service.apiSetup(app);

app.listen(serverConfig.PORT, () => {
    logger.debug(`Listening to PORT ${serverConfig.PORT}`);
});