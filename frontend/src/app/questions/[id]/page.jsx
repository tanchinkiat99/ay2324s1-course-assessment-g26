'use client';

import Workspace from '@components/Workspace';
import QuestionCard from '@components/QuestionCard';

const page = ({ params }) => {
  return (
    <div> 
      <Workspace questionId={params.id} />
    </div>
  );
};


export default page;
