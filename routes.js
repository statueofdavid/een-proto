const express = require('express');
const test = require('./tests/firstHundredDescendingAgeOrder');
const devices = require('./utils/availableDevices');

const logger = require('./utils/logger');
const netPerformanceMetrics = require('./utils/netPerf');
const webSocketServer = require('./utils/websocket')

const {
  net,
  net: {
    routes: { dashboard },
    routes: { uitests }
  }
} = require('./utils/constants');

const router = express.Router();
const knownDevices = devices();

let data = [];

router.get('/dashboard', async (req, res) =>  {
  const thershold = dashboard.NET_PERF_THRESH;
  const start = performance.now();
  const results = req.session.results || [];
  
  logger.info('rendering dashboard')
  res.render('dashboard', { results, knownDevices });

  const end = performance.now();
  netPerformanceMetrics(start, end, thershold);
});

router.post('/tests', async (req, res) => {
  try {
    const thershold = uitests.NET_PERF_THRESH;
    const start = performance.now();

    logger.info(`request to run tests ${start}`);
    const config = req.body;
    const results = await test(config);

    const dataLink = `http://${net.HOST}:${net.HTTP_PORT}/data`;

    data = results;

    const end = performance.now();
    res.status(202).header('Link', `${dataLink}`).send('accepted');
    logger.info('202 response sent to requestor');

    netPerformanceMetrics(start, end, thershold);

  } catch (err) {
    if(err instanceof SyntaxError) {
      logger.error(err);
    } else {
      logger.error(err);
    }
  }
});

router.get('/data', async (req, res) => {
  const thershold = dashboard.NET_PERF_THRESH;
  const start = performance.now();
  
  logger.info('incoming request');
  res.json(data);
  
  const end = performance.now();
  netPerformanceMetrics(start, end, thershold);
});

module.exports = router;

