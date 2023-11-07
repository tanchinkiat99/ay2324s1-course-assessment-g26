'use client';
import { getQuestionById } from '@app/api/questionService';
import { parse } from 'postcss';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import axios from 'axios';

const QuestionCard = ({ questionId }) => {
  const [error, setError] = useState('');
  const [question, setQuestion] = useState({
    title: '',
    description: '',
    categories: '',
    complexity: '',
  });
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    const parseMarkdown = async (description) => {
      // Use remark to convert markdown into HTML string
      const processedContent = await remark()
        .use(gfm)
        .use(html)
        .process(description);
      const contentHtml = processedContent.toString();
      // console.log(description);
      // console.log(contentHtml);
      setContentHtml(contentHtml);
    };

    const getQuestionDetails = async () => {
      try {
        // console.log({ questionId });
        const res = await axios.get(`/api/questions/${questionId}`);
        setQuestion({
          title: res.data.title,
          description: res.data.description,
          categories: res.data.categories,
          complexity: res.data.complexity,
        });
        parseMarkdown(res.data.description);
      } catch (error) {
        setError(error.message);
      }
    };

    if (questionId) {
      getQuestionDetails();
    }
  }, [questionId]);
  const colour =
    question.complexity === 'Easy'
      ? 'text-green-500'
      : question.complexity === 'Medium'
      ? 'text-yellow-500'
      : 'text-red-500';

  return (
    <section className="overflow-auto">
      {error && <p>{error}</p>}
      <span className="font-semibold text-base text-lg">{question.title}</span>
      <div className={colour}>{question.complexity}</div>
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </section>
  );
};

export default QuestionCard;
