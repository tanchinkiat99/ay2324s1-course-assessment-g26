import Workspace from '@components/Workspace';

const page = ({ params }) => {
  return (
    <div>
      <Workspace questionId={params.id} />
    </div>
  );
};

export default page;
