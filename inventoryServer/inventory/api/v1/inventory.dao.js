const { InventoryModel } = require('./inventory.entity');
const logger = require('../../log');

const fillStock = (inv, compInv) => {
    logger.debug('fillStockIn');
    if(inv) {
        if(inv.stockIn) {
            logger.debug(JSON.stringify(inv.stockIn));
            inv.stockIn.forEach(stockIn => {
                if(stockIn && stockIn._id) {
                    logger.debug(JSON.stringify(stockIn));
                    if(!compInv.rows) {
                        compInv.rows={};
                    }
                    compInv.rows[stockIn._id.productId] = {
                        stockSenIn : stockIn.packages,
                        stockOthersIn : stockIn.pieces
                    };
                }
            });
        }
        if(inv.stockOut) {
            logger.debug('fillStockOut');
            inv.stockOut.forEach(stockOut => {
                logger.debug(stockOut);
                if(stockOut && stockOut._id) {
                    if(!compInv.rows) {
                        compInv.rows={};
                    }
                    if(!compInv.rows[stockOut._id.productId].vendorValue) {
                        compInv.rows[stockOut._id.productId].vendorValue = {};
                    }
                    compInv.rows[stockOut._id.productId].vendorValue[stockOut._id.vendorId] = {
                        packages : stockOut.packages,
                        pieces : stockOut.pieces
                    };
                }
            });
        }
    }
};

const getAllCompleteInventory = (refDate) => {
    logger.info('dao getAllCompleteInventoryList');
    return new Promise((resolve, reject) => {
        const refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            logger.debug(JSON.stringify(refDateObj));
            InventoryModel.findById(refDateObj, (err, inventory) => {
                if(err) {
                    reject({
                        status : 500,
                        errorCode : 'S001'
                    });
                    logger.error('Server Error :', err);
                } else {
                    logger.debug(JSON.stringify(inventory));
                    const compInv = {};
                    if(inventory) {
                        fillStock(inventory, compInv);
                    }
                    resolve({
                        status : 200,
                        completeInventory : compInv
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
    });
};

const saveStockIn = (compInv, inv) => {
    logger.debug('saveStockIn');
    if(compInv.rows) {
        logger.debug(JSON.stringify(compInv.rows));
        for (prodId in compInv.rows) {
            logger.debug(prodId);
            let stockIn = {};
            stockIn._id = {
                productId : prodId,
                wholeSellerId : "whs-placeHolderForSen"
            }
            stockIn.packages = compInv.rows[prodId].stockSenIn ? compInv.rows[prodId].stockSenIn : 0;
            stockIn.pieces = compInv.rows[prodId].stockOthersIn ? compInv.rows[prodId].stockOthersIn : 0;
            inv.stockIn.push(stockIn);
        }
    }
};

const saveStockOut = (compInv, inv) => {
    logger.debug('saveStockOut');
    for (prodId in compInv.rows) {
        logger.debug(JSON.stringify(compInv.rows[prodId].vendorValue));
        for(venId in compInv.rows[prodId].vendorValue) {
            logger.debug(venId);
            logger.debug(JSON.stringify(compInv.rows[prodId].vendorValue[venId]));
            let stockOut = {};
            stockOut._id = {
                productId : prodId,
                vendorId : venId
            };
            stockOut.packages = compInv.rows[prodId].vendorValue[venId].packages;
            stockOut.pieces = compInv.rows[prodId].vendorValue[venId].pieces;
            inv.stockOut.push(stockOut);
        }
    }
};

const addCompleteInventory = (completeInventory, refDate) => {
    logger.info('dao addCompleteInventory');
    return new Promise((resolve, reject) => {
        if(completeInventory) {
            const refDateObj = new Date(refDate);
            if(!isNaN(refDateObj.getTime())) {
                InventoryModel.findByIdAndRemove(refDateObj, (err, inventory) => {
                    if(err) {
                        reject({
                            status : 500,
                            errorCode : 'S001'
                        });
                        logger.error('Server Error :', err);
                    }
                });
                const invModel = new InventoryModel();
                invModel._id = refDateObj;
                saveStockIn(completeInventory, invModel);
                saveStockOut(completeInventory, invModel);
                logger.debug(JSON.stringify(invModel));
                invModel.save((err, addedInventory) => {
                    if(err) {
                        reject({
                            status : 500,
                            error : "S001"
                        });
                        logger.error('Product not saved :', err);
                    } else {
                        resolve({
                            status : 201,
                            _id : addedInventory._id
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
            logger.error('Inventory should not be empty');
        }
    });
};

module.exports = {
    getAllCompleteInventory,
    addCompleteInventory
}