import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const QuestionRow = ({ question, handleEdit, handleDelete }) => {
  return (
    <tr>
      <td>
        <Link
          className="hover:text-blue-600 cursor-pointer"
          href={`questions/${question.id}`}
        >
          {question.title}
        </Link>
      </td>
      <td>
        <p>{question.complexity}</p>
      </td>
      <td>
        <p>{question.categories}</p>
      </td>
      <td>
        <div>
          <p
            className="font-inter text-sm cursor-pointer green_gradient"
            onClick={() => handleEdit(question._id)}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm cursor-pointer orange_gradient"
            onClick={() => handleDelete(question._id)}
          >
            Delete
          </p>
        </div>
      </td>
    </tr>
  );
};

export default QuestionRow;
