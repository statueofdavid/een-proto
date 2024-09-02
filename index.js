const ejs = require('ejs');

const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const helmet = require('helmet');
const cors = require('cors');

const logger = require('./utils/logger');
const path = require('path');
const routes = require('./routes');

if (!logger || !routes) {
  console.error('Error: Required modules not found.');
  process.exit(1);
}

const app = express();

app.use(helmet());   
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-strong-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, // Use HTTPS only
    httpOnly: true,
    maxAge: 600000 // 10 minutes
  }
}));

const port = 42000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes);

app.use(express.static(__dirname + '/public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.ejs')) {
      res.set('Content-Type', 'text/html');
    }
  }
}));

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

