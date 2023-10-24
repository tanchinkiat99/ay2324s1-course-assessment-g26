'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

import styles from '@styles/Chatbox.module.css';

const Chatbox = ({ socket, roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { data: session, status } = useSession();

  const isAuthenticated = () => status === 'authenticated';
  const user = isAuthenticated() ? session.user : null;

  const sendMessage = () => {
    socket.emit('send_message', {
      username: user.name,
      message: message,
      room_id: roomId,
    });
    setMessage(''); // clear message input
  };

  const receiveMessage = (newMessage) => {
    setMessages((curr) => [...curr, newMessage]);
  };

  const renderMessages = () => {
    return messages.map((data, index) => (
      <div
        key={index}
        className={
          data.username === user.name
            ? styles.userMessage
            : styles.otherMessage
        }
      >
        {data.username}: {data.message}
      </div>
    ));

    // return messages.map((data, index) => (
    //   <div key={index}>
    //     {data.username}: {data.message}
    //   </div>
    // ));
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data.message);
      receiveMessage(data);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  return (
    <div className="flex flex-col justify-center items-center p-2 m-1 bg-gray-50">
      <div className="font-bold mt-2 text-4xl text-center flex-1">Room Chat:</div>
      <div className="flex flex-col justify-center items-center items-stretch">
        {renderMessages()}
      </div>
      <input name="myInput" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button
        className="border border-grey py-3 px-20 rounded-md m-3"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default Chatbox;
