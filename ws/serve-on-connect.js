const wss = require('../ws/server');
const messages = require('./responses');

const customInterval = process.argv[1] && +process.argv[1];
const interval = customInterval || 2000;

wss.server.on('connection', function connection(ws, req) {
  console.log(`[DEBUG]: Client connected: ${req.connection.remoteAddress}`);
  let queue = [...messages];
  const sendMessage = () => {
    if (!wss.isClientOpen(ws)) {
      return;
    }
    let message = queue.shift();
    console.log(`Sending message, remaining ${queue.length}`);
    ws.send(JSON.stringify(message));

    if (queue.length > 0) {
      setTimeout(sendMessage, interval);
    } else {
      console.log('No more messages to send');
    }
  };
  sendMessage();
});