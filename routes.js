const express = require('express');
const test = require('./tests/firstHundredDescendingAgeOrder');
const devices = require('./utils/availableDevices');
const logger = require('./utils/logger');

const router = express.Router();
const knownDevices = devices();

router.post('/tests', async (req, res) => {
  try {
    const config = req.body;
    const results = await test(config);
    console.log(results); 
    res.render('dashboard', { results, knownDevices });
  } catch (err) {
    if(err instanceof SyntaxError) {
      console.error(err);
      logger.error(err);
      res.status(400).send(`${err.status} -> Bad Client`);
    } else {
      console.error(`rca maybe needed`);
      logger.error(err);
      res.status(500).send(`${err.status} -> Bad Server`);
    }
  }
});

router.get('/dashboard', async (req, res) =>  {
  const results = req.session.results || [];
  res.render('dashboard', { results, knownDevices });
});

module.exports = router;

