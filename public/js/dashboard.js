let inserted = false;

const run = document.getElementById("run");
run.addEventListener("click", getTestResults);

const accordion = document.querySelector(".accordion");
accordion.addEventListener("click", showDetails);

function showDetails() {
  console.log('clicked');
  const panel = document.querySelector('.panel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  if (panel.style.display === 'block') {
    console.log('more to come');
  }
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

      console.log('I am here');
      
	console.log('loaded, adding listeners');
        document.getElementById('run').addEventListener("click", getTestResults );
	console.log(run);
        document.querySelector('.accordion').addEventListener('click', showDetails);
	console.log(accordion);
      console.log('but now I am over here');
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
