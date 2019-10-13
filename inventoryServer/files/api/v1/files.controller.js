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

const isUserAuthenticated = (req, res, next) => {
    logger.info('controller isUserAuthenticated');
    const bearerAutherization = req.get('Authorization');
    if (!bearerAutherization) {
        res.status(403).send([{
            code: 'S006'
        }]);
    } else {
        service.isUserAuthenticated(bearerAutherization.replace('Bearer ', '')).then((response) => {
            logger.debug({response});
            if (response.isAuthenticated) {
                if(next) {
                    next();
                }
            } else {
                res.status(403).send([{
                    code: 'B007'
                }]);
            }
        }).catch((reject) => {
            res.status(reject.status).send([{
                code: reject.errorCode
            }]);
        });
    }
};

module.exports = {
    upload,
    isUserAuthenticated
}