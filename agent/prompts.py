from agent.prompts_stock import ANALYST_STOCK_PROMPTS, STOCK_SYNTHESIS_PROMPT
from agent.prompts_crypto import ANALYST_CRYPTO_PROMPTS, CRYPTO_SYNTHESIS_PROMPT

def is_crypto(symbol: str) -> bool:
    if not isinstance(symbol, str):
        return False
    sym = symbol.strip().upper().replace("/", "")
    # Known crypto base/quote sets
    crypto_bases = {
        "BTC", "ETH", "SOL", "BNB", "XRP", "DOGE", "ADA", "DOT", "LINK", "LTC", 
        "UNI", "AVAX", "NEAR", "PEPE", "SHIB", "TRX", "TON", "SUI", "USDT", "USDC",
        "MATIC", "ICP", "DAI", "BCH", "FIL", "VET", "XLM", "LDO", "ARB", "OP", "FDUSD",
        "WIF", "BONK", "FLOKI", "ORDI", "RUNE", "AAVE", "MKR", "GRT", "LTC"
    }
    if sym in crypto_bases:
        return True
    # If starts with a known crypto base and ends with a typical quote currency (e.g., BTCUSDT, ETHBTC)
    for base in crypto_bases:
        if sym.startswith(base) and sym[len(base):] in {"USDT", "USDC", "USD", "BUSD", "BTC", "ETH"}:
            return True
    return False

def get_analyst_prompt_template(analyst_key: str, coin: str, category: str = None) -> str:
    """Returns the correct analyst prompt template based on category or whether the coin is a cryptocurrency or stock."""
    cat = (category or "").strip().lower()
    if cat == "crypto":
        return ANALYST_CRYPTO_PROMPTS.get(analyst_key, "")
    elif cat == "stocks":
        return ANALYST_STOCK_PROMPTS.get(analyst_key, "")

    if is_crypto(coin):
        return ANALYST_CRYPTO_PROMPTS.get(analyst_key, ANALYST_STOCK_PROMPTS.get(analyst_key, ""))
    else:
        return ANALYST_STOCK_PROMPTS.get(analyst_key, "")

def get_synthesis_prompt_template(coin: str, category: str = None) -> str:
    """Returns the correct synthesis prompt template based on category or whether the coin is a cryptocurrency or stock."""
    cat = (category or "").strip().lower()
    if cat == "crypto":
        return CRYPTO_SYNTHESIS_PROMPT
    elif cat == "stocks":
        return STOCK_SYNTHESIS_PROMPT

    if is_crypto(coin):
        return CRYPTO_SYNTHESIS_PROMPT
    else:
        return STOCK_SYNTHESIS_PROMPT

# Keep the original exports pointing to stock defaults for backward compatibility
ANALYST_PROMPTS = ANALYST_STOCK_PROMPTS
SYNTHESIS_PROMPT = STOCK_SYNTHESIS_PROMPT
