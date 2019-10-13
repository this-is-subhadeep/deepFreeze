const router = require('express').Router();
const controller = require('./users.controller');

router.post('/login', controller.login);

router.post('/register', controller.registerUser);

router.post('/authenticate', controller.isUserAuthenticated);

module.exports = router;
