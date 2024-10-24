import React from 'react';

interface Props {
  transcription: string;
}

const TranscriptionDisplay: React.FC<Props> = ({ transcription = '' }) => {
  // regex to identify capitalized words as potential proper nouns

  if (!transcription) {
    return <div>No transcription available.</div>;
  }

  const words = transcription.split(' ').map((word, index) => {
    const isProperNoun = /^[A-Z][a-z]+$/.test(word);
    return (
      <span
        key={index}
        style={
          isProperNoun ? { textDecoration: 'underline', cursor: 'pointer' } : {}
        }>
        {word + ' '}
      </span>
    );
  });

  return <div>{words}</div>;
};

export default TranscriptionDisplay;
