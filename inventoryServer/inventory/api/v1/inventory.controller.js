const service = require('./inventory.service');
const logger = require('../../log');

const getAllCompleteInventory = (req, res) => {
    logger.info('controller getAllCompleteInventory');
    logger.debug(req.params.refDate);
    service.getAllCompleteInventory(req.params.refDate).then((response) => {
        res.status(response.status).send(response.completeInventory);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const addCompleteInventory = (req, res) => {
    logger.info('controller addCompleteInventory');
    service.addCompleteInventory(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send({
            _id : response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
};

module.exports = {
    getAllCompleteInventory,
    addCompleteInventory
}