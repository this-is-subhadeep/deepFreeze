const { ProductModel, ProductTypeModel } = require('./products.entity');
const logger = require('../../log');
const uuidv1 = require('uuid/v1');

const getProduct = (id) => {
    logger.debug('dao','getProducts');
    logger.debug(id);
    return new Promise ((resolve, reject) => {
        ProductModel.findOne({
            _id : id
        },(err, product) => {
            logger.debug(product);
            if(err) {
                reject({
                    message : 'Server Error',
                    status : 500
                });
                logger.error(`Server Error : ${err}`);
            } else if(!product) {
                reject({
                    message : 'No Product found',
                    status : 404
                });
                logger.error('Products not found');
            } else {
                resolve({
                    message : 'Product Found',
                    status : 200,
                    product : product
                });
            }
        });
    });
};

const getAllProducts = () => {
    logger.debug('dao','getAllProducts');
    return new Promise((resolve, reject) => {
        ProductModel.find({},(err, products) => {
            if(err) {
                reject({
                    message : 'Server Error',
                    status : 500
                });
                logger.error('Server Error :', err);
            } else if(!products) {
                reject({
                    message : 'No Products found',
                    status : 404
                });
                logger.error('Products not found');
            } else {
                resolve({
                    message : 'Products Found',
                    status : 200,
                    products : products
                });
            }
        });
    });
};

const getProductsByType = (productType) => {
    logger.debug('dao','getProductsByType');
    return new Promise((resolve, reject) => {
        ProductModel.find({
            productType : productType
        }, (err, products) => {
            if(err) {
                reject({
                    message : 'Server Error',
                    status : 500
                });
                logger.error('Server Error :', err);
            } else if(!products) {
                reject({
                    message : 'Product Not found',
                    status : 404
                });
                logger.error('Product not found');
            } else {
                resolve({
                    message : 'Product Found',
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
                    message : 'Server Error',
                    status : 500
                });
                logger.error('Server Error :', err);
            } else if(!productTypes) {
                reject({
                    message : 'No Product Types found',
                    status : 404
                });
                logger.error('Poduct Types not found');
            } else {
                resolve({
                    message : 'Product Types Found',
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
                    message : 'Server Error',
                    status : 500
                });
                logger.error('Server Error :', err);
            } else if(!productType) {
                reject({
                    message : 'Product Type not found',
                    status : 404
                });
                logger.error('Product Type not found');
            } else {
                resolve ({
                    message : 'Product Type found',
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
                    message : 'Complete Products Found',
                    status : 200,
                    completeProducts : compProds
                });
            } else {
                reject({
                    message : 'Complete Products not Found',
                    status : 404
                });
                logger.error('Complete Products not Found');
            }
        } else {
            reject({
                message : 'reference Date should be a valid Date',
                status : 404
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
            getAllProducts().then((res) => {
                const compProds = Array();
                if(res.products) {
                    res.products.forEach(product => {
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
                        message : 'Complete Products Found',
                        status : 200,
                        completeProducts : compProds
                    });
                } else {
                    reject({
                        message : 'Complete Products not Found',
                        status : 404
                    });
                    logger.error('Complete Products not Found');
                }
            }).catch((rej) => {
                reject({
                    message : rej.message,
                    status : rej.status
                });
                logger.error(rej.message);
            });
        } else {
            reject({
                message : 'reference Date should be a valid Date',
                status : 404
            });
            logger.error('reference Date should be a valid Date');
        }
    });
};

const addProduct = (product) => {
    logger.debug('dao','addProduct');
    return new Promise((resolve, reject) => {
        if(product) {
            const prodModel = new ProductModel();
            prodModel._id = 'itm-'+uuidv1();
            prodModel.name = product.name;
            prodModel.productType = product.productType;
            prodModel.startDate = product.startDate;
            prodModel.endDate = product.endDate;
            prodModel.details = product.details;
            prodModel.save((err, addedProduct) => {
                if(err) {
                    reject({
                        message : 'product could not be saved',
                        status : 404
                    });
                    logger.error('Product not saved :', err);
                } else {
                    resolve({
                        message : 'product added',
                        status : 200,
                        product : addedProduct
                    });
                }
            });
        } else {
            reject({
                message : 'product should not be empty',
                status : 404
            });
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
                        message : 'product type could not be saved',
                        status : 404
                    });
                    logger.error('Product Type not saved :', err);
                } else {
                    resolve({
                        message : 'product type added',
                        status : 200,
                        productType : addedProductType
                    });
                }
            });
        } else {
            reject({
                message : 'product type should not be empty',
                status : 404
            });
        }
    });    
};

