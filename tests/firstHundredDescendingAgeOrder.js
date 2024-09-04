const { chromium } = require("playwright");
const logger = require('./../utils/logger.js');

const timeout = 1000;

async function firstHundredDescendingAgeOrder(config) {
  console.log(config);


  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"];
 
  const random = Math.random() * userAgents.length;
  //console.log(random);
  const userAgent = userAgents[random.toFixed()];
  //console.log(userAgent);

  try {
    const browser = await chromium.launch({
      args: ['--disable-blink-features=AutomationControlled'],    
      headless: false,
      logger: {
        isEnabled: (_, severity) => true,
        log: (name, severity, message, args) => {
	  const now = new Date();
          console.log(`[${now.toISOString()}] ${severity} :: ${name} ${message}`);
        }
      }
    });
    logger.info(browser);

    const context = await browser.newContext({
      userAgent: userAgent,
    });
    logger.info(context);
    
    const page = await context.newPage();

    await page.goto("https://news.ycombinator.com/latest", { waitUntil: "domcontentloaded" });
    // await page.pause();

    const titlelineSelector = 'span[class="titleline"]';
    const ageSelector = 'span[class="age"]';
    const moreSelector = 'a[class="morelink"]';

    const validationSample = [];
    const targetLength = 100;

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

    logger.info(validationSample);
    logger.info(`${validationSample.length}, ${passedEntries}, ${failedEntries}`); 

    console.log("Total entries:", validationSample.length);
    console.log("Passed:", passedEntries);
    console.log("Failed:", failedEntries);
  
  } finally {
    await context.close();
    await browser.close();
  }

  return validationSample;
}

module.exports = firstHundredDescendingAgeOrder;
