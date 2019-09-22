const dao = require('./inventory.dao');
const logger = require('../../log');

const getInventory = (refDate) => {
    logger.info('service getAllCompleteInventory');
    return dao.getInventory(refDate);
};

const getInventoriesTillDate = (refDate) => {
    logger.info('service getInventoryTillDate');
    return dao.getInventoriesTillDate(refDate);
};

const getInventoryOpening = (refDate) => {
    logger.info('service getInventoryOpening');
    return dao.getInventoryOpening(refDate);
};

const addInventory = (compInv, refDate) => {
    logger.info('service addCompleteInventory');
    return dao.addInventory(compInv, refDate);
};

const addInventoryOpening = (compInv, refDate) => {
    logger.info('service addInventoryOpening');
    return dao.addInventoryOpening(compInv, refDate);
};

module.exports = {
    getInventory,
    getInventoriesTillDate,
    getInventoryOpening,
    addInventory,
    addInventoryOpening
}