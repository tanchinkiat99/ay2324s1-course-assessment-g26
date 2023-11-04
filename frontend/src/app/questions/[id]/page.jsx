'use client';

import QuestionCard from '@components/QuestionCard';
import PrivateRoute from '@app/api/auth/[...nextauth]/PrivateRoute';

const page = ({ params }) => {
  return (
    <div>
      <QuestionCard questionId={params.id} />
    </div>
  );
};

export default PrivateRoute(page);
