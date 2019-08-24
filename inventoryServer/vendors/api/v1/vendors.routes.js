const router = require('express').Router();
const controller = require('./vendors.controller');

router.get('/:refDate', controller.getAllCompleteVendors);

router.post('/:refDate', controller.addCompleteVendor);

router.put('/:refDate', controller.updateCompleteVendor);

module.exports = router;
