// This is the page that is shown when people get matched. 
// Shows the question, a collaborative code editor and a chat box.
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Workspace from '@components/Workspace';


const CollabPage = ({}) => {
  // HARDCODED FOR NOW, WILL FETCH FROM SOMEWHERE LATER
  const questionId = "6533d92691995349640128f3"; 
  const router = useRouter();
  const roomId  = router.query;  // Extracting roomId from the URL
  
  return (
    <div className="container mx-auto px-4 py-8">
        <Workspace questionId={questionId} roomId={roomId} />
    </div>
  );
};
  
  export default CollabPage;
  