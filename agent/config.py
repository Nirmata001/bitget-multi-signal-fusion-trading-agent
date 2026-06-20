import os
from dotenv import load_dotenv

load_dotenv()

# Speed vs quality tradeoff (set AGENT_FAST_MODE=true in .env for faster runs)
FAST_MODE_DEFAULT = os.getenv("AGENT_FAST_MODE", "true").lower() in ("1", "true", "yes")

def is_fast_mode() -> bool:
    return os.getenv("AGENT_FAST_MODE", "true" if FAST_MODE_DEFAULT else "false").lower() in ("1", "true", "yes")

def get_max_iterations() -> int:
    return int(os.getenv("AGENT_MAX_ITERATIONS", "2" if is_fast_mode() else "4"))

def get_qwen_timeout() -> float:
    return float(os.getenv("QWEN_TIMEOUT", "90" if is_fast_mode() else "180"))

def get_max_tool_result_chars() -> int:
    return 6_000 if is_fast_mode() else 12_000

def get_max_content_per_message() -> int:
    return 8_000 if is_fast_mode() else 16_000

def get_max_total_input_chars() -> int:
    return 400_000 if is_fast_mode() else 900_000

def get_max_tools_per_round() -> int:
    return int(os.getenv("AGENT_MAX_TOOLS_PER_ROUND", "2" if is_fast_mode() else "4"))

FAST_MODE = FAST_MODE_DEFAULT
MAX_ITERATIONS = int(os.getenv("AGENT_MAX_ITERATIONS", "2" if FAST_MODE else "4"))
MAX_TOOLS_PER_ROUND = int(os.getenv("AGENT_MAX_TOOLS_PER_ROUND", "2"))
QWEN_RETRIES = int(os.getenv("QWEN_RETRIES", "4"))
QWEN_RETRY_DELAY = float(os.getenv("QWEN_RETRY_DELAY", "3"))
QWEN_TIMEOUT = float(os.getenv("QWEN_TIMEOUT", "90" if FAST_MODE else "180"))
# Limit parallel Qwen calls — prevents 503 from overwhelming the upstream API
QWEN_MAX_CONCURRENT = int(os.getenv("QWEN_MAX_CONCURRENT", "2"))
ANALYST_STAGGER_SECONDS = float(os.getenv("ANALYST_STAGGER_SECONDS", "2"))

# Fewer tools exposed to the model = faster tool selection and smaller payloads
FAST_ANALYST_TOOLS = {
    "macro": ["macro_indicators", "cross_asset"],
    "sentiment": ["sentiment_index", "derivatives_sentiment"],
    "market_intel": ["crypto_market", "crypto_price"],
    "news": ["news_feed", "social_trending"],
}

SPEED_INSTRUCTION = (
    "\n\nSPEED RULES: Call at most 2 tools total, then output the JSON immediately. "
    "Do not call tools repeatedly. Be concise."
)
