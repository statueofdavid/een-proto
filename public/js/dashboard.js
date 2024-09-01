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
  
  var envConfig = [
    document.getElementById("headless").checked,
    document.getElementById("chromium").checked,
    document.getElementById("webkit").checked,
    document.getElementById("headless").checked,
    document.getElementById("headless").checked,
    document.getElementById("mobileChrome").checked,
    document.getElementById("mobileWebkit").checked
  ];

  var tests = [
    document.getElementById("firstHundredDescendingAgeOrder").checked
  ];
  
  if(tests.filter((option) => !!option).length == 0) {
    console.log('nothing to do');  
  } else {
    console.log(`envConfig: ${envConfig} :: tests: ${tests}`); 
  }
}