const addCompleteProduct = (completeProduct, refDate) => {
    logger.debug('dao','addProductType');
    if(completeProduct) {
        refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            product = {
                name : completeProduct.name,
                productType : completeProduct.productType,
                startDate : refDateObj,
                endDate : new Date('9999-12-31T00:00:00.000Z'),
                details : [
                    {
                        _id : refDateObj,
                        packageSize : completeProduct.packageSize,
                        costPrice : completeProduct.costPrice,
                        sellingPrice : completeProduct.sellingPrice
                    }
                ]
            }
            logger.debug(product);
            return addProduct(product);
        } else {
            return new Promise((resolve,reject) => {
                reject({
                    message : 'reference Date should be a valid Date',
                    status : 404
                });
                logger.error('reference Date should be a valid Date');
            });
        }
    } else {
        return new Promise((resolve,reject) => {
            reject({
                message : 'Complete Product should not be empty',
                status : 404
            });
            logger.error('Complete Product should not be empty');
        });
    }
};

const updateProduct = (product) => {
    return new Promise((resolve, reject) => {
        if(!product) {
            reject({
                message : 'product should not be empty',
                status : 404
            });
        } else {
            ProductModel.findOne({
                _id : product._id
            }, (err, productFound) => {
                if(err) {
                    reject({
                        message : 'Server Error',
                        status : 500
                    });
                    logger.error('Server Error :',err);
                } else if (!productFound) {
                    reject({
                        message : 'Product Does not exist',
                        status : 404
                    });
                } else {
                    productFound.name = product.name;
                    productFound.productType = product.productType;
                    productFound.startDate = product.startDate;
                    productFound.endDate = product.endDate;
                    productFound.details = product.details;
                    productFound.save((err, updatedProduct) => {
                        if(err) {
                            reject({
                                message : 'product could not be updated',
                                status : 404
                            });
                            logger.error('Product not updated :', err);
                        } else {
                            resolve({
                                message : 'product updated',
                                status : 200,
                                product : updatedProduct
                            });
                        }
                    });
                }
            });
        }
    });
};

const updateProductType = (productType) => {
    return new Promise((resolve, reject) => {
        if(!productType) {
            reject({
                message : 'product type should not be empty',
                status : 404
            });
        } else {
            ProductTypeModel.findOne({
                _id : productType._id
            }, (err, productTypeFound) => {
                if(err) {
                    reject({
                        message : 'Server Error',
                        status : 500
                    });
                    logger.error('Server Error :',err);
                } else if (!productTypeFound) {
                    reject({
                        message : 'Product Type Does not exist',
                        status : 404
                    });
                } else {
                    productTypeFound.name = productType.name;
                    productTypeFound.showOrder = productType.showOrder;
                    productTypeFound.save((err, updatedProductType) => {
                        if(err) {
                            reject({
                                message : 'product type could not be updated',
                                status : 404
                            });
                            logger.error('Product Type not updated :', err);
                        } else {
                            resolve({
                                message : 'product type updated',
                                status : 200,
                                productType : updatedProductType
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
        try {
            getProduct(completeProduct._id).then(res => {
                prod = res.product;
                prod.name = completeProduct.name;
                prod.productType = completeProduct.productType;
                logger.debug('Result :', prod);
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
                    for(let i=0; i<prod.details.length; i++) {
                        console.log('refDate', refDateObj instanceof Date, refDateObj);
                        console.log('_id    ', prod.details[i]._id instanceof Date, prod.details[i]._id);
                        logger.debug(refDateObj.getTime()==prod.details[i]._id.getTime() )
                        if(refDateObj.getTime()==prod.details[i]._id.getTime()) {
                            console.log('det found at ', i);
                            prod.details.splice(i,1);
                        }
                    }
                    prod.details.push(newDet);
                }
                const prodModel = new ProductModel(prod);
                prodModel.save((err, updatedProduct) => {
                    if(err) {
                        reject({
                            message : `Complete Product could not be Updated : ${err}`,
                            status : 404
                        });
                        logger.error('Complete Product could not be Updated :', err);
                    } else {
                        resolve({
                            message : 'Complete Product Updated',
                            status : 200
                        });
                    }
                });
            }).catch(err => {
                logger.debug(err);
                reject({
                    message : 'Server Error',
                    status : 404
                });
            });
        } catch(e) {
            logger.error(e);
            reject({
                message : `Exception : ${e}`,
                status : 500
            });
        }
    });
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