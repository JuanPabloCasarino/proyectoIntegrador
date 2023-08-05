import winston from "winston";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal:"red",
        error:"magenta",
        warning:"yellow",
        info:"green",
        http:"blue",
        debug:"white"
    }
}

const log = winston.createLogger({
    level:customLevelsOptions,
    transports:[
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'warn',
            filename: 'src/logs/errors.log',
            format: winston.format.simple()
        })
    ]
})

export default log;