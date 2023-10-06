'use client';

import QuestionsList from '@components/QuestionsList';
import Matching from '@components/Matching';
import { useState } from 'react';

const Home = () => {
  // For the matching and collaboration service
  const [roomId, setRoomId] = useState('');
  const [isMatched, setIsMatched] = useState(false);
  const onMatch = (roomId) => {
    setRoomId(roomId);
    setIsMatched(true);
  };

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="text-center text-5xl">
        PeerPrep
        <br className="max-md:hidden" />
        <span className="text-2xl">
          Practice technical interviews with your peers
        </span>
      </h1>
      <p className="desc text-center">
        Browse the questions here and get matched
      </p>
      <QuestionsList />
      <Matching onMatch={onMatch} />
    </section>
  );
};

export default Home;
