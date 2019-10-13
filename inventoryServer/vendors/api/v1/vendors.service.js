const dao = require('./vendors.dao');
const logger = require('../../log');

const getAllCompleteVendors = (refDate) => {
    logger.info('service getAllCompleteVendors');
    return dao.getAllCompleteVendors(refDate);
};

const getCompleteVendorsFromList = (venList, refDate) => {
    logger.info('service getCompleteVendorsFromList');
    return dao.getCompleteVendorsFromList(venList, refDate);
};

const addCompleteVendor = (compVen, refDate) => {
    logger.info('service addCompleteVendor');
    return dao.addCompleteVendor(compVen, refDate);
};

const updateCompleteVendor = (compVen, refDate) => {
    logger.info('service updateCompleteVendor');
    return dao.updateCompleteVendor(compVen, refDate);
};

const isUserAuthenticated = (token) => {
    logger.info('service isUserAuthenticated');
    return dao.isUserAuthenticated(token);
};

module.exports = {
    getAllCompleteVendors,
    getCompleteVendorsFromList,
    addCompleteVendor,
    updateCompleteVendor,
    isUserAuthenticated
}