import json
import asyncio
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.agent import run_agent_cycle

app = FastAPI(title="Fusion Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path("data")
DECISIONS_FILE = DATA_DIR / "decisions.json"

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
        "status": "running",
        "lastRun": latest.get("timestamp") if latest else None,
        "lastDecision": latest.get("action") if latest else None,
        "lastConfidence": latest.get("confidence") if latest else None,
    }

class AnalyzeRequest(BaseModel):
    coin: str = "BTC"

@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    decision = await run_agent_cycle(request.coin.upper())
    return {"success": True, "decision": decision}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
