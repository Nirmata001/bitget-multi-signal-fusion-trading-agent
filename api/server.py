import json
import os
import sys
import asyncio
from datetime import datetime, timezone

if sys.platform == "win32":
    os.environ.setdefault("PYTHONUTF8", "1")
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.agent import run_agent_cycle

app = FastAPI(title="Omnisignal Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path("data")
DECISIONS_FILE = DATA_DIR / "decisions.json"

analysis_job: dict = {
    "running": False,
    "coin": None,
    "started_at": None,
    "error": None,
    "decision": None,
    "mode": "fast",
}

analysis_task = None


def read_json(path: Path):
    try:
        if path.exists():
            return json.loads(path.read_text())
        return []
    except:
        return []


@app.get("/api/decisions")
async def get_decisions():
    return read_json(DECISIONS_FILE)[:20]


@app.get("/api/status")
async def get_status():
    decisions = read_json(DECISIONS_FILE)
    latest = decisions[0] if decisions else None
    return {
        "status": "running" if analysis_job["running"] else "idle",
        "analysisRunning": analysis_job["running"],
        "analysisCoin": analysis_job["coin"],
        "analysisMode": analysis_job.get("mode", "fast"),
        "lastRun": latest.get("timestamp") if latest else None,
        "lastDecision": latest.get("action") if latest else None,
        "lastConfidence": latest.get("confidence") if latest else None,
        "model": os.getenv("QWEN_MODEL", "qwen3.6-plus"),
    }


class AnalyzeRequest(BaseModel):
    coin: str = "AAPL"
    mode: str = "fast"
    category: str = None


async def _run_analysis_job(coin: str, mode: str, category: str = None):
    try:
        # Dynamically switch mode variables
        is_fast = mode == "fast"
        os.environ["AGENT_FAST_MODE"] = "true" if is_fast else "false"
        os.environ["AGENT_MAX_ITERATIONS"] = "2" if is_fast else "4"
        os.environ["AGENT_MAX_TOOLS_PER_ROUND"] = "2" if is_fast else "4"
        print(f"⚙️ Configured environment: FAST_MODE={os.environ['AGENT_FAST_MODE']}, MAX_ITERATIONS={os.environ['AGENT_MAX_ITERATIONS']}, MAX_TOOLS_PER_ROUND={os.environ['AGENT_MAX_TOOLS_PER_ROUND']}")
        decision = await run_agent_cycle(coin, category=category)
        if decision is None:
            analysis_job["error"] = "Agent cycle failed"
        else:
            analysis_job["decision"] = decision
    except asyncio.CancelledError:
        analysis_job["error"] = "Analysis stopped by user"
    except Exception as e:
        analysis_job["error"] = str(e)
    finally:
        analysis_job["running"] = False


@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    global analysis_task
    coin = request.coin.upper()
    mode = request.mode.lower() if request.mode else "fast"
    category = request.category.lower() if request.category else None
    print(f"📥 Received analyze request: coin={coin}, mode={mode}, category={category}")

    if analysis_job["running"]:
        return {
            "success": True,
            "status": "running",
            "coin": analysis_job["coin"],
            "mode": analysis_job.get("mode", "fast"),
            "category": analysis_job.get("category"),
        }

    analysis_job.update({
        "running": True,
        "coin": coin,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "error": None,
        "decision": None,
        "mode": mode,
        "category": category,
    })
    analysis_task = asyncio.create_task(_run_analysis_job(coin, mode, category=category))

    return {"success": True, "status": "started", "coin": coin, "mode": mode, "category": category}


@app.post("/api/analyze/stop")
async def stop_analyze():
    global analysis_task
    if not analysis_job["running"]:
        return {"success": False, "message": "No analysis is currently running"}

    if analysis_task and not analysis_task.done():
        analysis_task.cancel()
        try:
            await asyncio.wait_for(analysis_task, timeout=2.0)
        except (asyncio.TimeoutError, asyncio.CancelledError):
            pass
        except Exception:
            pass

    analysis_job.update({
        "running": False,
        "coin": None,
        "started_at": None,
        "error": "Analysis stopped by user",
        "decision": None,
    })
    return {"success": True, "message": "Analysis stopped"}


@app.get("/api/analyze/status")
async def analyze_status():
    return {
        "running": analysis_job["running"],
        "coin": analysis_job["coin"],
        "startedAt": analysis_job["started_at"],
        "error": analysis_job["error"],
        "decision": analysis_job["decision"],
        "success": (
            not analysis_job["running"]
            and analysis_job["decision"] is not None
            and analysis_job["error"] is None
        ),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
