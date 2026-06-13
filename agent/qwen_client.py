import os
import json
import asyncio
import urllib.request
import urllib.error
from dotenv import load_dotenv
from agent.config import (
    QWEN_RETRIES,
    QWEN_RETRY_DELAY,
    QWEN_TIMEOUT,
    QWEN_MAX_CONCURRENT,
    FAST_MODE,
)

load_dotenv()

MAX_CONTENT_PER_MESSAGE = 8_000 if FAST_MODE else 16_000
MAX_TOTAL_INPUT_CHARS = 400_000 if FAST_MODE else 900_000

RETRYABLE_HTTP_CODES = (429, 502, 503, 504)

_qwen_semaphore = asyncio.Semaphore(QWEN_MAX_CONCURRENT)


def sanitize_messages(messages: list) -> list:
    """Ensure Qwen receives valid non-empty, bounded message content."""
    sanitized = []

    for msg in messages:
        clean = dict(msg)
        content = clean.get("content")

        if content is None:
            content = ""
        elif not isinstance(content, str):
            content = json.dumps(content, ensure_ascii=False)

        if not content.strip():
            if clean.get("tool_calls"):
                content = "Calling tools."
            elif clean.get("role") == "tool":
                content = "Tool returned no data."
            else:
                content = "Continue."

        if len(content) > MAX_CONTENT_PER_MESSAGE:
            content = content[:MAX_CONTENT_PER_MESSAGE] + "\n...[truncated]"

        clean["content"] = content
        sanitized.append(clean)

    total = sum(len(m.get("content", "")) for m in sanitized)
    while total > MAX_TOTAL_INPUT_CHARS and len(sanitized) > 2:
        removed = False
        for i in range(1, len(sanitized) - 1):
            if sanitized[i].get("role") in ("tool", "assistant"):
                total -= len(sanitized[i].get("content", ""))
                sanitized.pop(i)
                removed = True
                break
        if not removed:
            break

    return sanitized


def _is_retryable_error(exc: Exception) -> bool:
    message = str(exc)
    return any(f"HTTP {code}" in message for code in RETRYABLE_HTTP_CODES)


async def call_qwen_api(
    messages: list,
    tools: list = None,
    temperature: float = 0.1,
    timeout: float = 180.0,
) -> dict:
    """POST to Qwen chat/completions API."""
    qwen_api_key = os.getenv("QWEN_API_KEY")
    qwen_base_url = os.getenv("QWEN_BASE_URL")
    qwen_model = os.getenv("QWEN_MODEL", "qwen3.6-plus")

    if not qwen_api_key:
        raise ValueError("QWEN_API_KEY environment variable is not set.")
    if not qwen_base_url:
        raise ValueError("QWEN_BASE_URL environment variable is not set.")

    url = f"{qwen_base_url.rstrip('/')}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {qwen_api_key}",
    }

    safe_messages = sanitize_messages(messages)
    if not safe_messages:
        raise ValueError("No messages to send to Qwen API.")

    payload = {
        "model": qwen_model,
        "messages": safe_messages,
        "temperature": temperature,
    }
    if tools:
        payload["tools"] = tools

    def _execute():
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8") if e else ""
            print(f"  ❌ Qwen API HTTP error {e.code}: {error_body}")
            raise Exception(f"HTTP {e.code}: {error_body or e.reason}")
        except Exception as e:
            print(f"  ❌ Qwen API network/connection error: {e}")
            raise

    return await asyncio.to_thread(_execute)


async def call_qwen_with_retry(
    messages: list,
    tools: list = None,
    temperature: float = 0.1,
    retries: int = QWEN_RETRIES,
    delay: float = QWEN_RETRY_DELAY,
    timeout: float = QWEN_TIMEOUT,
) -> dict:
    """Retry wrapper with concurrency limit and exponential backoff for 503/502."""
    last_error = None

    for attempt in range(retries):
        try:
            async with _qwen_semaphore:
                return await call_qwen_api(messages, tools, temperature, timeout)
        except Exception as e:
            last_error = e
            retryable = _is_retryable_error(e)
            print(
                f"    ⚠️ Qwen API call failed (attempt {attempt + 1}/{retries}): {e}"
            )
            if attempt < retries - 1:
                wait = delay * (2 ** attempt) if retryable else delay
                print(f"    ↳ Retrying in {wait:.0f}s...")
                await asyncio.sleep(wait)
            else:
                raise

    raise last_error  # unreachable, satisfies type checker
