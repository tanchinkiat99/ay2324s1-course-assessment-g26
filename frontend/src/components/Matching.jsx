'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Matching = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // TODO: get user id from the actual user id
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.emit('find_match', {
      message: `Request to find match from user: ${userId}`,
      user_id: userId,
    });

    socket.on('test_connection_success', (data) => {
      console.log(data.message);
      if (data.success) {
        setIsConnected(true);
      }
    });

    socket.on('found_match', (data) => {
      console.log('success', data.room_id);
    });

    return () => {
      socket.off('find_match');
      socket.off('test_connection_success');
      socket.off('found_match');
    };
  }, []);

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
      <div
        style={
          isConnected
            ? { backgroundColor: 'green' }
            : { backgroundColor: 'red' }
        }
      >
        {isConnected ? 'Connected to matching service' : 'Not connected'}
      </div>
      <div
        style={
          isMatched ? { backgroundColor: 'green' } : { backgroundColor: 'red' }
        }
      >
        {isMatched ? 'Matched' : 'Not matched'}
      </div>
      <div>{countdown}</div>
    </div>
  );
};

export default Matching;
