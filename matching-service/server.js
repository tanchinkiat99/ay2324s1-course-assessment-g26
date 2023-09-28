// to start server, run: npm run dev
// to start RabbitMQ, run: docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
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

// Maintain a map of user ID to socket
const clientToSocketId = {};

io.on('connection', (socket) => {
  socket.on('test_connection', (data) => {
    console.log(data.message, `Socket ID: ${socket.id}`);
    socket.emit('test_connection_success', {
      message: 'Connection successful',
      success: true,
    });
  });

  socket.on('find_match', (data) => {
    clientToSocketId[data.user_id] = socket.id;
    console.log(
      data.message,
      `Socket ID: ${socket.id}`,
      `User ID: ${data.user_id}`
    );
    addToMatchQueue(data.user_id);

    // setInterval(async () => {
    //   try {
    //     const connection = await amqp.connect(RABBITMQ_URL);
    //     const channel = await connection.createChannel();

    //     await channel.assertQueue('notificationsQueue', { durable: false });

    //     channel.consume('notificationsQueue', (msg) => {
    //       const msgObj = JSON.parse(msg.content.toString());
    //       if (msgObj.user_id === data.user_id) {
    //         socket.emit('found_match', {
    //           room_id: msgObj.room_id,
    //         });
    //         channel.ack(msg);
    //       }
    //     });
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }, 5000);
  });
});

async function addToMatchQueue(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue('matchQueue', { durable: false });

    // Add the current user ID to the queue
    channel.sendToQueue('matchQueue', Buffer.from(message));
  } catch (error) {
    console.error('Error:', error);
  }
}

async function matchUsersInQueue() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue('matchQueue', { durable: false });
    // Get the current number of user IDs in the queue
    const messageCount = (await channel.checkQueue('matchQueue')).messageCount;

    // If there are more than 2 users in queue, match 2 users together
    if (messageCount >= 2) {
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
      await channel.assertQueue('notificationsQueue', { durable: false });
      const newRoomId = user1Id + user2Id;
      const newNotification1 = {
        user_id: user1Id,
        room_id: newRoomId,
      };
      const newNotification2 = {
        user_id: user2Id,
        room_id: newRoomId,
      };
      channel.sendToQueue(
        'notificationsQueue',
        Buffer.from(JSON.stringify(newNotification1))
      );
      channel.sendToQueue(
        'notificationsQueue',
        Buffer.from(JSON.stringify(newNotification2))
      );
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}

// setInterval(async () => {
//   matchUsersInQueue();
// }, 5000);

server.listen(MATCHING_SERVER_PORT, () => {
  console.log(`Matching server listening on port ${MATCHING_SERVER_PORT}`);
});
