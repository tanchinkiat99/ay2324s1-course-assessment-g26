'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const QuestionTable = ({
  questions,
  handleCategoryClick,
  handleDelete,
  role_type,
}) => {
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
              {role_type == 'maintainer' && (
                <th scope="col" className="px-6 py-3 w-0 font-medium">
                  Actions
                </th>
              )}
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
                  key={idx}
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
                    {question.categories
                      .slice()
                      .sort()
                      .map((category, index) => (
                        <span
                          key={index}
                          className="hover:text-blue-600 cursor-pointer"
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category}
                          {index < question.categories.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                  </td>

                  {role_type == 'maintainer' && (
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
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const QuestionsList = ({ role_type }) => {
  // Search states
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [complexityFilter, setComplexityFilter] = useState('all');

  const [questions, setQuestions] = useState([]);
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      setQuestions(
        response.data.sort(
          (a, b) =>
            difficultyOrder[a.complexity] - difficultyOrder[b.complexity]
        )
      );
    } catch (error) {
      console.error('Error:', error);
      console.error('Error Details:', error.response?.data);
    }
    // const data = await getAllQuestions();
    // console.log(data);
    // setQuestions(data);
  };
  // Get all questions as soon as page loads
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Search by title or category
  const filterQuestions = (searchText) => {
    const terms = searchText.split(/\s+/).filter((term) => term.length > 0);
    return questions.filter(
      (question) =>
        (complexityFilter === 'all' ||
          question.complexity === complexityFilter) &&
        terms.every((term) => {
          const regex = new RegExp(term, 'i');
          return (
            regex.test(question.title) ||
            question.categories.some((category) => regex.test(category))
          );
        })
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    // debounce
    setSearchTimeout(
      setTimeout(() => {
        const results = filterQuestions(e.target.value);
        setSearchResults(results);
      }, 500)
    );
  };

  const handleCategoryClick = (categoryName) => {
    setSearchText(categoryName);
    const results = filterQuestions(categoryName);
    setSearchResults(results);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this question?');
    if (confirmed) {
      try {
        const response = await fetch('/api/delete-question', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
          }),
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
          placeholder="Search question by title or category"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer mt-10 pr-8"
        />
        {searchText && (
          <button
            type="button"
            onClick={() => setSearchText('')}
            className="absolute flex inset-y-0 right-0 mt-2 px-4 text-gray-600 hover:text-gray-800"
          >
            &#10005; {/* HTML entity for a cross (✖) */}
          </button>
        )}
        <div className="flex items-center mt-5 mb-5">
          {/* Radio buttons for complexity filter */}
          {['all', 'Easy', 'Medium', 'Hard'].map((level) => (
            <label key={level} className="inline-flex items-center mr-6">
              <input
                type="radio"
                name="complexity"
                value={level}
                checked={complexityFilter === level}
                onChange={(e) => setComplexityFilter(e.target.value)}
                className="form-radio text-blue-600 h-4 w-4"
              />
              <span className="ml-2">
                {level === 'all' ? 'All Complexities' : level}
              </span>
            </label>
          ))}
        </div>
      </form>
      {/* If search, show results*/}
      {searchText ? (
        <QuestionTable
          questions={filterQuestions(searchText)}
          handleCategoryClick={handleCategoryClick}
          handleDelete={handleDelete}
          role_type={role_type}
        />
      ) : (
        <QuestionTable
          questions={
            complexityFilter === 'all'
              ? questions
              : questions.filter((q) => q.complexity === complexityFilter)
          }
          handleCategoryClick={handleCategoryClick}
          handleDelete={handleDelete}
          role_type={role_type}
        />
      )}
    </section>
  );
};

export default QuestionsList;
