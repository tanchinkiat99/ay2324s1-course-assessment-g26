'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionRow from './QuestionRow';
import { getAllQuestions, deleteQuestion } from '@app/api/questionService';

const QuestionTable = ({ questions, handleDelete }) => {
  const router = useRouter();

  const handleEdit = (id) => {
    // Direct to edit form
    router.push(`/edit-question/?id=${id}`);
  };

  return (
    <section id="question-list">
      <table className="w-full mt-5">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th className="text-left">Complexity</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <QuestionRow
              question={question}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};

const QuestionsList = () => {
  const [searchText, setSearchText] = useState('');
  const [questions, setQuestions] = useState([]);
  const handleSearchChange = (e) => {};

  // Get all questions as soon as page loads
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getAllQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error:', error);
        console.error('Error Details:', error.response?.data);
      }
      // const data = await getAllQuestions();
      // console.log(data);
      // setQuestions(data);
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this question?');
    if (confirmed) {
      try {
        await deleteQuestion(id);
        const filteredQuestions = questions.filter(
          (question) => question._id !== id
        );
        setQuestions(filteredQuestions);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search question by title"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer mt-10"
        />
      </form>
      <QuestionTable questions={questions} handleDelete={handleDelete} />
    </section>
  );
};

export default QuestionsList;
