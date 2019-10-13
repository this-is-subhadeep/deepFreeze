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
    getAllCompleteVendors,
    addCompleteVendor,
    updateCompleteVendor,
    isUserAuthenticated
}