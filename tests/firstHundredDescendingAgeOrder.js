const getBrowsers = require('./../utils/orchestrator.js');
const logger = require('./../utils/logger.js');

const targetLength = 100;
const timeout = 5000;

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

const random = Math.random() * userAgents.length;
const userAgent = userAgents[random.toFixed()];

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
       runData = await firstHundredDescendingAgeOrder(context);
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

  for await (const validatedSample of validate(page)) {
    logger.info(JSON.stringify(validatedSample));
    return validatedSample;
  };
}

//takes in page context, scrapes all UI elements, and validates order
async function* validate(page) {
  const sample = [];
  while (sample.length < targetLength) {
    const titles = await page.locator(titlelineSelector).allInnerTexts()
    const ageElements = await page.locator(ageSelector).all();

    for await (const element of ageElements) {
      const title = titles.shift();
      const time = await element.getAttribute("title");

      const newData = {
        entry: sample.length + 1,
        title,
        time,
        isValid: sample.length > 0
          ? new Date(time) <= new Date(sample[sample.length - 1].time)
          : true,
      };
      console.log(`what is this: ${newData}`);

      sample.push(newData);
      if (sample.length >= targetLength) break;
    }

    if (await page.locator(moreSelector).isVisible()) {
      await page.locator(moreSelector).click();
      await page.waitForTimeout(timeout);
    } else {
      logger.log("Reached end of page.");
      break;
    }
  }

  yield sample;
}

module.exports = environmentManager;
