### A simple dashboard for playwright results using node/express/ejs
#### just learning

#### Dependencies
//TODO

#### Installation
//TODO

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
