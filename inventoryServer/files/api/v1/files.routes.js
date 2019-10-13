const router = require('express').Router();
const controller = require('./files.controller');

router.use(controller.isUserAuthenticated);

router.post('/upload', controller.upload);

module.exports = router;
