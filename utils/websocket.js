import webSocket = require('ws');
const path = require('path');
const logger = require(path.resolve(__dirname, 'logger.js'));

const wss = new webSocket.Server({
  port: 424200,
  backlog: 100,
  pingInverval: 5000,
  pongInverval: 10000,
  extensions: [{
    name: 'permessage-deflate',
    params: {
      serverMaxWindowBits: 15,
      clientMaxWindowsBits: 15
    }
  }]
});

wss.on('connection', (ws, req) => {
  logger.info('Client connected:', req.socket.remoteAddress);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      logger.info('Received message:', data);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      logger.error('Error parsing message:', error);
      ws.send('Invalid message format');
    }
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
});

module.exports = wss;
