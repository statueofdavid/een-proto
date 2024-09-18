const constants = require('./utils/constants');
const cors = require('cors');

const ejs = require('ejs');
const helmet = require('helmet');

const http = require('http');
const process = require('process');

const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const path = require('path');
const routes = require('./routes');

const websocketServer = require('./utils/websocket');

const app = express();
const server = http.createServer(app);

app.use(helmet());   
app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({ 
    extended: constants.compute.express.URLENCODED_EXTENDED
}));

app.use(session({
  secret: constants.compute.express.session.SECRET,
  resave: constants.compute.express.session.RESAVE,
  saveUninitialized: constants.compute.express.session.SAVE_UNINITIALIZED,
  cookie: {
    secure: constants.compute.express.session.cookie.SECURE,
    httpOnly: constants.compute.express.session.cookie.HTTP_ONLY,
    maxAge: constants.compute.express.session.cookie.MAX_AGE
  }
}));

const port = constants.net.HTTP_PORT;
const socket = constants.net.SOCKET_PORT;

app.set('view engine', constants.compute.express.VIEW_ENGINE);
app.set('views', path.join(__dirname, constants.compute.express.VIEWS_DIR));

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
  switch (err.status) {
    case 400: 
      logger.error(err);
      res.status(400).render('error', {
        statusCode: err.status,
        message: 'Bad Request'
      });
      break;
    case 401: 
      logger.error(err);
      res.status(401).render('error', { 
        statusCode: err.status,
        message: 'Unauthorized'
      });
      break;
    case 403: 
      logger.error(err);
      res.status(403).render('error', {
	statusCode: err.status,
	message: 'Forbidden' 
      });
      break;
    case 404: 
      logger.error(err);
      res.status(404).render('error', { 
	statusCode: err.status,
	message: 'Resource Not Found'
      });
      break;
    case 409: 
      logger.error(err);
      res.status(409).render('error', {
	statusCode: err.status,
	message: 'Conflict'
      });
      break;
    case 500: 
      logger.error(err);
      res.status(500).render('error', {
        statusCode: err.status,
	message: 'Internal Server Error'
      });
      break;
    default:
      logger.error(err);
      res.status(500).render('error', {
	statusCode: err.status,
	message: 'Unknown Error'
      });
  }
});

const memoryThreshold = constants.compute.MEM_THRESH;;
const cpuThreshold = constants.compute.CPU_THRESH;

setInterval(() => {
  const memory = process.memoryUsage().heapUsed;
  const cpu = process.cpuUsage().system / process.cpuUsage().user;

  if (memory >= memoryThreshold) {
    logger.warn(`Memory usage exceeded threshold: ${memory}`);
  }

  if (cpu >= cpuThreshold) {
    logger.error(`CPU usage exceeded threshold: ${cpu}%`);
  }
}, 1000);

process.on('uncaughtException', (err) => {
  logger.error(err);
  process.exit(1);
});

server.listen(socket, () => {
  logger.info(`${JSON.stringify(server)}, ${socket}`);
});

app.listen(port, () => {
  logger.info(`${JSON.stringify(app)}, ${port}`);
  console.log(`go to http://localhost:${port}/dashboard for visualization of results`);
});
