const dao = require('./products.dao');
const logger = require('../../log');

const getProductsByType = (prodType) => {
    logger.info('service getProductsByType');
    return dao.getProductsByType(prodType);
};

const getAllProductTypes = () => {
    logger.info('service getAllProductTypes');
    return dao.getAllProductTypes();
};

const getProductType = (prodTypeId) => {
    logger.info('service getProductType');
    return dao.getProductType(prodTypeId);
};

const getAllCompleteProducts = (refDate) => {
    logger.info('service getAllCompleteProducts');
    return dao.getAllCompleteProducts(refDate);
};

const getCompleteProductsFromList = (prodList, refDate) => {
    logger.info('service getCompleteProductsFromList');
    return dao.getCompleteProductsFromList(prodList, refDate);
};

const addProductType = (prodType) => {
    logger.info('service addProductType');
    return dao.addProductType(prodType);
};

const addCompleteProduct = (compProd, refDate) => {
    logger.info('service addCompleteProduct');
    return dao.addCompleteProduct(compProd, refDate);
};

const updateProductType = (prodType) => {
    logger.info('service updateProductType');
    return dao.updateProductType(prodType);
};

const updateCompleteProduct = (compProd, refDate) => {
    logger.info('service updateCompleteProduct');
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