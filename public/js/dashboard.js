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

var run = document.getElementById("run");
run.onclick = function() {
  const testTitle = document.getElementById("trtitle");
  const warningMsg = document.createElement("warningmsg");
  const info = document.createTextNode('nothing to run, please check at least a test');

  warningMsg.appendChild(info);
  
  const config = {
    browserOptions: {
      headless: document.getElementById("headless").checked,
      google: document.getElementById("chromium").checked,
      apple: document.getElementById("webkit").checked,
      mozilla: document.getElementById("firefox").checked,
      microsoft: document.getElementById("edge").checked,
      android: document.getElementById("mobileChrome").checked,
      ios: document.getElementById("mobileWebkit").checked
    },
    testOptions: {
      FirstHundredDescendingAgeOrder: document.getElementById("firstHundredDescendingAgeOrder").checked
    }
  };
  
  if(Object.values(config.testOptions).every(option => !!option)) {
    warningMsg.remove();
    
    const configJSON = JSON.stringify(config);

    fetch('/tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: configJSON
    })
    .then(response => {
      if(response.ok) {
        response.json();
      } else {
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
      }
    })
    .then(data => {
      res.render('dashboard', { info: data });
    })
    .catch(error => {
      console.error('Error running tests:', error);
    });
  } else {
    document.body.insertBefore(newDiv, testTitle);
  }
}
