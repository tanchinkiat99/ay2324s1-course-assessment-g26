import { useEffect, useRef } from 'react';
import { initYjs, getYText } from '../utils/yjsSetup';

export default function CollaborativeEditor() {
  const editorRef = useRef(null);

  useEffect(() => {
    initYjs('demo-room');
    const ytext = getYText();

    // Listen to updates from ytext and update textarea
    const updateHandler = () => {
        editorRef.current.value = ytext.toString();
      };
      ytext.observe(updateHandler);
      updateHandler();  // initialize
  
      // Listen to updates from textarea and update ytext
      editorRef.current.addEventListener('input', () => {
        const inputValue = editorRef.current.value;
        ytext.delete(0, ytext.length); // Clear existing text
        ytext.insert(0, inputValue);  // Insert new text       
      });
    
  }, []);

  return (
    <textarea ref={editorRef}></textarea> // Placeholder; replace this with your code editor component
  );
}
