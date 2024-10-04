const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Log level
  format: winston.format.combine(
    winston.format.timestamp(), // Adding timestamp to log messages
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), 
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const fs = require('fs');
const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

module.exports = logger;