'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import QuestionForm from '@components/QuestionForm';
import { createQuestion } from '@app/api/questionService';
import PrivateRoute from '@app/api/auth/[...nextauth]/PrivateRoute';

const AddQuestion = () => {
  const router = useRouter();
  // Submitting state will change the text on the button
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    // id: '', // TODO: Should be generated when adding to the database
    title: '',
    description: '',
    categories: '',
    complexity: '',
  });
  const addQuestion = async (e) => {
    // Prevent page reload
    e.preventDefault();
    setSubmitting(true);
    try {
      await createQuestion(post);
      router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QuestionForm
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={addQuestion}
    />
  );
};

export default PrivateRoute(AddQuestion);
