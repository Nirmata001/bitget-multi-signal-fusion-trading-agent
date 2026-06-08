import asyncio
import os
from dotenv import load_dotenv
from agent.agent import run_agent_cycle

load_dotenv()

async def main():
    coin = os.getenv("DEFAULT_COIN", "BTC")
    await run_agent_cycle(coin)

if __name__ == "__main__":
    asyncio.run(main())
