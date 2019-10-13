const dao = require('./users.dao');
const logger = require('../../log');

const login = (user) => {
    logger.info('service login');
    return dao.login(user);
};

const registerUser = (user) => {
    logger.info('service registerUser');
    return dao.registerUser(user);
};

const isUserAuthenticated = (token) => {
    logger.info('service isUserAuthenticated');
    return dao.isUserAuthenticated(token);
}

module.exports = {
    login,
    registerUser,
    isUserAuthenticated
}