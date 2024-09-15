const getBrowsers = require('./../utils/orchestrator.js');
const logger = require('./../utils/logger.js');

const random = Math.random() * userAgents.length;
const targetLength = 100;

const timeout = 5000;
const userAgent = userAgents[random.toFixed()];

const ageSelector = 'span[class="age"]';
const moreSelector = 'a[class="morelink"]';
const titlelineSelector = 'span[class="titleline"]';

const { chromium, 
	webkit, 
	firefox,
	devices
       } = require("playwright");

const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"];

let runData = [];

async function environmentManager(config) {
  let browsers = await getBrowsers(config);
  logger.info(browsers);
    
  for (const browser of browsers) {
    const context = await browser.newContext({
      userAgent: userAgent,
    });
    logger.info(JSON.stringify(context));

    try {
      const testsToDo = config.testOptions.filter(item => item.checked).length;
      if(testsToDo > 0) {
	console.log("Don't forget me, you need to grab this data and give the dashboard access.");
      }

      runData.push(
        await firstHundredDescendingAgeOrder(context);
      );
    } catch (error) {
      logger.error(error);
    } finally {
      await context.close();
      await browser.close();
      browsers = [];
    }
  }
  return runData;
}
async function firstHundredDescendingAgeOrder(context) {
      const page = await context.newPage();

      await page.goto("https://news.ycombinator.com", { waitUntil: "domcontentloaded" });
      // await page.pause();

      const validatedSample = await validate(page);
	
      const passedEntries = validatedSample.filter(item => item.isValid).length;
      const failedEntries = validatedSample.length - passedEntries;

      logger.info(JSON.stringify(validatedSample));
      logger.info(`Entries: ${validatedSample.length}, Passed: ${passedEntries}, Failed: ${failedEntries}`); 
    
  return validatedSample;
}

//takes in page context, scrapes all UI elements, and validates order
async function validate(page) {
  const sample = [];
  while (sample.length < targetLength) {
    const [titles, ageElements] = await Promise.all([
      page.locator(titlelineSelector).allInnerTexts(),
      page.locator(ageSelector).all(),
    ]);

    const times = await Promise.all(
      ageElements.map((element) => element.getAttribute("title"))
    );

    const newData = titles.map((title, index) => ({
      entry: sample.length + index + 1,
      title,
      time: times[index],
      isValid: sample.length > 0
        ? new Date(times[index]) <= new Date(sample[sample.length - 1].time)
        : true,
    }));

    sample.push(...newData.slice(0, targetLength - sample.length));
    if (sample.length >= targetLength) break;

    if (await page.locator(moreSelector).isVisible()) {
      await page.locator(moreSelector).click();
      await page.waitForTimeout(timeout);
    } else {
      console.log("Reached end of page.");
      break;
    }
  }

  return sample;
}

module.exports = environmentManager;
