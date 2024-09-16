path = require('path');
logger = require(path.resolve(__dirname, 'logger.js'));

function netPerf(start, end, thershold) {
  const result = end - start;
  
  let metrics = [start, end, result];
  
  if(metrics >= thershold) {
    logger.warn(`network surpassed the ${thershold}ms thershold: ${result}`);
  } else {
    logger.info(`network roundtrip: ${result}`);
  }
  return metrics;
}

module.exports = netPerf;
