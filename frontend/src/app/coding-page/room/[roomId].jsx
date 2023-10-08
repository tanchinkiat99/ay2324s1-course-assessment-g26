// This is the page that is shown when people get matched. 
// Shows the question, a collaborative code editor and a chat box.

import { useRouter } from 'next/navigation';

import CodeEditor from '@components/CodeEditor';

function CodingSession() {
  const router = useRouter();
  const { roomId } = router.query;  // Extracting roomId from the URL

  // Later on, you might want to use this roomId to fetch room-specific data

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid black' }}>
        <h1>Title: Sample Problem</h1>
        <p>Description: Here's a sample problem description. Solve XYZ using ABC method.</p>
        <p>Categories: Algorithms, Arrays</p>
        <p>Complexity: Medium</p>
      </div>
      <div style={{ flex: 2, padding: '20px' }}>
        <h2>Editor</h2>
        <CodeEditor roomId={roomId} /> {/* Passing roomId as a prop to CollaborativeEditor */}
      </div>
    </div>
  );
}

export default CodingSession;