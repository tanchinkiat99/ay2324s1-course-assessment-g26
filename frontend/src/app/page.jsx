'use client';

import QuestionsList from '@components/QuestionsList';
import Matching from '@components/Matching';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  // For the matching and collaboration service
  const router = useRouter();

  const [roomId, setRoomId] = useState('');
  const [isMatched, setIsMatched] = useState(false);
  const onMatch = (roomId) => {
    setRoomId(roomId);
    setIsMatched(true);

    console.log("room id is routed to: " + roomId);
    router.push(`/collab-page/${roomId}`);
    //router.push(`/questions/6533d92691995349640128f3`);
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
