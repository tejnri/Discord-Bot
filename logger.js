const { createLogger, format, transports, config} = require('winston');
const { combine, timestamp, printf, colorize} = format;
const path = require('path');
const logLevels = config.npm.levels;
const systemLogPath = path.join(__dirname, "system.log")

/**
 * This function will create a log instance which will not only show the logs
 * in console but will also save it in file for later usage
 *
 * @type {winston.Logger}
 */
module.exports = createLogger({
    format: combine(
        timestamp(),
        colorize(),
        printf(({ level, message, label, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    levels: logLevels,
    transports: [
        new transports.Console({
            level: 'debug',
        }),
        new transports.File({filename: systemLogPath})
    ],
})