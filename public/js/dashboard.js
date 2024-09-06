var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

let inserted = false;

var run = document.getElementById("run");
run.onclick = function() {
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

      document.body.innerHTML = newBody.innerHTML;
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
