const express = require('express');
const router = express.Router();
const test = require('./tests/firstHundredDescendingAgeOrder');

//console.log(test);

router.post('/tests', (req, res) => {
  //console.log(req.body);
  try {
    const config = req.body;
    //console.log(config);
    (async () => {
      try {	    
        const result = await test(config);
	console.log(result);
        req.session.results = result;
        res.redirect('/dashboard');
      } catch(error) {
        console.error('Error running tests:', error);
      }
    })();
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

