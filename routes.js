const express = require('express');
const router = express.Router();
const test = require('./tests/firstHundredDescendingAgeOrder');

//console.log(test);

router.post('/tests', async (req, res) => {
  //console.log(req.body);
  try {
    const config = req.body;
    //console.log(config);
    const result = await test(config);
    console.log(result); 
    res.render('/dashboard', { results: result });
  } catch (error) {
    if(error instanceof SyntaxError) {
      console.error(error);
      res.status(400).send(`${err.status} -> Bad Client`);
    } else {
      console.error(`rca maybe needed`);
      res.status(500).send(`${err.status} -> Bad Server`);
    }
  }
});

router.get('/dashboard', async (req, res) =>  {
  const results = req.session.results || [];
  res.render('dashboard', { results });
});

module.exports = router;

