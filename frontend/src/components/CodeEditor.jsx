import ReactAce from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { useEffect, useRef } from 'react';
import { initYjs, getYText } from '@utils/yjsSetup';

export default function CodeEditor({ roomId = 'demo-room' }) {
  const editorRef = useRef(null);
  console.log(roomId);

  const { ydoc, ytext } = initYjs(roomId);

  useEffect(() => {
    //initYjs(roomId);
    //const ytext = getYText();
    let isSyncing = false; // Flag to check if syncing is ongoing

    // Initialize Ace Editor from Yjs
    const editor = editorRef.current.editor;
    editor.setValue(ytext.toString());

    // Update Ace editor when ytext changes
    ytext.observe(() => {
      if (isSyncing) return; // Skip if we are currently syncing
      isSyncing = true; // Set flag to true

      // Store cursor position and selection
      const cursorPosition = editor.getCursorPosition();
      const selection = editor.selection.toJSON();

      editor.setValue(ytext.toString());

      // Restore cursor position and selection
      editor.moveCursorToPosition(cursorPosition);
      editor.selection.fromJSON(selection);

      isSyncing = false; // Reset flag
    });

    // Observe Ace Editor changes and update Yjs
    editor.getSession().on('change', () => {
      if (isSyncing) return; // Skip if we are currently syncing
      isSyncing = true; // Set flag to true
      const inputValue = editor.getValue();
      ytext.delete(0, ytext.length); // Clear existing text
      ytext.insert(0, inputValue); // Insert new text
      isSyncing = false; // Reset flag
    });

    // return () => {
    //   ydoc.destroy();
    // };
  }, [roomId, ytext]);

  return (
    <ReactAce
      mode="python"
      theme="monokai"
      ref={editorRef}
      // your other ace editor options here
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
    />
  );
}
