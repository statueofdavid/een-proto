let inserted = false;

const dbName = "DashboardData";

const run = document.getElementById("run");
run.addEventListener("click", getTestResults);

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

function getTestResults() {
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
      document.getElementById("firstHundredDescendingAgeOrder"): document.getElementById("firstHundredDescendingAgeOrder").checked
    }
  };
  
  if(Object.values(config.testOptions).every(option => !!option)) {
    if(inserted) {
      warningMsg.remove();
      inserted = false;
    }
    
    const configJSON = JSON.stringify(config);
    //console.log(config);
    //console.log(configJSON);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: configJSON
    };

    //console.log(options);

    fetch('/tests', options)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newBody = doc.querySelector('html');

      document.querySelector('html').innerHTML = newBody.innerHTML;
      document.getElementById('run').addEventListener("click", getTestResults );
      document.querySelector('.accordion').addEventListener('click', showDetails);

      updatePiechart();
    })
    .catch(error => {
      console.error('Error running tests:', error);
    });
  } else {
    if(!inserted) {
      parentElement.insertBefore(warningMsg, testTitle);
      inserted = true;
    }
  }
}
