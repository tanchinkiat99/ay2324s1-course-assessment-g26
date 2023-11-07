'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

import styles from '@styles/Chatbox.module.css';

const Chatbox = ({ socket, roomId }) => {

  const [isChatOpen, setIsChatOpen] = useState(true); 

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { data: session, status } = useSession();

  const isAuthenticated = () => status === 'authenticated';
  const user = isAuthenticated() ? session.user : null;

  const sendMessage = () => {
    if (message.trim() === '') {
      // Don't send empty or whitespace-only messages
      return;
    }
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
        {data.message}
      </div>
    ));
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

  // return (
  //   <div className="flex flex-col justify-center items-center p-2 m-1 bg-gray-50">
  //     <div className="font-bold mt-2 text-4xl text-center flex-1">Room Chat2:</div>
  //     <div className="flex flex-col justify-center items-center items-stretch">
  //       {renderMessages()}
  //     </div>
  //     <input name="myInput" value={message} onChange={(e) => setMessage(e.target.value)} />
  //     <button
  //       className="border border-grey py-3 px-20 rounded-md m-3"
  //       onClick={sendMessage}
  //     >
  //       Send
  //     </button>
  //   </div>
  // );
  return (
    <>
      <div className={styles['chat-box']}>
        <div className={styles['chat-box-header']}>
          Chat with Peer!
          <span className={styles['chat-box-toggle']} onClick={() => setIsChatOpen(!isChatOpen)}>
            <i className={styles.italicText}>{isChatOpen ? 'Close' : 'Open'}</i>
          </span>
        </div>
        {isChatOpen && (
          <>
            <div className={styles['chat-box-body']}>
              <div className={styles['chat-logs']}>
                {renderMessages()}
              </div>
            </div>
            <div className={styles['chat-input']}>      
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                <input type="text" id="chat-input" className={styles['chat-input']} placeholder="  Send a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="submit" className={styles['chat-submit']} id="chat-submit">Send</button>
              </form>      
            </div>
          </>
        )}
      </div>
    </>
  );

};

export default Chatbox;
