'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionRow from './QuestionRow';

const QuestionTable = ({ data }) => {
  const router = useRouter();
  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`http://localhost:5000/questions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Trigger refetch
        setShouldRefetch(true);
      } else {
        console.error('Failed to delete question');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
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
          {data.map((question) => (
            <QuestionRow question={question} handleDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </section>
  );
};

const QuestionsList = () => {
  const [searchText, setSearchText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(true); // Refetch trigger
  const handleSearchChange = (e) => {};

  // Get all questions as soon as page loads
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://localhost:5000/questions');
      const data = await response.json();
      setQuestions(data);
    };
    fetchQuestions();
    // Reset refetch trigger
    if (shouldRefetch) {
      fetchQuestions();
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

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
      <QuestionTable data={questions} />
    </section>
  );
};

export default QuestionsList;
