const winston = require('winston');
const { DailyRotateFile } = require('winston-daily-rotate-file');

const { combine, timestamp, label, json, metadata } = winston.format;
const { Console, File } = winston.transports;

const path = require('path');
const { store: { logs } } = require(path.resolve(__dirname, 'constants.js'));

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: logs.DATE + logs.TIME }),
    label({ label: logs.NAME }), 
    json(),
    metadata()
  ),
  transports: [
    new Console({
      format: winston.format.simple(),
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      filename: logs.FILENAME, 
      datePattern: logs.DATE,
      maxSize: logs.MAX_SIZE,
      maxFiles: logs.MAX_FILES,
      zippedArchive: logs.ZIPPED_ARCHIVE
    })
  ]
});

logger.stream = {
  write: (message, encoding) => {
    logger.error(message);
  }
};

module.exports = logger;
