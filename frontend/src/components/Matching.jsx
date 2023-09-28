'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Matching = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [connect, setConnect] = useState(false);

  // TODO: get user id from the actual user id
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (connect) {
      const socket = io('http://localhost:5000');
      socket.emit('find_match', {
        user_id: userId,
      });

      socket.on('test_connection_success', (data) => {
        console.log(data.message);
        if (data) {
          setIsConnected(true);
        }
      });

      socket.on('match_found', (data) => {
        console.log(data.message);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected');
        setIsConnected(false);
      });

      return () => {
        socket.off('find_match');
        socket.off('test_connection_success');
        socket.off('match_found');
      };
    }
  }, [connect]);

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
          setConnect(false);
          setUserId(e.target.value);
        }}
      />
      <br />
      <button onClick={() => setConnect(true)}>Click here to connect</button>
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
