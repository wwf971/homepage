import React, { useState } from 'react';
import { useNoteStore } from '@/Note.js';
import Root from '@/markdown/Root.jsx';
import Text from '@/markdown/Text.jsx';
import BackToHome from '@/navi/BackToHome.jsx';
import SearchNote from '@/note/SearchNote.jsx';

const TestMarkdown = () => {
  // Zustand actions
  const createNote = useNoteStore((state) => state.createNote);
  const loadNote = useNoteStore((state) => state.loadNote);

  const [demoNoteId, setDemoNoteId] = useState(null);

  const createNewNote = async () => {
    const result = await createNote();
    if (result.is_success) {
      setDemoNoteId(result.data);
    }
  };

  const handleNoteSelect = async (noteId) => {
    // Load the note if it's not already in our store
    const result = await loadNote(noteId);
    if (result.is_success) {
      setDemoNoteId(noteId);
    } else {
      console.error('Failed to load note:', result.message);
    }
  };


  return (
    <>
      <BackToHome />
      
      <Root 
        className="markdown-editor"
        style={{ 
          border: '2px dashed #ccc', 
          padding: '10px', 
          margin: '10px 0',
          minHeight: '40px'
        }}
      >
        <div 
          contentEditable={true}
          suppressContentEditableWarning={true}
          style={{ outline: 'none' }}
        >
          <p>Root.jsx with event delegation (try selecting across components):
            <Text isDebug={true}>First component text</Text>
            <Text isDebug={true}>Second component text</Text>
            <Text isDebug={true}>Third component text</Text>
          </p>
        </div>

      </Root>

      <div style={{ margin: '20px 0' }}>
        <h3>Markdown Editor with Zustand</h3>
        
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={createNewNote} style={{ marginRight: '10px' }}>
            Create New Note
          </button>
          <SearchNote onNoteSelect={handleNoteSelect} />
          <span>Current Note ID: {demoNoteId}</span>
        </div>

        {demoNoteId && (
          <Root 
            noteId={demoNoteId}
            className="markdown-editor"
            style={{ 
              border: '2px solid #007acc', 
              padding: '20px', 
              margin: '10px 0',
              minHeight: '200px',
              backgroundColor: '#fafafa',
              borderRadius: '8px'
            }}
          />
        )}

        <div style={{ marginTop: '30px' }}>
          <h4>Instructions:</h4>
          <ul>
            <li><strong>Enter:</strong> Create new item</li>
            <li><strong>Tab:</strong> Increase indent</li>
            <li><strong>Shift+Tab:</strong> Decrease indent</li>
            <li><strong>Backspace on empty item:</strong> Delete item</li>
            <li><strong>Click to edit:</strong> Edit any item content</li>
          </ul>
        </div>

        <hr style={{ margin: '30px 0' }} />

        <h3>Legacy Text Component Test</h3>
        <p>Normal mode: <Text>Click to edit this text</Text></p>
      </div>
    </>
  );
};


export default TestMarkdown;