import React, { useState } from 'react';
import axios from 'axios';

const AudioInput: React.FC<{ onTranscription: (text: string) => void }> = ({
  onTranscription,
}) => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Float32Array[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [scriptProcessor, setScriptProcessor] =
    useState<ScriptProcessorNode | null>(null);
  const [processing, setProcessing] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      setAudioContext(context);

      const input = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
      setScriptProcessor(processor);

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        setAudioChunks((prev) => [...prev, new Float32Array(channelData)]);
      };

      input.connect(processor);
      processor.connect(context.destination);

      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (scriptProcessor && audioContext) {
      scriptProcessor.disconnect();
      audioContext.close();

      // Combine audio chunks
      const combinedData = mergeBuffers(audioChunks);

      // Convert Float32Array to Blob
      const audioBlob = new Blob([combinedData.buffer], {
        type: 'application/octet-stream',
      });

      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.pcm');

      // Send to backend
      setProcessing(true);
      axios
        .post('http://localhost:8000/transcribe_pcm', formData)
        .then((response) => {
          onTranscription(response.data.transcription);
        })
        .catch((error) => {
          console.error('Transcription error:', error);
        })
        .finally(() => {
          setProcessing(false);
        });

      setRecording(false);
      setAudioChunks([]);
    }
  };

  const mergeBuffers = (audioData: Float32Array[]) => {
    const length = audioData.reduce((total, chunk) => total + chunk.length, 0);
    const result = new Float32Array(length);
    let offset = 0;
    for (const chunk of audioData) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: recording ? '#dc004e' : '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer' as const,
  };

  const processingStyle = {
    textAlign: 'center' as const,
    marginTop: '10px',
  };

  return (
    <>
      <button
        style={buttonStyle}
        onClick={recording ? stopRecording : startRecording}
        disabled={processing}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {processing && (
        <div style={processingStyle}>
          <div>Processing transcription...</div>
        </div>
      )}
    </>
  );
};

export default AudioInput;
