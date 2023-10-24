'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Matching from '@components/Matching';

import Workspace from '@components/Workspace';

const CollabPage = ({ params }) => {
  // HARDCODED FOR NOW, WILL FETCH FROM SOMEWHERE LATER
  // const questionId = '6533d92691995349640128f3';
  const [questionId, setQuestionId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isMatched, setIsMatched] = useState(false);
  const onMatch = (roomId, questionId) => {
    setRoomId(roomId);
    setQuestionId(questionId);
    setIsMatched(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Matching onMatch={onMatch} />
      {isMatched && <Workspace questionId={questionId} roomId={roomId} />}
    </div>
  );
};

export default CollabPage;
