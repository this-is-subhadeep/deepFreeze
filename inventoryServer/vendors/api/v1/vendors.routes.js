const router = require('express').Router();
const controller = require('./vendors.controller');

router.use(controller.isUserAuthenticated);

router.get('/:refDate', controller.getAllCompleteVendors);

router.post('/:refDate', controller.addCompleteVendor);

router.put('/:refDate', controller.updateCompleteVendor);

module.exports = router;
