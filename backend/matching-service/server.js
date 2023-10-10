// to start RabbitMQ (need to install docker first), run: docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
// to start server, cd to matching-service directory and run: npm run dev
// to view RabbitMQ Management UI, go to: http://localhost:15672/ (username and password are both 'guest')

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
const server = http.createServer(app);

// env variables
const MATCHING_SERVER_PORT = process.env.MATCHING_SERVER_PORT || 5001;
const RABBITMQ_URL = `${process.env.RABBITMQ_URL}:${process.env.RABBITMQ_PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const io = socketIO(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// queue names
const NOTIFICATION_QUEUE = 'notificationQueue';
const EASY_MATCH_QUEUE = 'easyMatchQueue';
const MEDIUM_MATCH_QUEUE = 'mediumMatchQueue';
const HARD_MATCH_QUEUE = 'hardMatchQueue';
const DIFFICULTY_TO_QUEUE = {
  easy: EASY_MATCH_QUEUE,
  medium: MEDIUM_MATCH_QUEUE,
  hard: HARD_MATCH_QUEUE,
};

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
    await channel.assertQueue(EASY_MATCH_QUEUE, {
      durable: false,
      arguments: { 'x-message-ttl': 30000 },
    });
    await channel.assertQueue(MEDIUM_MATCH_QUEUE, {
      durable: false,
      arguments: { 'x-message-ttl': 30000 },
    });
    await channel.assertQueue(HARD_MATCH_QUEUE, {
      durable: false,
      arguments: { 'x-message-ttl': 30000 },
    });
    await channel.assertQueue(NOTIFICATION_QUEUE, {
      durable: false,
      arguments: { 'x-message-ttl': 30000 },
    });
  } catch (error) {
    console.log(error);
  }
}

io.on('connection', (socket) => {
  // When user requests to find a match
  socket.on('find_match', (data) => {
    console.log(
      'Request to find match:\n',
      `Socket ID: ${socket.id}\n`,
      `User ID: ${data.user_id}`
    );

    // Keep track of matched status
    let isMatched = false;

    // Add user to match queue
    addToMatchQueue(data.user_id, data.difficulty);

    // Emit a response event to notify user that matching is in progress
    socket.emit('finding_match', {
      message: `Connected to matching service at port ${MATCHING_SERVER_PORT}`,
    });

    // Check for a successful match in the notifications queue
    const consumer = channel.consume(NOTIFICATION_QUEUE, (msg) => {
      const msgObj = JSON.parse(msg.content.toString());
      console.log(data.user_id, msgObj);

      // If notification for that user is found
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

        // Update matched status
        isMatched = true;
      }

      // Set timeout for 30 seconds to disconnect user if not matched
      setTimeout(() => {
        cancelConsumer(consumer);
        isMatched || socket.disconnect();
      }, 30000);
    });

    // For user to send message in to room (for testing)
    socket.on('send_message', (data) => {
      if (data.room_id && data.room_id.length > 0) {
        io.to(data.room_id).emit('receive_message', {
          user_id: data.user_id,
          message: data.message,
        });
      }
    });
  });

  socket.on('disconnect', () => {
    socket.disconnect();
  });
});

// Adds user (user id) to matching queue
async function addToMatchQueue(message, difficulty) {
  try {
    const queue = DIFFICULTY_TO_QUEUE[difficulty];
    // Add the current user ID to the queue
    channel.sendToQueue(queue, Buffer.from(message));
  } catch (error) {
    console.error('Error:', error);
  }
}

// Matches first 2 users in queue if queue length >= 2
async function matchUsersInQueue(difficulty) {
  try {
    // Get queue based on difficulty
    const queue = DIFFICULTY_TO_QUEUE[difficulty];

    // Get the current number of user IDs in the queue
    const matchQueueStats = await channel.checkQueue(queue);

    // If there are more than 2 users in queue, match 2 users together
    if (matchQueueStats.messageCount >= 2) {
      console.log('Matching users');
      // Get first user
      const user1 = await channel.get(queue);
      if (user1 !== null) {
        channel.ack(user1);
      }
      const user1Id = user1.content.toString();

      // Get second user
      const user2 = await channel.get(queue);
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
        difficulty: difficulty,
      };
      const newNotification2 = {
        user_id: user2Id,
        other_user_id: user1Id,
        room_id: newRoomId,
        difficulty: difficulty,
      };

      // Send one notification for each user to the notifications queue
      channel.sendToQueue(
        NOTIFICATION_QUEUE,
        Buffer.from(JSON.stringify(newNotification1))
      );
      channel.sendToQueue(
        NOTIFICATION_QUEUE,
        Buffer.from(JSON.stringify(newNotification2))
      );
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}

// Unsubscribe consumer from notifications queue
async function cancelConsumer(consumer) {
  const consumerObj = await consumer;
  channel.cancel(consumerObj.consumerTag);
}

// Check for valid matches every 5 seconds
setInterval(async () => {
  matchUsersInQueue('easy');
  matchUsersInQueue('medium');
  matchUsersInQueue('hard');
}, 5000);

server.listen(MATCHING_SERVER_PORT, () => {
  console.log(`Matching server listening on port ${MATCHING_SERVER_PORT}`);
});
