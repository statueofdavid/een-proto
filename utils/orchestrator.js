const { chromium, 
	webkit, 
	firefox,
	devices
       } = require("playwright");

const path = require('path');
const logger = require(path.resolve(__dirname, 'logger.js'));

let browsers = [];

async function orchestrator(config) {
  console.log(config);

  try {
    if(config.browserOptions.google) {
      browsers.push(await chromium.launch({
        headless: config.browserOptions.headless,
        sloMo: 1000, 
        logger: {
          isEnabled: (_, severity) => true,
          log: (name, severity, message, args) => {
	    const now = new Date();
            console.log(`[${now.toISOString()}] ${severity} :: ${name} ${message}`);
          }
        }
      }));
    }

    if(config.browserOptions.apple) {
      browsers.push(await webkit.launch({
        headless: config.browserOptions.headless,
        sloMo: 1000, 
        logger: {
          isEnabled: (_, severity) => true,
          log: (name, severity, message, args) => {
	    const now = new Date();
            console.log(`[${now.toISOString()}] ${severity} :: ${name} ${message}`);
          }
        }
      }));
    }
    
    if(config.browserOptions.mozilla) {
      browsers.push(await firefox.launch({
        headless: config.browserOptions.headless,
        sloMo: 1000, 
        logger: {
          isEnabled: (_, severity) => true,
          log: (name, severity, message, args) => {
	    const now = new Date();
            console.log(`[${now.toISOString()}] ${severity} :: ${name} ${message}`);
          }
        }
      }));
    }

    if(config.browserOptions.microsoft) {
      //TODO
    }

    if(config.browserOptions.android) {
      //TODO
    }
	
    if(config.browserOptions.ios) {
      //TODO
    }
    console.log("browsers: " + browsers);
    
    logger.info(JSON.stringify(browsers));

    return browsers;
  } catch (error) {
    logger.error(`failure to launch: ${error}`);
  } finally { browsers = []; }

}

module.exports = orchestrator;
