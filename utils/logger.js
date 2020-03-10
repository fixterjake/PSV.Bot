// @ts-check
const { createLogger, format, transports } = require('winston');

// eslint-disable-next-line no-console
console.log('Setting up the logger');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({
      tailable: true,
      maxFiles: 20,
      // This is in bytes
      maxsize: 5e6,
      filename: 'logs/output.log',
    }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

logger.info('Logger set up.');

module.exports = logger;
