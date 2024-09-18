const http = require('http');
const path = require('path');
const logger = require(path.resolve(__dirname, 'logger.js'));
const WebSocket = require('ws');

const server = http.createServer();

let numConnections = 0;
let messagesSent = 0;
let messagesReceived = 0;
let errors = 0;

  server.on('upgrade', (req, socket, head) => {
    const ws = new WebSocket(req, socket, head);
    logger.info('server upgraded: ', ws);


  ws.on('message', (message) => {
    try {
      logger.info('Received message');

    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send('Invalid message format');
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    clearInterval('1000');
  });
});

module.exports = server;
