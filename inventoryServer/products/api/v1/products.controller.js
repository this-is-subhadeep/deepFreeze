const service = require('./products.service');
const logger = require('../../log');

const getProductsByType = (req, res) => {
    logger.info('controller getProductsByType');
    service.getProductsByType(req.body).then((response) => {
        res.status(response.status).send(response.products);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
};

const getAllProductTypes = (req, res) => {
    logger.info('controller getAllProductTypes');
    service.getAllProductTypes().then((response) => {
        res.status(response.status).send(response.productTypes);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const getProductType = (req, res) => {
    logger.info('controller getProductType');
    service.getProductType(req.query.type).then((response) => {
        res.status(response.status).send(response.productType);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const getAllCompleteProducts = (req, res) => {
    logger.info('controller getAllCompleteProducts');
    logger.debug(req.params.refDate);
    service.getAllCompleteProducts(req.params.refDate).then((response) => {
        res.status(response.status).send(response.completeProducts);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const addProductType = (req, res) => {
    logger.info('controller addProductType');
    service.addProductType(req.body).then((response) => {
        res.status(response.status).send({
            _id : response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const addCompleteProduct = (req, res) => {
    logger.info('controller addCompleteProduct');
    service.addCompleteProduct(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send({
            _id : response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
};

const updateProductType = (req, res) => {
    logger.info('controller updateProduct');
    service.updateProductType(req.body).then((response) => {
        res.status(response.status).send({
            _id : response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const updateCompleteProduct = (req, res) => {
    logger.info('controller updateCompleteProduct');
    service.updateCompleteProduct(req.body, req.params.refDate).then((response) => {
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
    getProductsByType,
    getAllProductTypes,
    getProductType,
    getAllCompleteProducts,
    addProductType,
    addCompleteProduct,
    updateProductType,
    updateCompleteProduct,
    isUserAuthenticated
}