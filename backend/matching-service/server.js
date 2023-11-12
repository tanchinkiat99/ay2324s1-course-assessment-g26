// to start RabbitMQ (need to install docker first), run: docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
// to start server, cd to matching-service directory and run: npm run dev
// to view RabbitMQ Management UI, go to: http://localhost:15672/ (username and password are both 'guest')

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
// const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
const server = http.createServer(app);

// env variables
const MATCHING_SERVER_PORT = process.env.MATCHING_SERVER_PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL;
const QUESTION_SERVICE_ENDPOINT = `${QUESTION_SERVICE_URL}/questions`;
// const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_DOMAIN}`;

const io = socketIO(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// queue names
const NOTIFICATION_QUEUE = 'notificationQueue';
const EASY_JAVA_QUEUE = 'easyJavaQueue';
const MEDIUM_JAVA_QUEUE = 'mediumJavaQueue';
const HARD_JAVA_QUEUE = 'hardJavaQueue';
const EASY_PYTHON_QUEUE = 'easyPythonQueue';
const MEDIUM_PYTHON_QUEUE = 'mediumPythonQueue';
const HARD_PYTHON_QUEUE = 'hardPythonQueue';
const LANGUAGE_TO_QUEUES = {
  java: {
    easy: EASY_JAVA_QUEUE,
    medium: MEDIUM_JAVA_QUEUE,
    hard: HARD_JAVA_QUEUE,
  },
  python: {
    easy: EASY_PYTHON_QUEUE,
    medium: MEDIUM_PYTHON_QUEUE,
    hard: HARD_PYTHON_QUEUE,
  },
};
const ALL_QUEUES = [
  NOTIFICATION_QUEUE,
  EASY_JAVA_QUEUE,
  MEDIUM_JAVA_QUEUE,
  HARD_JAVA_QUEUE,
  EASY_PYTHON_QUEUE,
  MEDIUM_PYTHON_QUEUE,
  HARD_PYTHON_QUEUE,
];

const QUEUES = {
  notificationQueue: [],
  easyJavaQueue: [],
  mediumJavaQueue: [],
  hardJavaQueue: [],
  easyPythonQueue: [],
  mediumPythonQueue: [],
  hardPythonQueue: [],
};

// rabbitmq to be global variables
// let channel, connection;

// connect();
// Connect to rabbitmq
// async function connect() {
//   try {
//     connection = await amqp.connect(RABBITMQ_URL);
//     // connection = await amqp.connect(`amqp://rabbitmq`);

//     channel = await connection.createChannel();

//     // Creates queues for matches and notifications
//     for (let queue of ALL_QUEUES) {
//       await channel.assertQueue(queue, {
//         durable: false,
//         arguments: { 'x-message-ttl': 30000 },
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// Map of socket id to room id
const SOCKET_TO_ROOM = {};

// Map of socket id to username
const SOCKET_TO_USER = {};

io.on('connection', (socket) => {
  // When user requests to find a match
  socket.on('find_match', (data) => {
    console.log(
      'Request to find match:\n',
      `Socket ID: ${socket.id}\n`,
      `User name: ${data.username}`
    );

    // Keep track of matched status
    let isMatched = false;
    let isMatchedArr = [false];

    // Add user to match queue
    const message = JSON.stringify({
      socket_id: socket.id,
      username: data.username,
    });
    // addToMatchQueue(message, data.language, data.difficulty);
    addToMatchQueueSync(JSON.parse(message), data.language, data.difficulty);

    // Emit a response event to notify user that matching is in progress
    socket.emit('finding_match', {
      message: `Connected to matching service at port ${MATCHING_SERVER_PORT}`,
    });

    const checker = setInterval(() => {
      isMatchedArr[0] = checkNotifications(socket, data);
    }, 3000);
    // Check for a successful match in the notifications queue
    // const consumer = channel.consume(NOTIFICATION_QUEUE, (msg) => {
    //   const msgObj = JSON.parse(msg.content.toString());
    //   console.log(socket.id, msgObj);

    //   // If notification for that user is found
    //   if (msgObj.user_socket_id === socket.id) {
    //     console.log(`Adding user: ${data.username} to room: ${msgObj.room_id}`);

    //     // Ack message to delete notification from queue
    //     channel.ack(msg);

    //     // Notify user that user is joining
    //     socket.emit('match_found', {
    //       message: `Match found, user ${data.username} joining room ${msgObj.room_id}`,
    //       user_username: data.username,
    //       other_user_username: msgObj.other_user_username,
    //       room_id: msgObj.room_id,
    //       question_id: msgObj.question_id,
    //       language: msgObj.language,
    //     });

    //     // Join the new room
    //     socket.join(msgObj.room_id);

    //     // Notify the room that a user is joining
    //     socket.to(msgObj.room_id).emit('user_joined_room', {
    //       message: `User ${data.username} has joined room ${msgObj.room_id}`,
    //       username: data.username,
    //       room_id: msgObj.room_id,
    //     });

    //     // Update matched status
    //     isMatched = true;

    //     // Store in local maps
    //     SOCKET_TO_ROOM[socket.id] = msgObj.room_id;
    //     SOCKET_TO_USER[socket.id] = data.username;
    //   }
    // });

    // Set timeout for 30 seconds to disconnect user if not matched
    setTimeout(() => {
      // cancelConsumer(consumer);
      // isMatched || socket.disconnect();
      clearInterval(checker);
      isMatched[0] || socket.disconnect();
    }, 30000);

    socket.on('disconnect', () => {
      // cancelConsumer(consumer);
    });
  });

  socket.on('send_message', (data) => {
    io.to(data.room_id).emit('receive_message', {
      username: data.username,
      message: data.message,
    });
  });

  socket.on('exit_room', () => {
    // Remove entry from local storage
    let roomId = '';
    if (socket.id in SOCKET_TO_ROOM) {
      roomId = SOCKET_TO_ROOM[socket.id];
      delete SOCKET_TO_ROOM[socket.id];
    }

    let username = '';
    if (socket.id in SOCKET_TO_USER) {
      username = SOCKET_TO_USER[socket.id];
      delete SOCKET_TO_USER[socket.id];
    }

    console.log(username, 'exited room', roomId);
    io.to(roomId).emit('user_exited_room', {
      username: username,
    });
  });

  socket.on('disconnect', () => {
    socket.disconnect();
  });
});

// // Adds user (user id) to matching queue
// async function addToMatchQueue(message, language, difficulty) {
//   try {
//     const queue = LANGUAGE_TO_QUEUES[language][difficulty];
//     // Add the current client socket ID to the queue
//     channel.sendToQueue(queue, Buffer.from(message));
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

function addToMatchQueueSync(message, language, difficulty) {
  const queue = LANGUAGE_TO_QUEUES[language][difficulty];
  QUEUES[queue].push(message);
}

// // Matches first 2 users in queue if queue length >= 2
// async function matchUsersInQueue(language, difficulty) {
//   try {
//     // Get queue based on difficulty
//     const queue = LANGUAGE_TO_QUEUES[language][difficulty];

//     // Get the current number of user IDs in the queue
//     const matchQueueStats = await channel.checkQueue(queue);

//     // If there are more than 2 users in queue, match 2 users together
//     if (matchQueueStats.messageCount >= 2) {
//       console.log('Matching users');
//       // Get first user
//       const user1 = await channel.get(queue);
//       if (user1 !== null) {
//         channel.ack(user1);
//       }
//       const user1Details = JSON.parse(user1.content.toString());

//       // Get second user
//       const user2 = await channel.get(queue);
//       if (user2 !== null) {
//         channel.ack(user2);
//       }
//       const user2Details = JSON.parse(user2.content.toString());

//       const selectedQuestionId = await getQuestionIdByDifficulty(difficulty);

//       // Create a socket room and add to notifications queue
//       const newRoomId = user1Details.socket_id + user2Details.socket_id;
//       const newNotification1 = {
//         user_socket_id: user1Details.socket_id,
//         user_username: user1Details.username,
//         other_user_socket_id: user2Details.socket_id,
//         other_user_username: user2Details.username,
//         room_id: newRoomId,
//         question_id: selectedQuestionId,
//         difficulty: difficulty,
//         language: language,
//       };
//       const newNotification2 = {
//         user_socket_id: user2Details.socket_id,
//         user_username: user2Details.username,
//         other_user_socket_id: user1Details.socket_id,
//         other_user_username: user1Details.username,
//         room_id: newRoomId,
//         question_id: selectedQuestionId,
//         difficulty: difficulty,
//         language: language,
//       };

//       // Send one notification for each user to the notifications queue
//       channel.sendToQueue(
//         NOTIFICATION_QUEUE,
//         Buffer.from(JSON.stringify(newNotification1))
//       );
//       channel.sendToQueue(
//         NOTIFICATION_QUEUE,
//         Buffer.from(JSON.stringify(newNotification2))
//       );
//     }
//   } catch (error) {
//     console.error('Error: ', error);
//   }
// }

async function matchUsersInQueueSync(language, difficulty) {
  try {
    const queue = QUEUES[LANGUAGE_TO_QUEUES[language][difficulty]];
    if (queue.length >= 2) {
      const [user1, user2] = queue.splice(0, 2);
      const selectedQuestionId = await getQuestionIdByDifficulty(difficulty);
      const newRoomId = user1.socket_id + user2.socket_id;
      const newNotification1 = {
        user_socket_id: user1.socket_id,
        user_username: user1.username,
        other_user_socket_id: user2.socket_id,
        other_user_username: user2.username,
        room_id: newRoomId,
        question_id: selectedQuestionId,
        difficulty: difficulty,
        language: language,
      };
      const newNotification2 = {
        user_socket_id: user2.socket_id,
        user_username: user2.username,
        other_user_socket_id: user1.socket_id,
        other_user_username: user1.username,
        room_id: newRoomId,
        question_id: selectedQuestionId,
        difficulty: difficulty,
        language: language,
      };
      QUEUES[NOTIFICATION_QUEUE].push(newNotification1);
      QUEUES[NOTIFICATION_QUEUE].push(newNotification2);
      console.log(QUEUES);
    }
  } catch (error) {
    console.error(error);
  }
}

// // Unsubscribe consumer from notifications queue
// async function cancelConsumer(consumer) {
//   const consumerObj = await consumer;
//   channel.cancel(consumerObj.consumerTag);
// }

// Select a random question based on difficulty
async function getQuestionIdByDifficulty(difficulty) {
  try {
    const response = await fetch(QUESTION_SERVICE_ENDPOINT);
    const questions = await response.json();
    const complexity =
      difficulty === 'easy'
        ? 'Easy'
        : difficulty === 'medium'
        ? 'Medium'
        : 'Hard';
    const filteredQuestions = questions.filter(
      (question) => question.complexity === complexity
    );
    const randomQuestion =
      filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
    return randomQuestion._id;
  } catch (error) {
    return '6533d92691995349640128fa';
  }
}

function checkNotifications(socket, data) {
  let isMatched = false;
  let ack = -1;
  // Check for a successful match in the notifications queue
  for (let notificationIdx in QUEUES[NOTIFICATION_QUEUE]) {
    const notification = QUEUES[NOTIFICATION_QUEUE][notificationIdx];
    if (notification.user_socket_id === socket.id) {
      console.log(
        `Adding user: ${data.username} to room: ${notification.room_id}`
      );
      // Notify user that user is joining
      socket.emit('match_found', {
        message: `Match found, user ${data.username} joining room ${notification.room_id}`,
        user_username: data.username,
        other_user_username: notification.other_user_username,
        room_id: notification.room_id,
        question_id: notification.question_id,
        language: notification.language,
      });

      // Join the new room
      socket.join(notification.room_id);

      // Notify the room that a user is joining
      socket.to(notification.room_id).emit('user_joined_room', {
        message: `User ${data.username} has joined room ${notification.room_id}`,
        username: data.username,
        room_id: notification.room_id,
      });
      ack = notificationIdx;
      isMatched = true;
      // Store in local maps
      SOCKET_TO_ROOM[socket.id] = notification.room_id;
      SOCKET_TO_USER[socket.id] = data.username;
      break;
    }
  }
  if (isMatched) {
    QUEUES[NOTIFICATION_QUEUE].splice(ack, 1);
    return true;
  } else {
    return false;
  }
}

// Check for valid matches every 5 seconds
setInterval(async () => {
  // matchUsersInQueue('java', 'easy');
  // matchUsersInQueue('java', 'medium');
  // matchUsersInQueue('java', 'hard');
  // matchUsersInQueue('python', 'easy');
  // matchUsersInQueue('python', 'medium');
  // matchUsersInQueue('python', 'hard');
  matchUsersInQueueSync('java', 'easy');
  matchUsersInQueueSync('java', 'medium');
  matchUsersInQueueSync('java', 'hard');
  matchUsersInQueueSync('python', 'easy');
  matchUsersInQueueSync('python', 'medium');
  matchUsersInQueueSync('python', 'hard');
}, 5000);

server.listen(MATCHING_SERVER_PORT, () => {
  console.log(
    // `Matching server listening on port ${MATCHING_SERVER_PORT} with RabbitMQ running on: ${RABBITMQ_URL}`
    `Matching server listening on port ${MATCHING_SERVER_PORT}`
  );
});
