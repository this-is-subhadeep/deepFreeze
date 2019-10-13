const logger = require('../../log');
const multer = require('multer');
const path = require('path');
const uuidv1 = require('uuid/v1');
const jwt = require('jsonwebtoken');
const { authentication } = require('../../config').appConfig;

const storage = multer.diskStorage({
    destination : './uploads',
    filename : (req, file, cb) => {
        logger.debug(JSON.stringify(file));
        const fileName = `img-${uuidv1()+path.extname(file.originalname)}`
        console.log(fileName);
        cb(null, fileName);
    }
});

const uploadMulter = multer({
    storage : storage,
    limits : {fileSize : 5000000},
    fileFilter : (req, file, cb) => {
        checkFilename(file, cb);
    }
}).single('icon-image');

const checkFilename = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    logger.debug(`extName : ${extName}`);
    const mimeType = fileTypes.test(file.mimetype);
    logger.debug(`mimeType : ${mimeType}`);
    if(extName && mimeType) {
        cb(null, true);
    } else {
        cb({
            name : 'ServiceError',
            message : 'Only Images Allowed',
            code : 'UNSUPPORTED_FILE_TYPE'
        }, false);
    }

};

const upload = (req, res) => {
    logger.info('service upload');
    return new Promise((resolve, reject) => {
        uploadMulter(req, res, err => {
            logger.debug(JSON.stringify(req.file));
            if(err) {
                logger.error(`Error : ${JSON.stringify(err)}`);
                switch(err.code) {
                    case 'LIMIT_FILE_SIZE' :
                        reject({
                            status : 400,
                            errorCode : "B004"
                        });
                        break;
                    case 'UNSUPPORTED_FILE_TYPE' :
                        reject({
                            status : 400,
                            errorCode : "B005"
                        });
                        break;
                    default :
                        reject({
                            status : 400,
                            errorCode : "S001"
                        });
                }
            } else if (!req.file) {
                logger.warn('No file received');
                reject({
                    status : 400,
                    errorCode : 'B003'
                })
            } else {
                logger.debug('Upload OK');
                resolve({
                    status : 200,
                    filename : req.file.filename
                });
                // res.status(200).json({msg : 'OK'});
            }
        });
    });
};

const isUserAuthenticated = (token) => {
    logger.info('service isUserAuthenticated');
    return new Promise((resolve, reject) => {
        if(token) {
            jwt.verify(token, authentication.jwtSecret, (err, decoded) => {
                if(err || !decoded) {
                    resolve({
                        isAuthenticated : false,
                        status : 200
                    });
                } else {
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
    upload,
    isUserAuthenticated
}