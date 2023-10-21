'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllQuestions, deleteQuestion } from '@app/api/questionService';

const QuestionTable = ({ questions, handleDelete }) => {
  const router = useRouter();

  const handleEdit = (id) => {
    // Direct to edit form
    router.push(`/edit-question/?id=${id}`);
  };

  return (
    <section id="question-list">
      <div className="relative overflow-x-auto mx-auto px-6 pb-10">
        <table className="text-sm text-left w-full mx-auto">
          <thead className="text-xs uppercase border-b ">
            <tr>
              {/* <th scope='col' className='px-1 py-3 w-0 font-medium'>
                Attempted
              </th> */}
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Title
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium ">
                Complexity
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Categories
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, idx) => {
              const colour =
                question.complexity === 'Easy'
                  ? 'text-green-500'
                  : question.complexity === 'Medium'
                  ? 'text-yellow-500'
                  : 'text-red-500';
              return (
                <tr
                  className={`${idx % 2 == 1 ? 'bg-gray-100' : ''}`}
                  key={question.id}
                >
                  <td className="px-6 py-3">
                    <Link
                      className="hover:text-blue-600 cursor-pointer"
                      href={`questions/${question._id}`}
                    >
                      {question.title}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <p className={`${colour}`}>{question.complexity}</p>
                  </td>
                  <td className="px-6 py-3">
                    {question.categories.join(', ')}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex space-x-4">
                      <p
                        className="font-inter text-sm cursor-pointer text-green-500"
                        onClick={() => handleEdit(question._id)}
                      >
                        Edit
                      </p>
                      <p
                        className="font-inter text-sm cursor-pointer text-orange-500"
                        onClick={() => handleDelete(question._id)}
                      >
                        Delete
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const QuestionsList = () => {
  // const [searchText, setSearchText] = useState('');
  const [questions, setQuestions] = useState([]);
  // const handleSearchChange = (e) => {};

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
      {/* <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search question by title"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer mt-10"
        />
      </form> */}
      <QuestionTable questions={questions} handleDelete={handleDelete} />
    </section>
  );
};

export default QuestionsList;
