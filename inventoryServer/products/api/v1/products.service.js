const dao = require('./products.dao');
const logger = require('../../log');

const getAllProducts = () => {
    logger.debug('service', 'getAllProducts');
    return dao.getAllProducts();
};

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

const addProduct = (prod) => {
    logger.debug('service', 'addProduct');
    return dao.addProduct(prod);
};

const addProductType = (prodType) => {
    logger.debug('service', 'addProductType');
    return dao.addProductType(prodType);
};

const addCompleteProduct = (compProd, refDate) => {
    logger.debug('service', 'addCompleteProduct');
    return dao.addCompleteProduct(compProd, refDate);
};

const updateProduct = (prod) => {
    logger.debug('service', 'updateProduct');
    return dao.updateProduct(prod);
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
    getAllProducts,
    getProductsByType,
    getAllProductTypes,
    getProductType,
    getAllCompleteProducts,
    getCompleteProductsFromList,
    addProduct,
    addProductType,
    addCompleteProduct,
    updateProduct,
    updateProductType,
    updateCompleteProduct
}