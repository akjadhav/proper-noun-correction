import whisper
import io

model = whisper.load_model("base")

def transcribe_audio(audio_bytes: bytes) -> str:
    audio = io.BytesIO(audio_bytes)
    result = model.transcribe(audio)
    return result["text"]