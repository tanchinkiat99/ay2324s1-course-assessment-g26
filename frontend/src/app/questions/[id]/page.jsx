'use client';

import Workspace from '@components/Workspace';
import QuestionCard from '@components/QuestionCard';

const page = ({ params }) => {
  return (
    <div> 
      <QuestionCard questionId={params.id} />
    </div>
  );
};


export default page;
