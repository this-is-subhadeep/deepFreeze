const dao = require('./products.dao');
const logger = require('../../log');

const getProductsByType = (prodType) => {
    logger.debug('service', 'getProductsByType');
    return dao.getProductsByType(prodType);
};

const getAllProductTypes = () => {
    logger.debug('service', 'getAllProductTypes');
    return dao.getAllProductTypes();
};

const getProductType = (prodTypeId) => {
    logger.debug('service', 'getProductType');
    return dao.getProductType(prodTypeId);
};

const getAllCompleteProducts = (refDate) => {
    logger.debug('service', 'getAllCompleteProducts');
    return dao.getAllCompleteProducts(refDate);
};

const getCompleteProductsFromList = (prodList, refDate) => {
    logger.debug('service', 'getCompleteProductsFromList');
    return dao.getCompleteProductsFromList(prodList, refDate);
};

const addProductType = (prodType) => {
    logger.debug('service', 'addProductType');
    return dao.addProductType(prodType);
};

const addCompleteProduct = (compProd, refDate) => {
    logger.debug('service', 'addCompleteProduct');
    return dao.addCompleteProduct(compProd, refDate);
};

const updateProductType = (prodType) => {
    logger.debug('service', 'updateProductType');
    return dao.updateProductType(prodType);
};

const updateCompleteProduct = (compProd, refDate) => {
    logger.debug('service', 'updateCompleteProduct');
    return dao.updateCompleteProduct(compProd, refDate);
};

module.exports = {
    getProductsByType,
    getAllProductTypes,
    getProductType,
    getAllCompleteProducts,
    getCompleteProductsFromList,
    addProductType,
    addCompleteProduct,
    updateProductType,
    updateCompleteProduct
}