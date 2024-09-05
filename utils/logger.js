const winston = require('winston');
const { DailyRotateFile } = require('winston-daily-rotate-file');

const { combine, timestamp, label, json, metadata } = winston.format;
const { Console, File } = winston.transports;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    label({ label: 'een-proto' }), 
    json(),
    metadata()
  ),
  transports: [
    new Console({
      format: winston.format.simple(),
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      filename: './logs/%DATE%.log', 
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14',
      zippedArchive: true
    })
  ]
});

logger.stream = {
  write: (message, encoding) => {
    logger.error(message);
  }
};

module.exports = logger;
