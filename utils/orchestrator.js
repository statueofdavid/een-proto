const { chromium, 
	webkit, 
	firefox,
	devices
       } = require("playwright");

const logger = require('logger.js');

async function firstHundredDescendingAgeOrder(config) {
  console.log(config);

  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"];
 
  const random = Math.random() * userAgents.length;
  const userAgent = userAgents[random.toFixed()];

  try {
    const browsers = [];

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
}

module.exports = firstHundredDescendingAgeOrder;
