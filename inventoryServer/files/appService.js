const express = require('express');
const api = require('./api/v1');
const logger = require('./log');
const multer = require('multer');

const apiSetup = (app) => {
    app.use('/api/v1/images', express.static(__dirname+'/uploads'));
    app.use('/api/v1', api)
};

module.exports = {
    apiSetup
}