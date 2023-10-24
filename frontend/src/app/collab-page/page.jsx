'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Matching from '@components/Matching';

import Workspace from '@components/Workspace';

const CollabPage = ({ params }) => {
  // HARDCODED FOR NOW, WILL FETCH FROM SOMEWHERE LATER
  const questionId = '6533d92691995349640128f3';
  const [roomId, setRoomId] = useState('');
  const [isMatched, setIsMatched] = useState(false);
  const onMatch = (roomId) => {
    setRoomId(roomId);
    setIsMatched(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isMatched ? (
        <Workspace questionId={questionId} roomId={roomId} />
      ) : (
        <Matching onMatch={onMatch} />
      )}
    </div>
  );
};

export default CollabPage;
