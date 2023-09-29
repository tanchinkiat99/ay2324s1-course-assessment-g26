'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import QuestionForm from '@components/QuestionForm';

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
      // TODO: dont hardcode API here
      const response = await fetch('http://localhost:5000/questions/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // TODO: Add session?.user.id if want to associate user with the questions they create
          ...post,
        }),
      });
      if (response.ok) {
        // Push user to homepage
        router.push('/');
      }
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

export default AddQuestion;
