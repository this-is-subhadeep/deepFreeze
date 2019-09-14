const service = require('./files.service');
const logger = require('../../log');

const upload = (req, res) => {
    logger.info('controller upload');
    service.upload(req, res).then((response) => {
        res.status(response.status).json({
            _id : response.filename
        });
    }).catch((reject) => {
        res.status(reject.status).json([{
            code : reject.errorCode
        }]);
    });
}

module.exports = {
    upload
}