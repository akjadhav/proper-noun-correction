from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .llm_service import correct_proper_nouns
from .whisper_service import transcribe_pcm_audio
import logging
import uvicorn

logger = logging.getLogger("uvicorn.error")

app = FastAPI()

origins = ["http://localhost:3000", "chrome-extension://edgnellndheplnpmnnfhhjmifdmpeooh"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe_pcm")
async def transcribe_pcm(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        transcription = transcribe_pcm_audio(audio_bytes)
        corrected_text = correct_proper_nouns(transcription)
        return {"transcription": corrected_text}
    except Exception as e:
        logger.exception("Error during PCM transcription")
        return JSONResponse(
            status_code=500,
            content={"error": f"An error occurred during PCM transcription: {str(e)}"},
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)