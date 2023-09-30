// to start RabbitMQ, run: docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
// to start server, cd to matching-service directory and run: npm run dev
// to view RabbitMQ Management UI, go to: http://localhost:15672/ (username and password are both 'guest')

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const MATCHING_SERVER_PORT = process.env.MATCHING_SERVER_PORT || 5000;
const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672/';

app.get('/hello', (req, res) => {
  res.json({ message: 'hello' });
});

// rabbitmq to be global variables
let channel, connection;

connect();
// Connect to rabbitmq
async function connect() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Creates queues for matches and notifications
    await channel.assertQueue('matchQueue', { durable: false });
    await channel.assertQueue('notificationQueue', { durable: false });
  } catch (error) {
    console.log(error);
  }
}

// Maintain a map of user ID to socket
const clientToSocketId = {};

io.on('connection', (socket) => {
  socket.on('find_match', (data) => {
    // Store socket id of each user
    clientToSocketId[data.user_id] = socket.id;
    console.log(
      'Request to find match:\n',
      `Socket ID: ${socket.id}\n`,
      `User ID: ${data.user_id}`
    );

    // Keep track of matched status
    let isMatched = false;

    // Add user to match queue
    addToMatchQueue(data.user_id);

    // Emit a response event to notify user
    socket.emit('finding_match', {
      message: `Connected to matching service at port ${MATCHING_SERVER_PORT}`,
    });

    // Check for a successful match in the notifications queue
    channel.consume('notificationQueue', (msg) => {
      const msgObj = JSON.parse(msg.content.toString());
      if (msgObj.user_id === data.user_id) {
        console.log(`Adding user: ${data.user_id} to room: ${msgObj.room_id}`);

        // Ack message to delete notification from queue
        channel.ack(msg);

        // Notify user that user is joining
        socket.emit('match_found', {
          message: `Match found, user ${data.user_id} joining room ${msgObj.room_id}`,
          user_id: data.user_id,
          other_user_id: msgObj.other_user_id,
          room_id: msgObj.room_id,
        });

        // Join the new room
        socket.join(msgObj.room_id);

        // Notify the room that a user is joining
        socket.to(msgObj.room_id).emit('user_joined_room', {
          message: `User ${data.user_id} has joined room ${msgObj.room_id}`,
          user_id: data.user_id,
          room_id: msgObj.room_id,
        });
        isMatched = true;
      }
    });

    // Set timeout for 30 seconds to disconnect user
    setTimeout(() => {
      isMatched || socket.disconnect();
    }, 30000);
  });
});

// Adds user (user id) to matching queue
async function addToMatchQueue(message) {
  try {
    // Add the current user ID to the queue
    channel.sendToQueue('matchQueue', Buffer.from(message));
  } catch (error) {
    console.error('Error:', error);
  }
}

// Matches first 2 users in queue if queue length >= 2
async function matchUsersInQueue() {
  try {
    // Get the current number of user IDs in the queue
    const matchQueueStats = await channel.checkQueue('matchQueue');

    // If there are more than 2 users in queue, match 2 users together
    if (matchQueueStats.messageCount >= 2) {
      console.log('Matching users');
      // Get first user
      const user1 = await channel.get('matchQueue');
      if (user1 !== null) {
        channel.ack(user1);
      }
      const user1Id = user1.content.toString();

      // Get second user
      const user2 = await channel.get('matchQueue');
      if (user2 !== null) {
        channel.ack(user2);
      }
      const user2Id = user2.content.toString();

      // Create a socket room and add to notifications queue
      const newRoomId = user1Id + user2Id;
      const newNotification1 = {
        user_id: user1Id,
        other_user_id: user2Id,
        room_id: newRoomId,
      };
      const newNotification2 = {
        user_id: user2Id,
        other_user_id: user1Id,
        room_id: newRoomId,
      };
      // Send one notification for each user
      await channel.sendToQueue(
        'notificationQueue',
        Buffer.from(JSON.stringify(newNotification1))
      );
      await channel.sendToQueue(
        'notificationQueue',
        Buffer.from(JSON.stringify(newNotification2))
      );

      console.log(
        'Matched users:\n',
        'User 1: ',
        user1Id,
        '\nUser 2: ',
        user2Id
      );
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}

// Check for valid matches every 5 seconds
setInterval(async () => {
  matchUsersInQueue();
}, 5000);

server.listen(MATCHING_SERVER_PORT, () => {
  console.log(`Matching server listening on port ${MATCHING_SERVER_PORT}`);
});
