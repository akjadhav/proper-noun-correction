import React, { useState } from 'react';
import axios from 'axios';

const AudioInput: React.FC<{ onTranscription: (text: string) => void }> = ({
  onTranscription,
}) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    recorder.start();
    setRecording(true);

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');

      try {
        const response = await axios.post(
          'http://localhost:8000/transcribe',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        onTranscription(response.data.transcription);
      } catch (error) {
        console.error('Transcription error:', error);
      }
    };
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default AudioInput;
