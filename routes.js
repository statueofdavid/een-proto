const express = require('express');
const router = express.Router();

console.log(`express router module loaded :: ${router}`);

router.get('/dashboard', async (req, res) =>  {
  console.log('rendering dashboard');
  res.render('dashboard');
});

router.get('*', async (req, res) => {
  console.log('page does not exist');
  res.render('fourzerofour');
});

module.exports = router;

