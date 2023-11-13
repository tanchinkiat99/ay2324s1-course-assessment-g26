'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import Chatbox from './Chatbox';

const socket = io(process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL, {
  transports: ['websocket'],
});

const Matching = ({ onMatch }) => {
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isMatched, setIsMatched] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const [otherUser, setOtherUser] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [language, setLanguage] = useState('python');
  const [countdown, setCountdown] = useState(30);
  const [runCountdown, setRunCountdown] = useState(false);
  const [clickHereButtonText, setClickHereButtonText] = useState(
    'Click here to find a match'
  );

  const isAuthenticated = () => status === 'authenticated';
  const user = isAuthenticated() ? session.user : null;

  const requestToFindMatch = () => {
    socket.connect();
    socket.emit('find_match', {
      username: user.name,
      difficulty: difficulty,
      language: language,
    });
    setIsFinding(true);
    setRunCountdown(true);
    setCountdown(30);
  };

  const renderDifficultyOptions = () => {
    return (
      <div className="border border-grey p-5 rounded-md m-3 bg-blue-200">
        <div className="text-2xl font-semibold">Select your difficulty:</div>
        <div
          className="text-lg"
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <input type="radio" value="easy" name="difficulty" defaultChecked />{' '}
          Easy
          <br />
          <input type="radio" value="medium" name="difficulty" /> Medium
          <br />
          <input type="radio" value="hard" name="difficulty" /> Hard
          <br />
        </div>
      </div>
    );
  };

  const renderLanguageOptions = () => {
    return (
      <div className="border border-grey p-5 rounded-md m-3 bg-pink-200">
        <div className="text-2xl font-semibold">Select your language:</div>
        <div className="text-lg" onChange={(e) => setLanguage(e.target.value)}>
          <input type="radio" value="python" name="language" defaultChecked />{' '}
          Python
          <br />
          <input type="radio" value="java" name="language" /> Java
          <br />
        </div>
      </div>
    );
  };

  const renderMatchStatus = () => {
    return (
      <div>
        {isFinding ? (
          <div className="border border-grey py-2 px-10 rounded-md m-3 font-semibold text-xl bg-yellow-200">
            Finding a match...{' '}
          </div>
        ) : null}
        {isMatched ? (
          <div className="border border-grey py-2 px-10 rounded-md m-3 font-semibold text-xl bg-green-200">
            {'Matched with: ' + otherUser}
          </div>
        ) : null}
      </div>
    );
  };

  const renderCountdownTimer = () => {
    return runCountdown ? <div>{countdown}</div> : null;
  };

  const disconnect = () => {
    socket.emit('exit_room');
    socket.off('find_match');
    socket.off('finding_match');
    socket.off('match_found');
    socket.off('user_joined_room');
    socket.off('room_message');
    socket.disconnect();
  };

  useEffect(() => {
    if (runCountdown) {
      if (countdown <= 0) {
        setRunCountdown(false);
        setCountdown(30);
      } else {
        setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      }
    } else {
      setCountdown(30);
    }
  }, [countdown, runCountdown]);

  useEffect(() => {
    socket.on('finding_match', (data) => {
      console.log(data.message);
      if (data) {
        setIsConnected(true);
      }
    });

    socket.on('match_found', (data) => {
      console.log(data);
      setIsMatched(true);
      setIsFinding(false);
      setRunCountdown(false);
      setOtherUser(data.other_user_username);
      onMatch(socket, data.room_id, data.question_id, data.language);
      setRoomId(data.room_id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
      setIsMatched(false);
      setIsConnected(false);
      setIsFinding(false);
      setRunCountdown(false);
      setClickHereButtonText('Try again');
    });

    socket.on('user_joined_room', (data) => {
      console.log(data.message);
    });

    socket.on('user_exited_room', (data) => {
      alert(`${data.username} has left the room.`);
    });

    // Reset connection if page is refreshed
    window.addEventListener('beforeunload', (e) => {
      disconnect();
      // socket.disconnect();
    });

    return disconnect;
  }, [socket]);

  // return !isAuthenticated() ? null : isMatched ? (
  //   <Chatbox socket={socket} roomId={roomId} />
  // ) : (
  //   <div className="flex flex-col justify-center items-center p-2 m-1 bg-gray-50">
  //     <div className="font-bold mt-2 text-4xl text-center flex-1">
  //       Match with a friend!
  //     </div>
  //     <div className="flex flex-row justify-center items-center items-stretch">
  //       {renderDifficultyOptions()}
  //       {renderLanguageOptions()}
  //     </div>
  //     <button
  //       className={
  //         'border border-grey py-3 px-20 rounded-md m-3 font-semibold text-xl ' +
  //         (isFinding || isMatched
  //           ? 'cursor-not-allowed opacity-50'
  //           : 'bg-green-100')
  //       }
  //       onClick={requestToFindMatch}
  //       disabled={isFinding || isMatched}
  //     >
  //       {clickHereButtonText}
  //     </button>
  //     {renderMatchStatus()}
  //     {renderCountdownTimer()}
  //   </div>
  // );

  return !isAuthenticated() || isMatched ? null : (
    <div className="flex flex-col justify-center items-center p-2 m-1 bg-gray-50">
      <div className="font-bold text-4xl text-center my-10">
        Match with a friend!
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
        {renderDifficultyOptions()}
        {renderLanguageOptions()}
      </div>
      <button
        className={
          'border border-grey py-2 px-16 rounded-md my-2 font-semibold text-lg ' +
          (isFinding || isMatched
            ? 'cursor-not-allowed opacity-50'
            : 'bg-green-100 hover:bg-green-200')
        }
        onClick={requestToFindMatch}
        disabled={isFinding || isMatched}
      >
        {clickHereButtonText}
      </button>
      {renderMatchStatus()}
      {renderCountdownTimer()}
    </div>
  );
};

export default Matching;
