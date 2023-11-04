'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Matching from '@components/Matching';

import Workspace from '@components/Workspace';

const CollabPage = ({ params }) => {
  // HARDCODED FOR NOW, WILL FETCH FROM SOMEWHERE LATER
  const [questionId, setQuestionId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [language, setLanguage] = useState('python');
  const [isMatched, setIsMatched] = useState(false);
  const onMatch = (roomId, questionId, language) => {
    setRoomId(roomId);
    setQuestionId(questionId);
    setLanguage(language);
    setIsMatched(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isMatched && (
        <Workspace
          questionId={questionId}
          roomId={roomId}
          language={language}
        />
      )}
      <Matching onMatch={onMatch} />
    </div>
  );
};

export default CollabPage;
