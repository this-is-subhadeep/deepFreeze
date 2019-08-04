const service = require('./products.service');
const logger = require('../../log');

const getProductsByType = (req, res) => {
    logger.debug('controller', 'getProductsByType');
    service.getProductsByType(req.body).then((response) => {
        res.status(response.status).send(response.products);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
};

const getAllProductTypes = (req, res) => {
    logger.debug('controller', 'getAllProductTypes');
    service.getAllProductTypes().then((response) => {
        res.status(response.status).send(response.productTypes);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const getProductType = (req, res) => {
    logger.debug('controller', 'getProductType');
    service.getProductType(req.query.type).then((response) => {
        res.status(response.status).send(response.productType);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const getAllCompleteProducts = (req, res) => {
    logger.debug('controller', 'getAllCompleteProducts');
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
    logger.debug('controller','addProductType');
    service.addProductType(req.body).then((response) => {
        res.status(response.status).send(response._id);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const addCompleteProduct = (req, res) => {
    logger.debug('controller', 'addCompleteProduct');
    service.addCompleteProduct(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send(response._id);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
};

const updateProductType = (req, res) => {
    logger.debug('controller','updateProduct');
    service.updateProductType(req.body).then((response) => {
        res.status(response.status).send(response._id);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

const updateCompleteProduct = (req, res) => {
    logger.debug('controller','updateCompleteProduct');
    service.updateCompleteProduct(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send(response._id);
    }).catch((reject) => {
        res.status(reject.status).send([{
            code : reject.errorCode
        }]);
    });
}

module.exports = {
    getProductsByType,
    getAllProductTypes,
    getProductType,
    getAllCompleteProducts,
    addProductType,
    addCompleteProduct,
    updateProductType,
    updateCompleteProduct
}