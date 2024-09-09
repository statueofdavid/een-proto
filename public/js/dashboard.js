const pageSize = 10;

let inserted = false;
let currentPage = 0;
let totalPages = Math.ceil(results.length / pageSize);

document.getElementById('prevButton').addEventListener('click', () => {
  currentPage--;
  updatePagination();
});

document.getElementById('nextButton').addEventListener('click', () => {
  currentPage++;
  updatePagination();
});

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
    panels.style.height = '100vh';
    document.querySelector('.panel').style.display = 'block';
  }
}

function updatePagination() {
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  if (currentPage === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (currentPage === totalPages - 1) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
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
