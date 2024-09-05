const { chromium, 
	webkit, 
	firefox,
	devices
       } = require("playwright");

const logger = require('./../utils/logger.js');

const timeout = 5000;

async function firstHundredDescendingAgeOrder(config) {
  console.log(config);


  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"];
 
  const random = Math.random() * userAgents.length;
  //console.log(random);
  const userAgent = userAgents[random.toFixed()];
  //console.log(userAgent);

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
    //console.log("browsers: + browsers");

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
    //console.log("browsers: " + browsers);
    
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
    //console.log("browsers: " + browsers);

    if(config.browserOptions.microsoft) {
      //TODO
    }
    //console.log("browsers: " + browsers);

    if(config.browserOptions.android) {
      //TODO
    }
    //console.log("browsers: " + browsers);
	
    if(config.browserOptions.ios) {
      //TODO
    }
    console.log("browsers: " + browsers);
    
    logger.info(JSON.stringify(browsers));

    const titlelineSelector = 'span[class="titleline"]';
    const ageSelector = 'span[class="age"]';
    const moreSelector = 'a[class="morelink"]';

    const validationSample = [];
    const targetLength = 100;
    
    for (const browser of browsers) {
      const context = await browser.newContext({
        userAgent: userAgent,
      });
      logger.info(JSON.stringify(context));
    
      const page = await context.newPage();

      await page.goto("https://news.ycombinator.com", { waitUntil: "domcontentloaded" });
      // await page.pause();

      while (validationSample.length < targetLength) {
        const [titles, ageElements] = await Promise.all([
          page.locator(titlelineSelector).allInnerTexts(),
          page.locator(ageSelector).all(),
        ]);

        const times = await Promise.all(
          ageElements.map((element) => element.getAttribute("title"))
        );

        const newData = titles.map((title, index) => ({
	  entry: validationSample.length + index + 1,
          title,
          time: times[index],
          isValid: validationSample.length > 0
            ? new Date(times[index]) <= new Date(validationSample[validationSample.length - 1].time)
            : true,
        }));

        validationSample.push(...newData.slice(0, targetLength - validationSample.length));
        if (validationSample.length >= targetLength) break;

        if (await page.locator(moreSelector).isVisible()) {
          await page.locator(moreSelector).click();
          await page.waitForTimeout(timeout);
        } else {
          console.log("Reached end of page.");
          break;
        }
      }
      const passedEntries = validationSample.filter(item => item.isValid).length;
      const failedEntries = validationSample.length - passedEntries;

      logger.info(JSON.stringify(validationSample));
      logger.info(`Entries: ${validationSample.length}, Passed: ${passedEntries}, Failed: ${failedEntries}`); 

      console.log("Total entries:", validationSample.length);
      console.log("Passed:", passedEntries);
      console.log("Failed:", failedEntries);
      
      await context.close();
      await browser.close();
    }
  
  } catch (error) {
    if (error instanceof playwright.errors.TimeoutError) {
      console.log('Timeout!');
    } else {
      console.log('dunno yet');
    }
  } finally {
    logger.info('did it work?');
  }

  return validationSample;
}

module.exports = firstHundredDescendingAgeOrder;
