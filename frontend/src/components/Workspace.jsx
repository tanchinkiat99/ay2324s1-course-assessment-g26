import QuestionCard from '@components/QuestionCard';

const Workspace = ({ questionId }) => {
  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2 flex-shrink overflow-auto">
        <QuestionCard questionId={questionId} />
      </div>
      <div className="w-1/2">Code Editor</div>
    </div>
  );
};

export default Workspace;
