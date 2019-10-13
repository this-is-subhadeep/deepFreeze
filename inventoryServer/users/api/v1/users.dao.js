const { UserModel } = require('./users.entity');
const logger = require('../../log');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authentication } = require('../../config').appConfig;

const login = (user) => {
    logger.info('dao login');
    return new Promise((resolve, reject) => {
        UserModel.findOne({
            _id : user._id
        }, (err, userFound) => {
            if(err) {
                reject({
                    status : 500,
                    errorCode : 'S001'
                });
                logger.error('Server Error :', err);
            } else if(!userFound) {
                reject({
                    status : 400,
                    errorCode : 'B007'
                });
                logger.error('User not found');
            } else {
                bcrypt.compare(user.password, userFound.password, (errComp, comp) => {
                    if(errComp) {
                        reject({
                            status : 500,
                            errorCode : 'S001'
                        });
                        logger.error('Server Error :', err);
                    } else if(comp) {
                        jwt.sign({
                            _id : user._id,
                            email : user.email
                        }, authentication.jwtSecret, {
                            expiresIn : '10m'
                        }, (err, token) => {
                            if(err) {
                                reject({
                                    status : 500,
                                    errorCode : 'S001'
                                });
                            } else {
                                resolve({
                                    status : 200,
                                    _id : userFound._id,
                                    email : userFound.email,
                                    access_level : userFound.access_level,
                                    token : token
                                });
                            }
                        });
                    } else {
                        reject({
                            status : 400,
                            errorCode : 'B007'
                        });
                    }
                });
            }
        });
    });
};

const registerUser = (user) => {
    logger.info('dao registerUser');
    return new Promise((resolve, reject) => {
        if(user) {
            const newUser = new UserModel();
            newUser._id = user._id;
            newUser.email = user.email;
            newUser.password = user.password;
            if(user.access_level) {
                newUser.access_level = user.access_level;
            } else {
                newUser.access_level = 'normal';
            }
            newUser.save((err, addedUser) => {
                if(err) {
                    if(err.message.includes('E11000')) {
                        reject({
                            status : 200,
                            errorCode : 'B006'
                        });
                    } else {
                        reject({
                            status : 500,
                            errorCode : 'S001'
                        });
                    }
                    reject({
                        status : 500,
                        errorCode : "S001"
                    });
                    logger.error('User not saved :', err);
                } else {
                    resolve({
                        status : 201,
                        _id : addedUser._id
                    });
                }
            });
        } else {
            reject({
                status : 400,
                errorCode : "B003"
            });
        }
    });    
};

const isUserAuthenticated = (token) => {
    logger.info('dao isUserAuthenticated');
    return new Promise((resolve, reject) => {
        if(token) {
            console.log(token);
            jwt.verify(token, authentication.jwtSecret, (err, decoded) => {
                console.log(err);
                console.log(decoded);
                if(err || !decoded) {
                    resolve({
                        isAuthenticated : false,
                        status : 200
                    });
                } else {
                    console.log('Here');
                    resolve({
                        isAuthenticated : true,
                        status : 200
                    });
                }
            });
        } else {
            reject({
                status : 400,
                errorCode : "B003"
            });
        }
    });
}

module.exports = {
    login,
    registerUser,
    isUserAuthenticated
}