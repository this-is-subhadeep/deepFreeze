const service = require('./vendors.service');
const logger = require('../../log');

const getAllCompleteVendors = (req, res) => {
    logger.info('controller getAllCompleteVendors');
    logger.debug(req.params.refDate);
    service.getAllCompleteVendors(req.params.refDate).then((response) => {
        res.status(response.status).send(response.completeVendors);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const addCompleteVendor = (req, res) => {
    logger.info('controller addCompleteVendor');
    service.addCompleteVendor(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send({
            _id : response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
};

const updateCompleteVendor = (req, res) => {
    logger.info('controller updateCompleteVendor');
    service.updateCompleteVendor(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send({
            _id : response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

module.exports = {
    getAllCompleteVendors,
    addCompleteVendor,
    updateCompleteVendor
}