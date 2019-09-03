const { VendorModel } = require('./vendors.entity');
const logger = require('../../log');
const uuidv1 = require('uuid/v1');

const getCompleteVendorsFromList = (vendors, refDate) => {
    logger.info('dao getAllCompleteVendor');
    return new Promise((resolve, reject) => {
        const refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            logger.debug(JSON.stringify(refDateObj));
            if(vendors) {
                const compVens = new Array();
                vendors.forEach(vendor => {
                    if(refDateObj >= vendor.startDate && refDateObj < vendor.endDate) {
                        const compVen = {
                            _id : vendor._id,
                            name : vendor.name
                        }
                        vendor.details.forEach(detail => {
                            if(refDateObj >= detail._id) {
                                compVen.loanAdded = detail.loanAdded;
                                compVen.loanPayed = detail.loanPayed;
                                compVen.openingDp = detail.openingDp;
                                compVen.deposit = detail.deposit;
                                compVen.remarks = detail.remarks;
                            }
                        });
                        compVens.push(compVen);
                    }
                });
                resolve({
                    status : 200,
                    completeVendors : compVens
                });
            } else {
                reject({
                    status : 404,
                    errorCode : 'B001'
                });
                logger.error('Complete Vendors not Found');
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

const getAllCompleteVendors = (refDate) => {
    logger.info('dao getAllCompleteVendors');
    return new Promise((resolve, reject) => {
        const refDateObj = new Date(refDate);
        if(!isNaN(refDateObj.getTime())) {
            logger.debug(JSON.stringify(refDateObj));
            VendorModel.find({},(err, vendors) => {
                if(err) {
                    reject({
                        status : 500,
                        errorCode : 'S001'
                    });
                    logger.error('Server Error :', err);
                } else if(!vendors) {
                    reject({
                        status : 404,
                        errorCode : 'B001'
                    });
                    logger.error('Vendors not found');
                } else {
                    const compVens = Array();
                    if(vendors) {
                        logger.debug(`Vendors : ${vendors}`);
                        vendors.forEach(vendor => {
                            logger.debug(`vendor : ${vendor}`);
                            if(refDateObj >= vendor.startDate && refDateObj < vendor.endDate) {
                                const compVen = {
                                    _id : vendor._id,
                                    name : vendor.name
                                }
                                for(let i=0; i<vendor.details.length; i++) {
                                    const detail = vendor.details[i];
                                    if(refDateObj >= detail._id) {
                                        compVen.loanAdded = detail.loanAdded;
                                        compVen.loanPayed = detail.loanPayed;
                                        if(detail.loanAdded && detail.loanPayed) {
                                            compVen.totalLoan = detail.loanAdded - detail.loanPayed;
                                        } else if(detail.loanAdded && !detail.loanPayed) {
                                            compVen.totalLoan = detail.loanAdded
                                        } else if(!detail.loanAdded && detail.loanPayed) {
                                            compVen.totalLoan = 0 - detail.loanPayed;
                                        }
                                        compVen.openingDp = detail.openingDp;
                                        compVen.deposit = detail.deposit;
                                        compVen.remarks = detail.remarks;
                                        break;
                                    }
                                }
                                compVens.push(compVen);
                            }
                        });
                        logger.debug(`CompleteVendorList : ${JSON.stringify(compVens)}`);
                        resolve({
                            status : 200,
                            completeVendors : compVens
                        });
                    } else {
                        reject({
                            status : 404,
                            errorCode : 'B001'
                        });
                        logger.error('Complete Vendors not Found');
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

const addCompleteVendor = (completeVendor, refDate) => {
    logger.info('dao addCompleteVendor');
    return new Promise((resolve, reject) => {
        if(completeVendor) {
            const refDateObj = new Date(refDate);
            if(!isNaN(refDateObj.getTime())) {
                const venModel = new VendorModel();
                venModel._id = 'ven-'+uuidv1();
                venModel.name = completeVendor.name;
                venModel.startDate = refDateObj;
                venModel.endDate = new Date('9999-12-31T00:00:00.000Z');
                venModel.details = new Array();
                venModel.details.push({
                    _id : refDateObj,
                    loanAdded : completeVendor.loanAdded,
                    loanPayed : completeVendor.loanPayed,
                    openingDp : completeVendor.openingDp,
                    deposit : completeVendor.deposit,
                    remarks : completeVendor.remarks
                });
                logger.debug(JSON.stringify(venModel));
                venModel.save((err, addedVendor) => {
                    if(err) {
                        reject({
                            status : 500,
                            error : "S001"
                        });
                        logger.error('Vendor not saved :', err);
                    } else {
                        resolve({
                            status : 201,
                            _id : addedVendor._id
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
            logger.error('Complete Vendor should not be empty');
        }
    });
};

const updateCompleteVendor = (vendor, refDate) => {
    logger.info('dao updateCompleteVendor');
    logger.debug(`vendor : ${JSON.stringify(vendor)}`);
    return new Promise((resolve, reject) => {
        // try {
        VendorModel.findOne({
            _id : vendor._id
        },(err, vendorFound) => {
            logger.debug(JSON.stringify(vendorFound));
            if(err) {
                reject({
                    status : 500,
                    errorCode : 'S001'
                });
                logger.error(`Server Error : ${err}`);
            } else if(!vendorFound) {
                reject({
                    status : 404,
                    errorCode : 'B001'
                });
                logger.error('Vendor not found');
            } else {
                vendorFound.name = vendor.name;
                logger.debug(`Result : ${JSON.stringify(vendorFound)}`);
                const refDateObj = new Date(refDate);
                if(!isNaN(refDateObj.getTime())) {
                    logger.debug(`refDateObj : ${JSON.stringify(refDateObj)}`);
                    const newDet = {
                        _id : refDateObj,
                        loanAdded : vendor.loanAdded,
                        loanPayed : vendor.loanPayed,
                        openingDp : vendor.openingDp,
                        deposit : vendor.deposit,
                        remarks : vendor.remarks
                    };
                    logger.debug(`newDet : ${JSON.stringify(newDet)}`);
                    for(let i=0; i<vendorFound.details.length; i++) {
                        logger.debug(refDateObj.getTime()==vendorFound.details[i]._id.getTime() )
                        if(refDateObj.getTime()==vendorFound.details[i]._id.getTime()) {
                            vendorFound.details.splice(i,1);
                        }
                    }
                    vendorFound.details.push(newDet);
                }
                vendorFound.save((err, updatedVendor) => {
                    if(err) {
                        reject({
                            status : 500,
                            errorCode : 'S001'
                        });
                        logger.error(`Complete Vendor could not be Updated : ${err}`);
                    } else if(!updatedVendor) {
                        reject({
                            status : 404,
                            errorCode : 'B001'
                        });
                        logger.error('Complete Vendor could not be Updated');
                    } else {
                        resolve({
                            status : 201,
                            _id : updatedVendor._id
                        });
                    }
                });
            }
        });
    });
};

module.exports = {
    getAllCompleteVendors,
    getCompleteVendorsFromList,
    addCompleteVendor,
    updateCompleteVendor
}