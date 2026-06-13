import asyncio
import json
import os
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv
from agent.specialists import run_all_specialists
from agent.synthesis import synthesize_reports
from agent.config import FAST_MODE, MAX_ITERATIONS

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

    # Initialize Qwen config parameters
    ai_client = None
    model = os.getenv("QWEN_MODEL", "qwen3.6-plus")

    try:
        mode = "FAST" if FAST_MODE else "FULL"
        print(f"🔌 Running analysts in {mode} mode (max {MAX_ITERATIONS} Qwen rounds each)...")

        reports = await run_all_specialists(None, {}, coin, ai_client, model)
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
