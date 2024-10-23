# backend/app/main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from whisper_service import transcribe_audio
from llm_service import correct_proper_nouns
import uvicorn

app = FastAPI()

# Allow CORS for frontend localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcription = transcribe_audio(audio_bytes)
    corrected_text = correct_proper_nouns(transcription)
    return {"transcription": corrected_text}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)