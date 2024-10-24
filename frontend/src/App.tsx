import React, { useState } from 'react';
import AudioInput from './components/AudioInput';
import TranscriptionDisplay from './components/TranscriptionDisplay';

const App: React.FC = () => {
  const [transcription, setTranscription] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const appStyle = {
    padding: '20px',
    width: '300px',
    fontFamily: 'Arial, sans-serif',
  };

  const headingStyle = {
    textAlign: 'center' as const,
    marginBottom: '20px',
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '10px',
    width: '100%',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer' as const,
  };

  const snackbarStyle = {
    position: 'fixed' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div style={appStyle}>
      <h1 style={headingStyle}>Proper Noun Correction Dictation</h1>
      <AudioInput onTranscription={setTranscription} />
      {transcription && (
        <>
          <TranscriptionDisplay transcription={transcription} />
          <button
            style={buttonStyle}
            onClick={handleCopy}>
            Copy Transcription
          </button>
        </>
      )}
      {copySuccess && (
        <div style={snackbarStyle}>Transcription copied to clipboard!</div>
      )}
    </div>
  );
};

export default App;
