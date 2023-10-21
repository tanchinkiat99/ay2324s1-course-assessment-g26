'use client';
import { getQuestionById } from '@app/api/questionService';
import { parse } from 'postcss';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const QuestionCard = ({ questionId }) => {
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
      let markdownString = `
      Write a function that reverses a string. The input string is given as an array of characters \`s\`.
      You must do this by modifying the input array in-place with \`O(1)\` extra memory.
      **Example 1**:
      > Input: s = ["h","e","l","l","o"] 
      > Output: ["o","l","l","e","h"]
      **Example 2**:
      > Input: s = ["H","a","n","n","a","h"] 
      > Output: ["h","a","n","n","a","H"]
      **Constraints**:
      - \`1 <= s.length <= 10^5\` 
      - \`s[i]\` is a printable ascii character
      `;

      const processedContent = await remark()
        .use(gfm)
        .use(html)
        .process(description);
      const contentHtml = processedContent.toString();
      console.log(description);
      console.log(contentHtml);
      setContentHtml(contentHtml);
    };

    const getQuestionDetails = async () => {
      try {
        // console.log({ questionId });
        const data = await getQuestionById(questionId);
        setQuestion({
          title: data.title,
          description: data.description,
          categories: data.categories,
          complexity: data.complexity,
        });
        parseMarkdown(data.description);
      } catch (error) {
        console.log(error);
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
    <section className="w-1/2 overflow-auto">
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
