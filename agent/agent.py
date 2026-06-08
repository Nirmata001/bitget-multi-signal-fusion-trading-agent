import asyncio
import json
import os
from pathlib import Path
from datetime import datetime, timezone
from google import genai
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client
from dotenv import load_dotenv
from agent.mcp_client import get_all_tools, MCP_SERVER_URL
from agent.specialists import run_all_specialists
from agent.synthesis import synthesize_reports

load_dotenv()

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
DECISIONS_FILE = DATA_DIR / "decisions.json"


def load_decisions() -> list:
    try:
        if DECISIONS_FILE.exists():
            return json.loads(DECISIONS_FILE.read_text())
        return []
    except:
        return []


def save_decision(decision: dict):
    decisions = load_decisions()
    decisions.insert(0, decision)
    decisions = decisions[:100]  # Keep last 100
    DECISIONS_FILE.write_text(json.dumps(decisions, indent=2))


async def run_agent_cycle(coin: str = "BTC") -> dict | None:
    """Run one full analysis cycle for a given coin"""
    print(f"\n🚀 ===== FUSION AGENT CYCLE STARTED =====")
    print(f"📍 Coin: {coin} | Time: {datetime.now(timezone.utc).isoformat()}")

    # Initialize Gemini client
    ai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    model = "gemini-2.5-flash"

    try:
        # Connect to MCP server — one session shared by all analysts
        print(f"🔌 Connecting to MCP server...")
        async with streamable_http_client(MCP_SERVER_URL) as (read, write, _):
            async with ClientSession(read, write) as session:
                await session.initialize()

                # Fetch all tools once
                all_tools = await get_all_tools(session)
                print(f"✅ MCP connected — {len(all_tools)} tools available")

                # Run 5 specialists in parallel
                reports = await run_all_specialists(
                    session, all_tools, coin, ai_client, model
                )

                # Synthesize into final decision
                decision = await synthesize_reports(reports, coin, ai_client, model)

        # Log results
        print(f"\n🎯 DECISION: {decision.get('action')} | Confidence: {decision.get('confidence')}%")
        print(f"📝 Rationale: {decision.get('rationale')}")
        votes = decision.get('committeeVotes', {})
        print(f"🗳️  Votes — Bullish: {votes.get('bullish', 0)} | Bearish: {votes.get('bearish', 0)} | Neutral: {votes.get('neutral', 0)}")

        # Save decision
        save_decision(decision)
        print(f"✅ ===== CYCLE COMPLETE =====\n")
        return decision

    except Exception as e:
        print(f"❌ Agent cycle failed: {e}")
        import traceback
        traceback.print_exc()
        return None
