import React from 'react';

interface Props {
  transcription: string;
}

const TranscriptionDisplay: React.FC<Props> = ({ transcription = '' }) => {
  if (!transcription) {
    return <div>No transcription available.</div>;
  }

  const containerStyle = {
    padding: '15px',
    marginTop: '20px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
  };

  const wordStyle = {
    marginRight: '4px',
  };

  const properNounStyle = {
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  const words = transcription.split(' ').map((word, index) => {
    const isProperNoun = /^[A-Z][a-z]+$/.test(word);
    return (
      <span
        key={index}
        style={{
          ...wordStyle,
          ...(isProperNoun ? properNounStyle : {}),
        }}>
        {word}
      </span>
    );
  });

  return <div style={containerStyle}>{words}</div>;
};

export default TranscriptionDisplay;
