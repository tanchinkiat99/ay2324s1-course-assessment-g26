'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Workspace from '@components/Workspace';


const CollabPage = ({ params }) => {
  // HARDCODED FOR NOW, WILL FETCH FROM SOMEWHERE LATER
  const questionId = "6533d92691995349640128f3"; 
  const router = useRouter();
  const roomId  = router.query;  // Extracting roomId from the URL
  
  //const roomId = params.id;
  console.log("but actually routed to: " + roomId);

  
  return (
    <div className="container mx-auto px-4 py-8">
        <Workspace questionId={questionId} roomId={roomId} />
    </div>
  );
};
  
export default CollabPage;
  