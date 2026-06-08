import asyncio
import random
from google.genai.errors import APIError, ClientError, ServerError

async def generate_content_with_retry(
    ai_client,
    model: str,
    contents,
    config=None,
    max_retries: int = 5,
    initial_delay: float = 4.0
):
    """
    Calls the Gemini API to generate content with exponential backoff and random jitter.
    Automatically catches and retries 429 rate limit / quota, 503 unavailable, and 500 internal errors.
    Uses asyncio.to_thread (via loop.run_in_executor) to ensure the synchronous SDK request
    does not block the asyncio event loop.
    """
    delay = initial_delay
    for attempt in range(max_retries):
        try:
            loop = asyncio.get_running_loop()
            # Execute the synchronous generate_content call in a thread pool to avoid blocking the event loop
            response = await loop.run_in_executor(
                None,
                lambda: ai_client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=config
                )
            )
            return response
        except (ClientError, ServerError, APIError, Exception) as e:
            status_code = getattr(e, "status_code", None)
            err_msg = str(e).lower()
            
            # Identify if the exception is retriable
            is_retriable = False
            if status_code in [429, 500, 503]:
                is_retriable = True
            elif any(word in err_msg for word in ["quota", "rate limit", "exhausted", "unavailable", "demand", "resource_exhausted"]):
                is_retriable = True
                
            if is_retriable and attempt < max_retries - 1:
                jitter = random.uniform(0.8, 1.5)
                sleep_time = delay * jitter
                print(f"      ⚠️  Gemini API error (Status: {status_code}, Attempt {attempt + 1}/{max_retries}) - Retrying in {sleep_time:.2f}s... Details: {e}")
                await asyncio.sleep(sleep_time)
                delay *= 2  # Exponential backoff
            else:
                # Retries exhausted or non-retriable error (e.g. 400 Invalid Argument)
                raise e
