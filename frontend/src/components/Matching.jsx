'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

const Matching = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [otherUser, setOtherUser] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [difficulty, setDifficulty] = useState('easy');

  // TODO: get user id from the actual user id instead of input
  const [userId, setUserId] = useState('');

  const requestToFindMatch = () => {
    socket.emit('find_match', {
      user_id: userId,
      difficulty: difficulty,
    });
  };

  const sendMessageIntoRoom = () => {
    socket.emit('send_message', {
      user_id: userId,
      room_id: roomId,
      message: currentMessage,
    });
  };

  const addMessageIntoRoom = (fromUserId, message) => {
    const newMessage = {
      userId: fromUserId,
      message: message,
    };
    setRoomMessages((prev) => [...prev, newMessage]);
  };

  const renderRoomMessages = () => {
    return (
      <div>
        <div>Room chat: </div>
        {roomMessages.map(({ userId, message }, index) => {
          return (
            <div key={index}>
              {userId}: {message}
            </div>
          );
        })}
      </div>
    );
  };
  console.log('difficulty: ', difficulty);

  const renderDifficultyOptions = () => {
    return (
      <div>
        <div>Select your difficulty:</div>
        <div onChange={(e) => setDifficulty(e.target.value)}>
          <input type="radio" value="easy" name="gender" defaultChecked /> Easy
          <br />
          <input type="radio" value="medium" name="gender" /> Medium
          <br />
          <input type="radio" value="hard" name="gender" /> Hard
          <br />
        </div>
      </div>
    );
  };

  useEffect(() => {
    socket.on('finding_match', (data) => {
      console.log(data.message);
      if (data) {
        setIsConnected(true);
      }
    });

    socket.on('match_found', (data) => {
      console.log(data.message);
      setIsMatched(true);
      setOtherUser(data.other_user_id);
      setRoomId(data.room_id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
      setIsMatched(false);
      setIsConnected(false);
    });

    socket.on('user_joined_room', (data) => {
      console.log(data.message);
    });

    socket.on('receive_message', (data) => {
      addMessageIntoRoom(data.user_id, data.message);
    });

    return () => {
      socket.off('find_match');
      socket.off('finding_match');
      socket.off('match_found');
      socket.off('user_joined_room');
      socket.off('room_message');
    };
  }, [socket]);

  return (
    <div>
      <div>THIS IS THE MATCHING SERVICE PART</div>
      <br />
      <input
        name="userIdInput"
        value={userId}
        style={{ borderColor: 'black', borderWidth: 1 }}
        placeholder="Enter your user id here"
        onChange={(e) => {
          setIsConnected(false);
          setUserId(e.target.value);
        }}
      />
      <br />
      {renderDifficultyOptions()}
      <button
        onClick={requestToFindMatch}
        style={{ width: '20%', borderWidth: 1, borderColor: 'black' }}
      >
        Click here to find a match
      </button>
      <br />
      <div
        style={
          isConnected
            ? {
                backgroundColor: 'green',
                width: '20%',
                borderWidth: 1,
                borderColor: 'black',
              }
            : {
                backgroundColor: 'red',
                width: '20%',
                borderWidth: 1,
                borderColor: 'black',
              }
        }
      >
        {isConnected ? 'Finding a match' : 'Disconnected'}
      </div>
      <div
        style={
          isMatched
            ? {
                backgroundColor: 'green',
                width: '20%',
                borderWidth: 1,
                borderColor: 'black',
              }
            : {
                backgroundColor: 'red',
                width: '20%',
                borderWidth: 1,
                borderColor: 'black',
              }
        }
      >
        {isMatched ? 'Matched with: ' + otherUser : 'Not matched'}
      </div>
      <div>{countdown}</div>
      <input
        name="sendMessage"
        value={currentMessage}
        style={{ borderColor: 'black', borderWidth: 1 }}
        placeholder="Type something here"
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />
      <button
        onClick={sendMessageIntoRoom}
        style={{ width: '20%', borderWidth: 1, borderColor: 'black' }}
      >
        Send
      </button>
      {renderRoomMessages()}
    </div>
  );
};

export default Matching;
