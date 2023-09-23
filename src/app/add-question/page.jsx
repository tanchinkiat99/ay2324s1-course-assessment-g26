'use client';
import { useState } from 'react';
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
      const response = await fetch('/api/question/new', {
        method: 'POST',
        body: JSON.stringify({
          // TODO: Add session?.user.id if want to associate user with the questions they create
          ...post
        }),
      });
      if (response.ok) {
        // Push user to homepage
        router.push('/');
      }
    } catch (error) {

    }
  } 
  return (
    <QuestionForm
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={addQuestion}
    />
  );
}

export default AddQuestion;
