const router = require('express').Router();
const controller = require('./inventory.controller');

router.use(controller.isUserAuthenticated);

router.get('/:refDate', controller.getInventory);

router.get('/till-date/:refDate', controller.getInventoriesTillDate);

router.get('/opening/:refDate', controller.getInventoryOpening);

router.post('/:refDate', controller.addInventory);

router.post('/opening/:refDate', controller.addInventoryOpening);

module.exports = router;
