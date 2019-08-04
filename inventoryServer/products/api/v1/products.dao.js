const { ProductModel, ProductTypeModel } = require('./products.entity');
const logger = require('../../log');
const uuidv1 = require('uuid/v1');

const getProductsByType = (productType) => {
    logger.debug('dao','getProductsByType');
    return new Promise((resolve, reject) => {
        ProductModel.find({
            productType : productType
        }, (err, products) => {
            if(err) {
                reject({
                    status : 500,
                    errorCode : 'S001'
                });
                logger.error('Server Error :', err);
            } else if(!products) {
                reject({
                    status : 404,
                    errorCode : 'B001'
                });
                logger.error('Product not found');
            } else {
                resolve({
                    status : 200,
                    products : products
                });
            }
        });
    });
};

const getAllProductTypes = () => {
    logger.debug('dao','getAllProductTypes');
    return new Promise((resolve, reject) => {
        ProductTypeModel.find({},(err, productTypes) => {
            if(err) {
                reject({
                    status : 500,
                    errorCode : 'S001'
                });
                logger.error('Server Error :', err);
            } else if(!productTypes) {
                reject({
                    status : 404,
                    errorCode : 'B001'
                });
                logger.error('Poduct Types not found');
            } else {
                resolve({
                    status : 200,
                    productTypes : productTypes
                });
            }
        });
    });
};

const getProductType = (productTypeId) => {
    logger.debug('dao','getProductType');
    return new Promise((resolve, reject) => {
        ProductTypeModel.findOne({
            _id : productTypeId
        }, (err, productType) => {
            if(err) {
                reject({
                    status : 500,
                    errorCode : 'S001'
                });
                logger.error('Server Error :', err);
            } else if(!productType) {
                reject({
                    status : 404,
                    errorCode : 'B001'
                });
                logger.error('Product Type not found');
            } else {
                resolve ({
                    status : 200,
                    productType : productType
                });
            }
        });
    });
};

const getCompleteProductsFromList = (products, refDate) => {
    logger.debug('dao', 'getAllCompleteProduct');
    return new Promise((resolve, reject) => {
        refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            logger.debug(refDateObj);
            if(products) {
                res.products.forEach(product => {
                    if(refDateObj >= product.startDate && refDateObj < product.endDate) {
                        compProd = {
                            _id : product._id,
                            name : product.name,
                            productType : product.productType,
                        }
                        product.details.forEach(detail => {
                            if(refDateObj >= detail._id) {
                                compProd.packageSize = detail.packageSize;
                                compProd.costPrice = detail.costPrice;
                                compProd.sellingPrice = detail.sellingPrice;
                            }
                        });
                        compProds.push(compProd);
                    }
                });
                resolve({
                    status : 200,
                    completeProducts : compProds
                });
            } else {
                reject({
                    status : 404,
                    errorCode : 'B001'
                });
                logger.error('Complete Products not Found');
            }
        } else {
            reject({
                status : 400,
                errorCode : 'B002'
            });
            logger.error('reference Date should be a valid Date');
        }
    });
};

const getAllCompleteProducts = (refDate) => {
    logger.debug('dao', 'getAllCompleteProduct');
    return new Promise((resolve, reject) => {
        refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            logger.debug(refDateObj);
            ProductModel.find({},(err, products) => {
                if(err) {
                    reject({
                        status : 500,
                        errorCode : 'S001'
                    });
                    logger.error('Server Error :', err);
                } else if(!products) {
                    reject({
                        status : 404,
                        errorCode : 'B001'
                    });
                    logger.error('Products not found');
                } else {
                    const compProds = Array();
                    if(products) {
                        products.forEach(product => {
                            if(refDateObj >= product.startDate && refDateObj < product.endDate) {
                                compProd = {
                                    _id : product._id,
                                    name : product.name,
                                    productType : product.productType,
                                }
                                for(let i=0; i<product.details.length; i++) {
                                    const detail = product.details[i];
                                    if(refDateObj >= detail._id) {
                                        compProd.packageSize = detail.packageSize;
                                        compProd.costPrice = detail.costPrice;
                                        compProd.sellingPrice = detail.sellingPrice;
                                        break;
                                    }
                                }
                                compProds.push(compProd);
                            }
                        });
                        resolve({
                            status : 200,
                            completeProducts : compProds
                        });
                    } else {
                        reject({
                            status : 404,
                            errorCode : 'B001'
                        });
                        logger.error('Complete Products not Found');
                    }
                }
            });
        } else {
            reject({
                status : 400,
                errorCode : "B002"
            });
            logger.error('reference Date should be a valid Date');
        }
    });
};

