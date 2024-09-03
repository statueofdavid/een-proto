const { chromium } = require("playwright");

const timeout = 1000;

async function firstHundredDescendingAgeOrder(config) {
  console.log(config);

  const browser = await chromium.launch({ 
    headless: false,
    logger: {
      isEnabled: (_, severity) => true,
      log: (name, severity, message, args) => {
	const now = new Date();
        console.log(`[${now.toISOString()}] ${severity} :: ${name} ${message}`);
      }
    }
  });

  try {
    const context = await browser.newContext();
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

    console.log(validationSample);
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
