'use client';

import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

const socket = io.connect(process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL);


const Matching = ({ onMatch }) => {
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);
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
      console.log(data.message);
      setIsMatched(true);
      setIsFinding(false);
      setRunCountdown(false);
      setOtherUser(data.other_user_username);
      onMatch(data.room_id);

      router.push(`/coding-page/room/${data.room_id}`);
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

    // Reset connection if page is refreshed
    window.addEventListener('beforeunload', (e) => {
      console.log(e);
      socket.disconnect();
    });

    return () => {
      socket.off('find_match');
      socket.off('finding_match');
      socket.off('match_found');
      socket.off('user_joined_room');
      socket.off('room_message');
      socket.disconnect();
    };
  }, [socket]);

  return !isAuthenticated() ? null : (
    <div className="flex flex-col justify-center items-center p-2 m-1 bg-gray-50">
      <div className="font-bold mt-2 text-4xl text-center flex-1">
        Match with a friend!
      </div>
      <div className="flex flex-row justify-center items-center items-stretch">
        {renderDifficultyOptions()}
        {renderLanguageOptions()}
      </div>
      <button
        className={
          'border border-grey py-3 px-20 rounded-md m-3 font-semibold text-xl ' +
          (isFinding || isMatched
            ? 'cursor-not-allowed opacity-50'
            : 'bg-green-100')
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
