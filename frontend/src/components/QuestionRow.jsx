import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const QuestionRow = ({
  question,
  // handleQuestionClick,
  // handleEdit,
  // handleDelete
}) => {
  return (
    <tr>
      <td>
        <p>{question.title}</p>
      </td>
      <td>
        <p>{question.complexity}</p>
      </td>
      <td>
        {' '}
        <p>Actions</p>
      </td>
    </tr>
  );
};

export default QuestionRow;
