const path = require('path');
const logger = require(path.resolve(__dirname, 'logger.js'));

const { chromium,
        webkit,
        firefox,
        devices
       } = require("playwright");

function createDeviceList() {
  logger.info(devices);
  return devices;
}

module.exports = createDeviceList;
