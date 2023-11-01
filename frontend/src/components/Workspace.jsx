import QuestionCard from '@components/QuestionCard';
import CodeEditor from '@components/CodeEditor';

const Workspace = ({ questionId, roomId, language }) => {
  console.log(
    'We are now in room:',
    roomId,
    'doing question:',
    questionId,
    'using language:',
    language
  );
  return (
    <div className="flex w-full h-screen">
      <QuestionCard questionId={questionId} />
      <div className="w-1/2">
        <CodeEditor roomId={roomId} language={language}/>
      </div>
    </div>
  );
};

export default Workspace;
