// frontend/src/App.tsx
import React, { useState } from 'react';
import AudioInput from './components/AudioInput';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import './styles.css';

const App: React.FC = () => {
  const [transcription, setTranscription] = useState('');

  return (
    <div className='App'>
      <h1>Proper Noun Correction Dictation</h1>
      <AudioInput onTranscription={setTranscription} />
      <TranscriptionDisplay transcription={transcription} />
    </div>
  );
};

export default App;
