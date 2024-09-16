const express = require('express');
const test = require('./tests/firstHundredDescendingAgeOrder');
const devices = require('./utils/availableDevices');
const logger = require('./utils/logger');

const router = express.Router();
const knownDevices = devices();

let data = [];

router.post('/tests', async (req, res) => {
  try {
    const config = req.body;
    const results = await test(config);

    const dataLink = 'http://localhost:42000/data';

    data = results;
    res.status(202).header('Link', `<${dataLink}>; rel="results"`).send('request accepted');
  } catch (err) {
    if(err instanceof SyntaxError) {
      logger.error(err);
    } else {
      logger.error(err);
    }
  }
});

router.get('/dashboard', async (req, res) =>  {
  const results = req.session.results || [];
  res.render('dashboard', { results, knownDevices });
});

router.get('/data', async (req, res) => {
  res.json(data);
});

module.exports = router;

