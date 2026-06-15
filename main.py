import asyncio
import os
import sys

if sys.platform == "win32":
    os.environ.setdefault("PYTHONUTF8", "1")
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

from dotenv import load_dotenv
from agent.agent import run_agent_cycle

load_dotenv()

async def main():
    coin = os.getenv("DEFAULT_COIN", "AAPL")
    await run_agent_cycle(coin)

if __name__ == "__main__":
    asyncio.run(main())
