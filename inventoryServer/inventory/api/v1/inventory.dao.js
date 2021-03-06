const { InventoryModel, InventoryOpeningModel } = require('./inventory.entity');
const logger = require('../../log');
const jwt = require('jsonwebtoken');
const { authentication } = require('../../config').appConfig;

const fillStock = (inv, compInv) => {
    logger.debug('fillStockIn');
    if(inv) {
        if(inv.stockIn) {
            inv.stockIn.forEach(stockIn => {
                if(stockIn && stockIn._id) {
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
            inv.stockOut.forEach(stockOut => {
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
        if(inv.deposits) {
            compInv.vendorDeposits = {};
            inv.deposits.forEach(deposit => {
                if(deposit && deposit._id) {
                    compInv.vendorDeposits[deposit._id.vendorId] = deposit.amount;
                }
            });
        }
    }
};

const getInventory = (refDate) => {
    logger.info('dao getInventory');
    return new Promise((resolve, reject) => {
        const refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            InventoryModel.findById(refDateObj, (err, inventory) => {
                if(err) {
                    reject({
                        status : 500,
                        errorCode : 'S001'
                    });
                    logger.error('Server Error :', err);
                } else {
                    const compInv = {};
                    if(inventory) {
                        compInv.date = inventory._id;
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

const getInventoriesTillDate = (refDate) => {
    logger.info('dao getInventoriesTillDate');
    return new Promise((resolve, reject) => {
        const refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            let refDateObjStart = new Date(refDateObj);
            refDateObjStart.setDate(1);
            InventoryModel.find({
                _id : {
                    $gte : refDateObjStart
                },
                _id : {
                    $lte : refDateObj
                }}, (err, inventories) => {
                if(err) {
                    reject({
                        status : 500,
                        errorCode : 'S001'
                    });
                    logger.error('Server Error :', err);
                } else {
                    let compInvs = Array();
                    if(inventories) {
                        // logger.debug(JSON.stringify(inventories));
                        inventories.forEach(inv => {
                            let compInv = {};
                            if(inv) {
                                console.log(inv._id)
                                compInv.date = inv._id;
                                fillStock(inv, compInv);
                            }
                            compInvs.push(compInv);
                        });
                    }
                    // const compInv = {};
                    // if(inventory) {
                    //     fillStock(inventory, compInv);
                    // }
                    resolve({
                        status : 200,
                        inventories : compInvs
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
}

const fillStockOpening = (invOpen, compInvOpen) => {
    logger.debug('fillStockOpening');
    if(invOpen) {
        if(invOpen.stockOpening) {
            invOpen.stockOpening.forEach(stockOpening => {
                if(stockOpening && stockOpening._id) {
                    if(!compInvOpen.rows) {
                        compInvOpen.rows={};
                    }
                    compInvOpen.rows[stockOpening._id.productId] = {
                        packages : stockOpening.packages,
                        pieces : stockOpening.pieces
                    };
                }
            });
        }
    }
};

const getInventoryOpening = (refDate) => {
    logger.info('dao getInventoryOpening');
    return new Promise((resolve, reject) => {
        const refDateObj = new Date(refDate);
        refDateObj.setDate(1);
        if(!isNaN(refDateObj.getTime())) {
            InventoryOpeningModel.findById(refDateObj, (err, inventoryOpening) => {
                if(err) {
                    reject({
                        status : 500,
                        errorCode : 'S001'
                    });
                    logger.error('Server Error :', err);
                } else {
                    const compInvOpen = {};
                    if(inventoryOpening) {
                        fillStockOpening(inventoryOpening, compInvOpen);
                    }
                    resolve({
                        status : 200,
                        inventoryOpening : compInvOpen
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
        for (prodId in compInv.rows) {
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
        for(venId in compInv.rows[prodId].vendorValue) {
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

const saveDeposits = (compInv, inv) => {
    logger.debug('saveDeposits');
    for(venId in compInv.vendorDeposits) {
        deposit = {
            _id : {
                vendorId : venId
            },
            amount : compInv.vendorDeposits[venId]
        }
        inv.deposits.push(deposit);
    }
};

const addInventory = (completeInventory, refDate) => {
    logger.info('dao addInventory');
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
                saveDeposits(completeInventory, invModel);
                invModel.save((err, addedInventory) => {
                    if(err) {
                        reject({
                            status : 500,
                            errorCode : "S001"
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

const saveStockOpening = (compInvOpen, invOpen) => {
    logger.debug('saveStockOpening');
    if(compInvOpen.rows) {
        for (prodId in compInvOpen.rows) {
            let stockOpening = {};
            stockOpening._id = {
                productId : prodId
            }
            stockOpening.packages = compInvOpen.rows[prodId].packages ? compInvOpen.rows[prodId].packages : 0;
            stockOpening.pieces = compInvOpen.rows[prodId].pieces ? compInvOpen.rows[prodId].pieces : 0;
            invOpen.stockOpening.push(stockOpening);
        }
    }
};

const addInventoryOpening = (completeInventoryOpening, refDate) => {
    logger.info('dao addInventoryOpening');
    return new Promise((resolve, reject) => {
        if(completeInventoryOpening) {
            const refDateObj = new Date(refDate);
            refDateObj.setDate(1);
            if(!isNaN(refDateObj.getTime())) {
                InventoryOpeningModel.findByIdAndRemove(refDateObj, (err, invOpen) => {
                    if(err) {
                        reject({
                            status : 500,
                            errorCode : 'S001'
                        });
                        logger.error('Server Error :', err);
                    }
                });
                const invOpenModel = new InventoryOpeningModel();
                invOpenModel._id = refDateObj;
                saveStockOpening(completeInventoryOpening, invOpenModel);
                invOpenModel.save((err, addedInventoryOpening) => {
                    if(err) {
                        reject({
                            status : 500,
                            errorCode : "S001"
                        });
                        logger.error('Opening not saved :', err);
                    } else {
                        resolve({
                            status : 201,
                            _id : addedInventoryOpening._id
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
            logger.error('Inventory Opening should not be empty');           
        }
    });
};

const isUserAuthenticated = (token) => {
    logger.info('dao isUserAuthenticated');
    return new Promise((resolve, reject) => {
        if(token) {
            jwt.verify(token, authentication.jwtSecret, (err, decoded) => {
                if(err || !decoded) {
                    resolve({
                        isAuthenticated : false,
                        status : 200
                    });
                } else {
                    resolve({
                        isAuthenticated : true,
                        status : 200
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
}

module.exports = {
    getInventory,
    getInventoriesTillDate,
    getInventoryOpening,
    addInventory,
    addInventoryOpening,
    isUserAuthenticated
}