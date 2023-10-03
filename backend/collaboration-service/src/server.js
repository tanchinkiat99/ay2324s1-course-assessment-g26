// set up both HTTP and websocket servers

const http = require('http');
const wss = require('./websocketServer');
const app = require('./app'); // Assuming you have an app.js

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});

const port = 3001;

server.listen(port, () => 
    console.log(`Server started on http://localhost:${port}/`)
);

