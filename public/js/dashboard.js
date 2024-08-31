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
  var browserOptions = [];
  
  var isHeadless = document.getElementById("headless");
  
  var timeout = document.getElementById("timeout");
  var sampleSize = document.getElementById("sampleSize");
  
  var chromium = document.getElementById("chromium");
  var edge = document.getElementById("edge");
  var firefox = document.getElementById("firefox");
  var mobileChrome = document.getElementById("mobileChrome");
  var mobileWebkit = document.getElementById("mobileWebkit");
  var webkit = document.getElementById("webkit");
}
