const express = require('express');
const router = express.Router();

console.log(`express router module loaded :: ${router}`);

router.get('/dashboard', async (req, res) =>  {
  console.log('dashboard served');
  res.render('dashboard');
});

module.exports = router;

