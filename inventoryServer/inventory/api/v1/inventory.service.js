const dao = require('./inventory.dao');
const logger = require('../../log');

const getAllCompleteInventory = (refDate) => {
    logger.info('service getAllCompleteInventory');
    return dao.getAllCompleteInventory(refDate);
};

const addCompleteInventory = (compInv, refDate) => {
    logger.info('service addCompleteInventory');
    return dao.addCompleteInventory(compInv, refDate);
};

module.exports = {
    getAllCompleteInventory,
    addCompleteInventory
}