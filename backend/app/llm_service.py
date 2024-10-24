# llm_service.py
import openai
from dotenv import load_dotenv
import os
from pathlib import Path
from .cache import get_cached_correction, set_cached_correction
import logging

logger = logging.getLogger(__name__)

dotenv_path = Path('../../.env')
load_dotenv(dotenv_path=dotenv_path)

OPEN_AI_KEY = os.getenv('OPEN_AI_KEY')

openai.api_key = OPEN_AI_KEY

def correct_proper_nouns(text: str) -> str:
    # Split text into words, keeping track of positions
    import re
    words = re.findall(r'\b\w+\b', text)
    separators = re.split(r'\b\w+\b', text)

    # Initialize corrected words list
    corrected_words = []
    uncached_words = []

    # Identify uncached words and get cached corrections
    for word in words:
        cached_correction = get_cached_correction(word.lower())
        if cached_correction:
            corrected_word = cached_correction.decode('utf-8')
            corrected_words.append(corrected_word)
        else:
            corrected_words.append(None)
            uncached_words.append(word)

    # If there are uncached words, send them to the LLM for correction
    if uncached_words:
        # Create a prompt with uncached words
        words_to_correct = ', '.join(uncached_words)
        prompt = f"""
        The following words have been transcribed from speech. Identify any proper nouns that may have been transcribed incorrectly and provide corrected versions.

        Words: {words_to_correct}

        Corrected Words (provide a comma-separated list in the same order):
        """

        try:
            response = openai.Completion.create(
                model="text-davinci-003",
                prompt=prompt,
                max_tokens=50,
                temperature=0.3,
            )
            corrected_response = response.choices[0].text.strip()
            corrected_list = [word.strip() for word in corrected_response.split(',')]

            if len(corrected_list) != len(uncached_words):
                logger.error("Mismatch between number of input words and corrected words.")
                return text  # Fallback to original text if mismatch

            # Update the corrected_words list and cache
            idx = 0
            for i, corrected_word in enumerate(corrected_words):
                if corrected_word is None:
                    # Update with corrected word
                    corrected_word = corrected_list[idx]
                    corrected_words[i] = corrected_word
                    # Update cache
                    set_cached_correction(uncached_words[idx].lower(), corrected_word)
                    idx += 1

        except Exception as e:
            logger.error(f"Error during LLM correction: {e}")
            return text  # Fallback to original text if correction fails

    # Reconstruct the corrected text
    corrected_text = ''
    for sep, word in zip(separators, corrected_words + ['']):
        corrected_text += sep + word

    return corrected_text
