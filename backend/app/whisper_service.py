import whisper
import numpy as np
import logging

logger = logging.getLogger(__name__)

model = whisper.load_model("base")  # 'tiny', 'base', 'small', etc.

def transcribe_pcm_audio(audio_bytes: bytes) -> str:
    try:
        # Convert bytes to NumPy array
        audio_array = np.frombuffer(audio_bytes, dtype=np.float32)
        
        # Ensure the array is not empty
        if audio_array.size == 0:
            raise ValueError("Received empty audio data")

        # Whisper expects audio sampled at 16000 Hz
        sample_rate = 44100 

        # Resample to 16000 Hz if necessary
        if sample_rate != 16000:
            import resampy
            audio_array = resampy.resample(audio_array, sr_orig=sample_rate, sr_new=16000)

        # Transcribe using Whisper
        result = model.transcribe(audio_array, fp16=False)
        return result["text"]
    except Exception as e:
        logger.exception("Error during PCM transcription")
        raise e
