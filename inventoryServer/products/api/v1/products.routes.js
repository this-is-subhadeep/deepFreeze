const router = require('express').Router();
const controller = require('./products.controller');

router.get('/product-types', controller.getAllProductTypes);

router.get('/product-type', controller.getProductType);

router.get('/complete-products/:refDate', controller.getAllCompleteProducts);

router.post('/product-types', controller.addProductType);

router.post('/complete-products/:refDate', controller.addCompleteProduct);

router.put('/product-types', controller.updateProductType);

router.put('/complete-products/:refDate', controller.updateCompleteProduct);

module.exports = router;
