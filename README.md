### A simple dashboard for playwright results using node/express/ejs
#### just learning

#### Dependencies
//TODO

#### Installation
1. install node and npm
2. clone this repo
3. run: ```npm install```
4. run: ```node index```
5. follow the instructions in runtime console

#### proposed object
{
  “overview” : {
    “test” : testName,
    “environment” : environmentName,
    “start” : startTime,
    “time” : executionTime,
    “passed” : numPassed,
    “failed” : numFailed,
    “skipped” : numSkipped,
    “details” :  [
    {
      entry: 1,
      title: titleName,
      time: dateTime,
      isValid: true
    },
    {
      entry: 2,
      title: titleName,
      time: dateTime,
      isValid: true
    },
  
.
.
.
    {
      entry: 100,
      title: titleName,
      time: dateTime,
      isValid: true
    },
.
.
.
    “overview” : {
    “test” : testName,
    “environment” : environmentName,
    “start” : startTime,
    “time” : executionTime,
    “passed” : numPassed,
    “failed” : numFailed,
    “skipped” : numSkipped,
    “details” :  [
    {
      entry: 1,
      title: titleName,
      time: dateTime,
      isValid: true
    },
    {
      entry: 2,
      title: titleName,
      time: dateTime,
      isValid: true
    },
  
.
.
.
    {
      entry: 100,
      title: titleName,
      time: dateTime,
      isValid: true
    }
  ]
}
