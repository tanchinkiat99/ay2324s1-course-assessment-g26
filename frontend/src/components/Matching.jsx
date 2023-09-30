'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Matching = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [connect, setConnect] = useState(false);
  const [otherUser, setOtherUser] = useState('');
  const [roomId, setRoomId] = useState('');

  // TODO: get user id from the actual user id instead of input
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (connect) {
      const socket = io('http://localhost:5000');
      socket.emit('find_match', {
        user_id: userId,
      });

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

      return () => {
        socket.off('find_match');
        socket.off('finding_match');
        socket.off('match_found');
        socket.off('user_joined_room');
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
      <button
        onClick={() => setConnect(true)}
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
    </div>
  );
};

export default Matching;
