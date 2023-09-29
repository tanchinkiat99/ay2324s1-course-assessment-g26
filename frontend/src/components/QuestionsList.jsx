'use client';
import { useState, useEffect } from 'react';
import QuestionRow from './QuestionRow';

const QuestionTable = ({ data }) => {
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
            <QuestionRow question={question} />
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
      <QuestionTable data={questions} handleQuestionClick={() => {}} />
    </section>
  );
};

export default QuestionsList;
