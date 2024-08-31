const ejs = require('ejs');
const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();
const port = 42000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
app.use('/', routes);

app.listen(port, () => {
  console.log(`go to http://localhost:${port}/dashboard for visualization of results`);
});

