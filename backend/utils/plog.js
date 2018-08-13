var log4js = require('log4js');
log4js.configure({
    appenders: {
        fileLog: { type: 'file', filename: './logs/ExecutionLog.log' },
        console: { type: 'console' }
    },
    categories: {
        file: { appenders: ['fileLog'], level: 'info' },
        another: { appenders: ['console'], level: 'trace' },
        default: { appenders: ['console', 'fileLog'], level: 'trace' }
    }
});
 
exports.clogger = log4js.getLogger('another');
exports.dlogger = log4js.getLogger('file');
