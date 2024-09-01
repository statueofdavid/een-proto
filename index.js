const ejs = require('ejs');
const express = require('express');
const logger = require('./utils/logger');
const path = require('path');
const routes = require('./routes');

if (!logger || !routes) {
  console.error('Error: Required modules not found.');
  process.exit(1);
}

const app = express();
const port = 42000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
app.use('/', routes);
app.use((err, req, res, next) => {
  logger.error(err);
  
  switch (err.status) {
    case 400: 
      res.status(400).render('error', {
        statusCode: err.status,
        message: 'Bad Request'
      });
      break;
    case 401: 
      res.status(401).render('error', { 
        statusCode: err.status,
        message: 'Unauthorized'
      });
      break;
    case 403: 
      res.status(403).render('error', {
	statusCode: err.status,
	message: 'Forbidden' 
      });
      break;
    case 404: 
      res.status(404).render('error', { 
	statusCode: err.status,
	message: 'Resource Not Found'
      });
      break;
    case 409: 
      res.status(409).render('error', {
	statusCode: err.status,
	message: 'Conflict'
      });
      break;
    case 500: 
      res.status(500).render('error', {
        statusCode: err.status,
	message: 'Internal Server Error'
      });
      break;
    default:
      res.status(500).render('error', {
	statusCode: err.status,
	message: 'Unknown Error'
      });
  }
});

app.listen(port, () => {
  console.log(`go to http://localhost:${port}/dashboard for visualization of results`);
});

