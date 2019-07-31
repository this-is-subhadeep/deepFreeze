const fs = require('fs');
const conf = require('../config');
const logStream = fs.createWriteStream('log/server.log', {flags: 'a'});
const log = (...args) => {
    let fullText='';
    args.forEach(element => {
        let nextText='';
        // console.log('typeof ', typeof element);
        // console.log('element ',element);
        switch(typeof element) {
            case 'string' :
                nextText = element;
                break;
            case 'object' :
                nextText = (element instanceof Error) ? element.stack : JSON.stringify(element, null, '\t');
                break;
            default :
                nextText = element.toString();
        }
        fullText=fullText===''?nextText:fullText+' '+nextText;
    });
    console.log(fullText);
    logStream.write(new Date().toISOString()+' :: '+fullText+'\n');
};

const debug = (...args) => {
    if(!conf.appConfig.serverConfig.environment.prod) {
        log(...args);
    }
};

const error = (...args) => {
    log(...args);
};

module.exports  = {
    debug,
    error
}