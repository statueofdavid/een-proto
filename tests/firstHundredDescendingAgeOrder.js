const { chromium } = require("playwright");

const timeout = 1000;

async function firstHundredDescendingAgeOrder(config) {
  console.log(config);
	
  // launch browser
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

  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const titlelineSelector = 'span[class="titleline"]';
  const ageSelector = 'span[class="age"]';
  const moreSelector = 'a[class="morelink"]';

  const more = await page.locator(moreSelector);
  
  let validationSample = [];
  const validationLength = 100;
  
  while (validationSample.length < validationLength) {
    const titles = await page.locator(titlelineSelector).allInnerTexts();
    const ageElements = await page.locator(ageSelector).all();
    const times = await Promise.all(ageElements.map(element => element.getAttribute('title')));
    
    const data = titles.map((title, index) => ({
      title, 
      time: times[index],
      isValid: true
    }));

    for(let i = 0; i < data.length; i++) {
     // console.log(`currently the sample is: ${validationSample} @ ${validationSample.length}`);

     // console.log(`iterator #: ${i}`);
      if(validationSample.length > 0) {
        previousTime = new Date(validationSample[validationSample.length - 1].time);

        const currentTime = new Date(data[i].time);
        // console.log(`comparing ${previousTime} to ${currentTime}`);
        data[i].isValid = currentTime <= previousTime;	
        validationSample.push(data[i]);
      } else { 
        // console.log('nothing to validate, first item..');
        validationSample.push(data[i]);
      };
    }


    if((await more.isVisible()) && (validationSample.length < validationLength)) {
      await more.click();
      await page.waitForTimeout(timeout);
    } else {
      console.log("prepping the validation sample...");
      break;
    }
  }

  console.log(validationSample);

  // Close browser and its context
  await context.close();
  await browser.close();
  
  return validationSample;
}

module.exports = firstHundredDescendingAgeOrder;
