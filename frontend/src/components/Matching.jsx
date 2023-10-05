'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Countdown from './Countdown';

const socket = io.connect('http://localhost:5001');

const Matching = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
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
        setStartCountdown(true);
      }
    });

    socket.on('match_found', (data) => {
      console.log(data.message);
      setIsMatched(true);
      setStartCountdown(false);
      setOtherUser(data.other_user_id);
      setRoomId(data.room_id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
      setIsMatched(false);
      setIsConnected(false);
      setStartCountdown(false);
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
      <div>Match with a friend!</div>
      <br />
      <input
        className="border border-black p-2"
        name="userIdInput"
        value={userId}
        placeholder="Enter your user id here"
        onChange={(e) => {
          setIsConnected(false);
          setUserId(e.target.value);
        }}
      />
      <br />
      {renderDifficultyOptions()}
      <button className="border border-black p-2" onClick={requestToFindMatch}>
        Click here to find a match
      </button>
      <br />
      <div
        className={`${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        } border border-black p-1`}
      >
        {isConnected ? 'Finding a match' : 'Disconnected'}
      </div>
      <div
        className={`${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        } border border-black p-1`}
      >
        {isMatched ? 'Matched with: ' + otherUser : 'Not matched'}
      </div>
      <Countdown startCountdown={startCountdown} />
      <input
        className="border border-black p-2"
        name="sendMessage"
        value={currentMessage}
        placeholder="Type something here"
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />
      <button className="border border-black p-2" onClick={sendMessageIntoRoom}>
        Send
      </button>
      {renderRoomMessages()}
    </div>
  );
};

export default Matching;
