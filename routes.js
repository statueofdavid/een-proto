const express = require('express');
const router = express.Router();

console.log(`express router module loaded :: ${router}`);

router.get('/dashboard', async (req, res) =>  {
  res.render('dashboard');
});

router.get('*', async (req, res) => {
  res.render('fourzerofour');
});

module.exports = router;

