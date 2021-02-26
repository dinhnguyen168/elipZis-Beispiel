const winston = require('winston');
require('winston-mongodb');

require('express-async-errors');

module.exports.logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: 'log/errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.json(), 
                winston.format.timestamp(),
            )

        }),
        new winston.transports.Http({
            level: 'warn',
            format: winston.format.json()
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.MongoDB({
            db : 'mongodb://localhost/vidly', 
            level: 'error',
            format: winston.format.json()
        }),
    ],
    format: winston.format.combine(
        winston.format.errors({stack : true}),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.simple(),
    ),
    exceptionHandlers: [
        new winston.transports.File({ filename: './log/uncaught-exceptions.log' }),
        new winston.transports.Console({level: 'error'})
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: './log/uncaught-promises-rejects.log' }),
    ]
});