const addProductType = (productType) => {
    logger.debug('dao','addProductType');
    return new Promise((resolve, reject) => {
        if(productType) {
            const prodTypeModel = new ProductTypeModel();
            prodTypeModel._id = 'typ-'+uuidv1();
            prodTypeModel.name = productType.name;
            prodTypeModel.showOrder = productType.showOrder;
            prodTypeModel.save((err, addedProductType) => {
                if(err) {
                    reject({
                        status : 500,
                        error : "S001"
                    });
                    logger.error('Product Type not saved :', err);
                } else {
                    resolve({
                        status : 201,
                        _id : addedProductType._id
                    });
                }
            });
        } else {
            reject({
                status : 400,
                errorCode : "B003"
            });
        }
    });    
};

const addCompleteProduct = (completeProduct, refDate) => {
    logger.debug('dao','addProductType');
    return new Promise((resolve, reject) => {
        if(completeProduct) {
            refDateObj = new Date(refDate);
            if(!isNaN(refDateObj.getTime())) {
                const prodModel = new ProductModel();
                prodModel._id = 'itm-'+uuidv1();
                prodModel.name = completeProduct.name;
                prodModel.productType = completeProduct.productType;
                prodModel.startDate = refDateObj;
                prodModel.endDate = new Date('9999-12-31T00:00:00.000Z');
                prodModel.details = new Array();
                prodModel.details.push({
                    _id : refDateObj,
                    packageSize : completeProduct.packageSize,
                    costPrice : completeProduct.costPrice,
                    sellingPrice : completeProduct.sellingPrice
                });
                logger.debug(prodModel);
                prodModel.save((err, addedProduct) => {
                    if(err) {
                        reject({
                            status : 500,
                            error : "S001"
                        });
                        logger.error('Product not saved :', err);
                    } else {
                        resolve({
                            status : 201,
                            _id : addedProduct._id
                        });
                    }
                });
            } else {
                reject({
                    status : 400,
                    errorCode : "B002"
                });
                logger.error('reference Date should be a valid Date');
            }
        } else {
            reject({
                status : 400,
                errorCode : "B003"
            });
            logger.error('Complete Product should not be empty');
        }
    });
};

const updateProductType = (productType) => {
    return new Promise((resolve, reject) => {
        if(!productType) {
            reject({
                status : 400,
                errorCode : "B003"
            });
        } else {
            ProductTypeModel.findOne({
                _id : productType._id
            }, (err, productTypeFound) => {
                if(err) {
                    reject({
                        status : 500,
                        errorCode : 'S001'
                    });
                    logger.error('Server Error :',err);
                } else if (!productTypeFound) {
                    reject({
                        status : 404,
                        errorCode : 'B001'
                    });
                } else {
                    productTypeFound.name = productType.name;
                    productTypeFound.showOrder = productType.showOrder;
                    productTypeFound.save((err, updatedProductType) => {
                        if(err) {
                            reject({
                                status : 500,
                                errorCode : 'S001'
                            });
                            logger.error('Product Type not updated :', err);
                        } else {
                            resolve({
                                status : 201,
                                _id : updatedProductType._id
                            });
                        }
                    });
                }
            });
        }
    });
};

const updateCompleteProduct = (completeProduct, refDate) => {
    logger.debug('dao', 'updateCompleteProduct');
    return new Promise((resolve, reject) => {
        // try {
        ProductModel.findOne({
            _id : completeProduct._id
        },(err, productFound) => {
            logger.debug(productFound);
            if(err) {
                reject({
                    status : 500,
                    errorCode : 'S001'
                });
                logger.error(`Server Error : ${err}`);
            } else if(!productFound) {
                reject({
                    status : 404,
                    errorCode : 'B001'
                });
                logger.error('Products not found');
            } else {
                productFound.name = completeProduct.name;
                productFound.productType = completeProduct.productType;
                logger.debug('Result :', productFound);
                refDateObj = new Date(refDate);
                if(!isNaN(refDateObj.getTime())) {
                    logger.debug('refDateObj :',refDateObj);
                    newDet = {
                        _id : refDateObj,
                        packageSize : completeProduct.packageSize,
                        costPrice : completeProduct.costPrice,
                        sellingPrice : completeProduct.sellingPrice
                    };
                    logger.debug('newDet', newDet);
                    for(let i=0; i<productFound.details.length; i++) {
                        logger.debug(refDateObj.getTime()==productFound.details[i]._id.getTime() )
                        if(refDateObj.getTime()==productFound.details[i]._id.getTime()) {
                            productFound.details.splice(i,1);
                        }
                    }
                    productFound.details.push(newDet);
                }
                productFound.save((err, updatedProduct) => {
                    if(err) {
                        reject({
                            status : 500,
                            errorCode : 'S001'
                        });
                        logger.error('Complete Product could not be Updated :', err);
                    } else if(!updatedProduct) {
                        reject({
                            status : 404,
                            errorCode : 'B001'
                        });
                        logger.error('Complete Product could not be Updated');
                    } else {
                        resolve({
                            status : 201,
                            _id : updatedProduct._id
                        });
                    }
                });
            }
        });
    });
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