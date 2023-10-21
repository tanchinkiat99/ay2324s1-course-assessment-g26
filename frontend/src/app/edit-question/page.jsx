'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuestionForm from '@components/QuestionForm';
import { getQuestionById, updateQuestion } from '@app/api/questionService';

const EditQuestion = () => {
  const router = useRouter();
  // Get question ID from query params
  const searchParams = useSearchParams();
  const questionId = searchParams.get('id');
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
    // Fill in form with question details
    const getQuestionDetails = async () => {
      try {
        const data = await getQuestionById(questionId);
        console.log(data);
        setPost({
          title: data.title,
          description: data.description,
          categories: data.categories,
          complexity: data.complexity,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (questionId) {
      getQuestionDetails();
    }
  }, [questionId]);

  const updateQuestionSubmit = async (e) => {
    // Prevent page reload
    e.preventDefault();
    setSubmitting(true);
    if (!questionId) return alert('No question ID provided');

    try {
      const response = await updateQuestion(questionId, post);
      router.push('/');
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
      handleSubmit={updateQuestionSubmit}
    />
  );
};

export default EditQuestion;
