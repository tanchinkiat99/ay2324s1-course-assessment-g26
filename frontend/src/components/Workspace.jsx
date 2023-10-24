import QuestionCard from '@components/QuestionCard';
import CodeEditor from '@components/CodeEditor';

const Workspace = ({ questionId, roomId }) => {
  console.log('We are now in room: ', roomId);
  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2">
        <QuestionCard questionId={questionId} />
      </div>
      <div className="w-1/2">
        <CodeEditor roomId={roomId} />
      </div>
    </div>
  );
};

export default Workspace;
