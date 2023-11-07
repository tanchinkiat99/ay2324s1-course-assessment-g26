'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Matching from '@components/Matching';
import PrivateRoute from '@app/api/auth/[...nextauth]/PrivateRoute';
import Workspace from '@components/Workspace';
import Chatbox from '@components/Chatbox';

const CollabPage = ({ params }) => {
  const [questionId, setQuestionId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [language, setLanguage] = useState('python');
  const [isMatched, setIsMatched] = useState(false);
  const [socket, setSocket] = useState(null);

  const onMatch = (newSocket, roomId, questionId, language) => {
    setSocket(newSocket);
    setRoomId(roomId);
    setQuestionId(questionId);
    setLanguage(language);
    setIsMatched(true);
  };

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     {isMatched && (
  //       <Workspace
  //         questionId={questionId}
  //         roomId={roomId}
  //         language={language}
  //       />
  //     )}
  //     <Matching onMatch={onMatch} />
  //   </div>
  // );
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row w-full h-full justify-center items-center">
        {isMatched && (
          <Workspace
            questionId={questionId}
            roomId={roomId}
            language={language}
          />
        )}
        <Matching onMatch={onMatch} isMatched={isMatched} />
        {isMatched && socket && roomId && (
          <Chatbox socket={socket} roomId={roomId} />
        )}
      </div>
    </div>
  );
};

export default PrivateRoute(CollabPage);
