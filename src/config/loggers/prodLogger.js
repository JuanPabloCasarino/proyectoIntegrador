import winston from 'winston';

const log = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: 'http'
        }),
        new winston.transports.file({
            level: 'info',
            filename: 'logs/errors.log'
        })
    ]
})

export default log;