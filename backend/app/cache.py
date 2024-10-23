import redis
import os

redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0)

def get_cached_correction(text: str) -> str:
    return redis_client.get(text)

def set_cached_correction(text: str, corrected_text: str):
    redis_client.set(text, corrected_text, ex=3600)  # cache for 1 hour