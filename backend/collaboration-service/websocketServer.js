const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', setupWSConnection);

module.exports = wss;