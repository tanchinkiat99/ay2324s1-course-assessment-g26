import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const QuestionRow = ({ question, handleDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const handleEditClick = () => {
    setShowEditForm(!showEditForm);
  };
  return (
    <tr>
      <td>
        <p>{question.title}</p>
      </td>
      <td>
        <p>{question.complexity}</p>
      </td>
      <td>
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={() => handleDelete(question._id)}>Delete</button>
      </td>
    </tr>
  );
};

export default QuestionRow;
