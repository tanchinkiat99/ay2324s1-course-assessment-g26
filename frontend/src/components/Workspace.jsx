import QuestionCard from '@components/QuestionCard';

const Workspace = ({ questionId }) => {
  return (
    <div className="flex w-full h-screen">
      <QuestionCard questionId={questionId} />
      <div className="w-1/2">Code Editor</div>
    </div>
  );
};

export default Workspace;
