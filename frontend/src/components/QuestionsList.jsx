'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionRow from './QuestionRow';

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
      const response = await fetch('http://localhost:5000/questions');
      const data = await response.json();
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this question?');
    if (confirmed) {
      try {
        await fetch(`http://localhost:5000/questions/${id}`, {
          method: 'DELETE',
        });
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
