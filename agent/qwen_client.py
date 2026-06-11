import os
import json
import asyncio
import urllib.request
import urllib.error
from dotenv import load_dotenv

# Ensure dotenv is loaded immediately when this module is imported
load_dotenv()

async def call_qwen_api(messages: list, tools: list = None, temperature: float = 0.1) -> dict:
    """Make an asynchronous POST request via standard urllib in an executor thread to ensure non-blocking event loop"""
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
        "Authorization": f"Bearer {qwen_api_key}"
    }

    payload = {
        "model": qwen_model,
        "messages": messages,
        "temperature": temperature
    }
    if tools:
        payload["tools"] = tools

    def _execute():
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8") if e else ""
            print(f"  ❌ Qwen API HTTP error {e.code}: {error_body}")
            raise Exception(f"HTTP {e.code}: {error_body or e.reason}")
        except Exception as e:
            print(f"  ❌ Qwen API network/connection error: {e}")
            raise

    return await asyncio.to_thread(_execute)

async def call_qwen_with_retry(messages: list, tools: list = None, temperature: float = 0.1, retries: int = 3, delay: float = 5.0) -> dict:
    """Robust retry wrapper for Qwen API requests with network recovery"""
    for attempt in range(retries):
        try:
            return await call_qwen_api(messages, tools, temperature)
        except Exception as e:
            print(f"    ⚠️ Qwen API call failed (attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                await asyncio.sleep(delay)
            else:
                raise
