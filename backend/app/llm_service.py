import openai
from dotenv import load_dotenv
from cache import get_cached_correction, set_cached_correction

dotenv_path = Path('../../.env')
load_dotenv(dotenv_path=dotenv_path)

OPEN_AI_KEY = os.getenv('OPEN_AI_KEY')

openai.api_key = OPEN_AI_KEY

def correct_proper_nouns(text: str) -> str:
    # checks cached first
    cached = get_cached_correction(text)
    if cached:
        return cached

    prompt = f"""
    The following text has been transcribed from speech. Identify any proper nouns that may have been transcribed incorrectly and provide a corrected version of the text.

    Text: "{text}"

    Corrected Text:
    """

    response = openai.Completion.create(
        engine="gpt-4o-mini",
        prompt=prompt,
        max_tokens=150,
        temperature=0.3,
    )

    corrected_text = response.choices[0].text.strip()
    
    # Cache the result
    set_cached_correction(text, corrected_text)
    
    return corrected_text
