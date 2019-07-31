const service = require('./products.service');
const logger = require('../../log');

const getAllProducts = (req, res) => {
    logger.debug('controller', 'getAllProducts');
    service.getAllProducts().then((response) => {
        res.status(response.status).send(response.products);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
};

const getProductsByType = (req, res) => {
    logger.debug('controller', 'getProductsByType');
    service.getProductsByType(req.body).then((response) => {
        res.status(response.status).send(response.products);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
};

const getAllProductTypes = (req, res) => {
    logger.debug('controller', 'getAllProductTypes');
    service.getAllProductTypes().then((response) => {
        res.status(response.status).send(response.productTypes);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

const getProductType = (req, res) => {
    logger.debug('controller', 'getProductType');
    service.getProductType(req.query.type).then((response) => {
        res.status(response.status).send(response.productType);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

const getAllCompleteProducts = (req, res) => {
    logger.debug('controller', 'getAllCompleteProducts');
    logger.debug(req.params.refDate);
    service.getAllCompleteProducts(req.params.refDate).then((response) => {
        res.status(response.status).send(response.completeProducts);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

const addProduct = (req, res) => {
    logger.debug('controller','addProduct');
    service.addProduct(req.body).then((response) => {
        res.status(response.status).send(response.product);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

const addProductType = (req, res) => {
    logger.debug('controller','addProductType');
    service.addProductType(req.body).then((response) => {
        res.status(response.status).send(response.productType);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

const updateProduct = (req, res) => {
    logger.debug('controller','updateProduct');
    service.updateProduct(req.body).then((response) => {
        res.status(response.status).send(response.product);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

const addCompleteProduct = (req, res) => {
    logger.debug('controller', 'addCompleteProduct');
    service.addCompleteProduct(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send(response.product);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
};

const updateProductType = (req, res) => {
    logger.debug('controller','updateProduct');
    service.updateProductType(req.body).then((response) => {
        res.status(response.status).send(response.productType);
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

const updateCompleteProduct = (req, res) => {
    logger.debug('controller','updateCompleteProduct');
    service.updateCompleteProduct(req.body, req.params.refDate).then((response) => {
        res.status(response.status).send({
            message : response.message
        });
    }).catch((reject) => {
        res.status(reject.status).send(reject.message);
    });
}

module.exports = {
    getAllProducts,
    getProductsByType,
    getAllProductTypes,
    getProductType,
    getAllCompleteProducts,
    addProduct,
    addProductType,
    addCompleteProduct,
    updateProduct,
    updateProductType,
    updateCompleteProduct
}