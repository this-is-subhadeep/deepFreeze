const router = require('express').Router();
const controller = require('./inventory.controller');

router.get('/:refDate', controller.getAllCompleteInventory);

router.post('/:refDate', controller.addCompleteInventory);

module.exports = router;
