const WebSocket = require('ws');

const port = process.env.WS_PORT || 8090;
console.log(`Starting ws server on port ${port}`);
const wss = new WebSocket.Server({
  port
});

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, (error) => {
        if (error) {
          console.error('[ERROR] Error sending message to client', error);
        }
      });
    }
  });
};

wss.on('connection', function connection(ws, req) {
  console.log(`[DEBUG]: Client connected: ${req.connection.remoteAddress}`);
});

module.exports = {
  server: wss,
  send(message) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    wss.broadcast(message);
  },
  isClientOpen(ws) {
    return ws && ws.readyState == WebSocket.OPEN
  },
};