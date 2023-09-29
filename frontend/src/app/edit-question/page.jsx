'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuestionForm from '@components/QuestionForm';

const EditQuestion = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Submitting state will change the text on the button
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    // id: '', // TODO: Should be generated when adding to the database
    title: '',
    description: '',
    categories: '',
    complexity: '',
  });

  useEffect(() => {
    const getQuestionDetails = async () => {
      const response = await fetch(
        `http://localhost:5000/questions/${questionId}`
      );
      const data = await response.json();
      setPost({
        title: quesiton.title,
        description: question.description,
        categories: question.categories,
        complexity: question.complexity,
      });
    };

    if (questionId) {
      getQuestionDetails();
    }
  }, [questionId]);

  const updateQuestion = async (e) => {
    // Prevent page reload
    e.preventDefault();
    setSubmitting(true);
    if (!questionId) return alert('No question ID provided');

    try {
      // TODO: dont hardcode API here
      const response = await fetch(
        `http://localhost:5000/questions/${questionId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // TODO: Add session?.user.id if want to associate user with the questions they create
            ...post,
          }),
        }
      );
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
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updateQuestion}
    />
  );
};

export default EditQuestion;
