const service = require('./users.service');
const logger = require('../../log');

const login = (req, res) => {
    logger.info('controller login');
    service.login(req.body).then((response) => {
        res.status(response.status).send({
            _id : response._id,
            email : response.email,
            access_level : response.access_level,
            token : response.token
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code: reject.errorCode
        }]);
    });
};

const registerUser = (req, res) => {
    logger.info('controller registerUser');
    service.registerUser(req.body).then((response) => {
        res.status(response.status).send({
            _id: response._id
        });
    }).catch((reject) => {
        res.status(reject.status).send([{
            code: reject.errorCode
        }]);
    });
}

const isUserAuthenticated = (req, res) => {
    logger.info('controller isUserAuthenticated');
    const bearerAutherization = req.get('Authorization');
    if(!bearerAutherization) {
        res.status(403).send([{
            code : 'S006'
        }]);
    } else {
        service.isUserAuthenticated(bearerAutherization.replace('Bearer ', '')).then((response) => {
            console.log(response);
            res.status(response.status).send({
                isUserAuthenticated: response.isAuthenticated
            });
        }).catch((reject) => {
            res.status(reject.status).send([{
                code: reject.errorCode
            }]);
        });
    }
}

module.exports = {
    login,
    registerUser,
    isUserAuthenticated
}