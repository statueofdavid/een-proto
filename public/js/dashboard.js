let inserted = false;

const dbName = "DashboardData";

const run = document.getElementById("run");
run.addEventListener("click", requestTestRun);

const accordion = document.querySelector(".accordion");
accordion.addEventListener("click", showDetails);

function showDetails() {
  const panels = document.querySelector('.panels');
  panels.style.display = panels.style.display === 'block' ? 'none' : 'block';
  if (panels.style.display === 'block') {
    panels.style.height = '30vh';
    document.querySelector('.panel').style.display = 'block';
  }
}

function updatePiechart() {
  const chartElement = document.querySelector(".piechart");

  fetch('/data')
    .then(response => response.json())
    .then(data => {
      
      const passedEntries = data.filter(item => item.isValid).length;
      const failedEntries = data.length - passedEntries;
      const skippedEntries = 100 - data.length;

      const failedPercent = failedEntries / 100;
      const skippedPercent = skippedEntries / 100;

      let failedSection = failedPercent * 360;
      let skippedSection = skippedPercent * 360;
	    
      const newGradient = `conic-gradient(
        red ${failedSection}deg ${skippedPercent}deg,
        yellow ${failedSection}deg ${skippedSection}deg,
        green ${skippedSection}deg ${failedSection}deg
      )`;

      chartElement.style.backgroundImage = newGradient;
    })
    .catch(error => {
      console.error('Error updating the piechart:', error);
    });
}

function getConfigs() {
  const testTitle = document.getElementById("trtitle");
  const warningMsg = document.createElement("warningmsg");

  const info = document.createTextNode('nothing to run, please check at least a test');
  const parentElement = testTitle.parentNode;

  warningMsg.appendChild(info);

  const config = {
    browserOptions: {
      headless: document.getElementById("headless").checked,
      google: document.getElementById("chromium").checked,
      apple: document.getElementById("webkit").checked,
      mozilla: document.getElementById("firefox").checked,
    },
    testOptions: {
      "firstHundredDescendingAgeOrder": document.getElementById("firstHundredDescendingAgeOrder").checked,
    }
  };
  
  if(Object.values(config.testOptions).every(option => !!option)) {
    if(inserted) {
      warningMsg.remove();
      inserted = false;
    }
    const configJSON = JSON.stringify(config);
    
    return configJSON;
  } else {
    if(!inserted) {
      parentElement.insertBefore(warningMsg, testTitle);
      inserted = true;
    }
  }  
}

function requestTestRun() {
  const envConfig = getConfigs();  

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: envConfig
  };

  fetch('/tests', options)
  .then(res => {
    if(res.status === 202) {
      console.log(`request accepted`);
    } else {
      console.error(`request failed: ${res.status}`);
    }
  })
  .catch(error => {
    console.error(`Error running tests: ${error}`);
  });
}
