const logger = require('logger.js');

const { chromium,
        webkit,
        firefox,
        devices
       } = require("playwright");

function createDeviceList() {
  logger.info(devices);
  return devices;
}
