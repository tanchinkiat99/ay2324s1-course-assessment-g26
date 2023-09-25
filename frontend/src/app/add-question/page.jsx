'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import QuestionForm from '@components/QuestionForm';

// const AddQuestion = () => {
//   const router = useRouter();
//   // Submitting state will change the text on the button
//   const [submitting, setSubmitting] = useState(false);
//   const [post, setPost] = useState({
//     // id: '', // TODO: Should be generated when adding to the database
//     title: '',
//     description: '',
//     categories: '',
//     complexity: '',
//   });
//   const addQuestion = async (e) => {
//     // Prevent page reload
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await fetch('/api/question/new', {
//         method: 'POST',
//         body: JSON.stringify({
//           // TODO: Add session?.user.id if want to associate user with the questions they create
//           ...post
//         }),
//       });
//       if (response.ok) {
//         // Push user to homepage
//         router.push('/');
//       }
//     } catch (error) {

//     }
//   }
//   return (
//     <QuestionForm
//       type="Create"
//       post={post}
//       setPost={setPost}
//       submitting={submitting}
//       handleSubmit={addQuestion}
//     />
//   );
// }

const AddQuestion = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/question/new');
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const postData = async () => {
    try {
      const response = await fetch('http://localhost:5000/question/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: 'What is the meaning of life?' }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div>
      <h1>API Response:</h1>
      <p>{message}</p>
      <button
        onClick={postData}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Test POST
      </button>
    </div>
  );
};

export default AddQuestion;
