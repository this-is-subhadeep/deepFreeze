const service = require('./inventory.service');
const logger = require('../../log');

const getInventory = (req, res) => {
    logger.info('controller getAllCompleteInventory');
    logger.debug(req.params.refDate);
    service.getInventory(req.params.refDate).then((response) => {
        res.status(response.status).send(response.completeInventory);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code: reject.errorCode
        }]);
    });
}

const getInventoriesTillDate = (req, res) => {
    logger.info('controller getInventoryTillDate');
    logger.debug(req.params.refDate);
    service.getInventoriesTillDate(req.params.refDate).then((response) => {
        res.status(response.status).send(response.inventories);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code: reject.errorCode
        }]);
    });
}

const getInventoryOpening = (req, res) => {
    logger.info('controller getInventoryOpening');
    logger.debug(req.params.refDate);
    service.getInventoryOpening(req.params.refDate).then((response) => {
        res.status(response.status).send(response.inventoryOpening);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code: reject.errorCode
        }]);
    });
}

const addInventory = (req, res) => {
    logger.info('controller addCompleteInventory');
    service.addInventory(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send({
            _id: response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code: reject.errorCode
        }]);
    });
};

const addInventoryOpening = (req, res) => {
    logger.info('controller addInventoryOpening');
    service.addInventoryOpening(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send({
            _id: response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code: reject.errorCode
        }]);
    });
};

const isUserAuthenticated = (req, res, next) => {
    logger.info('controller isUserAuthenticated');
    const bearerAutherization = req.get('Authorization');
    if (!bearerAutherization) {
        res.status(403).send([{
            code: 'S006'
        }]);
    } else {
        service.isUserAuthenticated(bearerAutherization.replace('Bearer ', '')).then((response) => {
            logger.debug({response});
            if (response.isAuthenticated) {
                if(next) {
                    next();
                }
            } else {
                res.status(403).send([{
                    code: 'B007'
                }]);
            }
        }).catch((reject) => {
            res.status(reject.status).send([{
                code: reject.errorCode
            }]);
        });
    }
};

module.exports = {
    getInventory,
    getInventoriesTillDate,
    getInventoryOpening,
    addInventory,
    addInventoryOpening,
    isUserAuthenticated
}