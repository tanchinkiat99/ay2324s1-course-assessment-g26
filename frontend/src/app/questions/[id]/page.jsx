'use client';

import QuestionCard from '@components/QuestionCard';

const page = ({ params }) => {
  return (
    <div className="flex justify-center"> 
      <QuestionCard questionId={params.id} />
    </div>
  );
};


export default page;
