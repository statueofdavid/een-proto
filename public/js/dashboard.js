let inserted = false;

const run = document.getElementById("run");
run.addEventListener("click", getTestResults);

const accordion = document.querySelector(".accordion");
accordion.addEventListener("click", showDetails);

function showDetails() {
  console.log('clicked');
  const panels = document.querySelector('.panels');
  panels.style.display = panels.style.display === 'block' ? 'none' : 'block';
  if (panels.style.display === 'block') {
    console.log('more to come');
    panels.style.height = '30vh';
    document.querySelector('.panel').style.display = 'block';
  }
}

function updatePiechart() {
  const chartElement = document.querySelector(".piechart");

  fetch('/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log(chartElement);
      
      const passedEntries = data.filter(item => item.isValid).length;
      const failedEntries = data.length - passedEntries;
      const skippedEntries = 100 - data.length;

      const passedPercent = passedEntries / 100;
      const failedPercent = failedEntries / 100;
      const skippedPercent = skippedEntries / 100;

      const passedSection = passedPercent * 360;
      const failedSection = failedPercent * 360;
      const skippedSection = skippedPercent * 360;

      const newGradient = `conic-gradient(
        red ${failedSection}deg,
	yellow ${skippedSection}deg,
	green ${passedSection}deg
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
      FirstHundredDescendingAgeOrder: document.getElementById("firstHundredDescendingAgeOrder").checked
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
