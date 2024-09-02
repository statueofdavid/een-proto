const express = require('express');
const router = express.Router();
const test = require('./tests/firstHundredDescendingAgeOrder');

router.post('/tests', (req, res) => {
  const config = JSON.parse(req.body);
  console.log('I made it.');

  firstHundredDescendingAgeOrder(config)
    .then(result => {
      req.session.results = result;
      res.redirect('/dashboard');
    })
    .catch(error => {
      console.error('Error running tests:', error);
      res.status(500).send('Internal server error');
    });
});

router.get('/dashboard', async (req, res) =>  {
  const results = req.session.results || [];
  res.render('dashboard', { results });
});

module.exports = router;

