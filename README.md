# OmniSignal — Multi-Agent Financial Intelligence Platform

> **Bitget AI Base Camp Hackathon S1 · Track 3: Open Innovaton**

OmniSignal replaces single-model AI speculation with a structured, consensus-driven advisory council. Instead of asking one AI "should I buy Bitcoin?" and getting one opinion, OmniSignal simulates a real institutional investment committee — four autonomous specialist agents independently research an asset, cast their votes, and a Head of Advisory synthesizes their findings into a unified, high-conviction recommendation.

---

## The Problem

Most AI trading tools today are either:
- **Single-model black boxes** — one model, one perspective, no transparency
- **Rule-based bots** — rigid signal triggers with no contextual reasoning
- **Hallucination-prone** — AI models speculating without grounding in live market data

OmniSignal solves this by combining **multi-agent swarm architecture**, **live market data via Bitget MCP**, and **democratic consensus voting** into a single research platform built for serious traders and investors.

---

## Architecture Overview

```
                    ┌─────────────────────────┐
                    │   USER SELECTS ASSET    │
                    │   (BTC, AAPL, ETH...)   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   CONSENSUS ENGINE      │
                    │   Head of Advisory      │
                    │   (Orchestrator)        │
                    └──┬──────┬──────┬──────┬─┘
                       │      │      │      │
              ┌────────▼─┐ ┌──▼───┐ ┌▼────┐ ┌▼──────────┐
              │  MACRO   │ │MARKET│ │NEWS │ │ SENTIMENT │
              │ ANALYST  │ │INTEL │ │AGENT│ │   AGENT   │
              └────────┬─┘ └──┬───┘ └┬────┘ └┬──────────┘
                       │      │      │        │
                    ┌──▼──────▼──────▼────────▼──┐
                    │    BITGET MCP DATA HUB      │
                    │  19 Live Market Data Tools  │
                    │  datahub.noxiaohao.com/mcp  │
                    └─────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   CONSENSUS SYNTHESIS   │
                    │  BUY / HOLD / SELL      │
                    │  Confidence Score       │
                    │  Committee Breakdown    │
                    └─────────────────────────┘
```

---

## The Four Specialist Agents

Each agent operates autonomously with access to a curated subset of live market data tools from the Bitget MCP server:

### 🌐 Macro Analyst
**Domain:** Global macroeconomics, monetary policy, cross-asset correlations

Evaluates the broader economic backdrop — interest rate cycles, inflation metrics, sovereign currency structures, Fed policy direction, and how traditional finance forces affect the target asset.

**Live data tools:** `rates_yields`, `macro_indicators`, `global_assets`, `cross_asset`, `tradfi_news`, `cn_market`, `global_data`

**Key signals:** Yield curve shape · Fed funds trajectory · DXY momentum · BTC/Gold/Nasdaq correlations · CPI and NFP releases

---

### 💰 Market Intelligence Analyst
**Domain:** On-chain flows, orderbook structure, institutional activity

Focuses on the structural layer beneath price — where capital is actually flowing, what large holders are doing, derivatives market positioning, and liquidity conditions.

**Live data tools:** `crypto_market`, `defi_analytics`, `dex_market`, `network_status`, `crypto_price`

**Key signals:** Exchange reserve levels · Open interest · OTC desk activity · DEX trending · Network congestion

---

### 📰 News Analyst
**Domain:** Breaking news, regulatory filings, institutional narratives

Ingests global news wires, regulatory developments, corporate disclosures, and media velocity to identify market-moving narratives before they are priced in.

**Live data tools:** `news_feed`, `social_trending`, `tradfi_news`

**Key signals:** Regulatory announcements · ETF flow narratives · Institutional adoption headlines · Breaking geopolitical events

---

### 📊 Sentiment Analyst
**Domain:** Crowd psychology, derivatives positioning, social signals

Measures the emotional temperature of the market — fear vs. greed, leverage concentration, long/short imbalances, and social media momentum.

**Live data tools:** `sentiment_index`, `derivatives_sentiment`

**Key signals:** Fear & Greed Index · Long/short ratios · Funding rates · Taker buy/sell ratio · Reddit trending

---

## The 4-Step Consensus Workflow

```
STEP 1 — CONCURRENT FIELD RESEARCH
All 4 analysts launch simultaneously, each independently
researching the asset from their domain perspective using
live data from the Bitget MCP server.

STEP 2 — DEMOCRATIC BALLOTING
Each analyst casts an individual vote:
  · Signal:     BULLISH / BEARISH / NEUTRAL
  · Confidence: 0–100%
  · Evidence:   Key findings and supporting data points
  · Full Report: Detailed analytical narrative

STEP 3 — SYNTHESIS & RECONCILIATION
The Head of Advisory receives all 4 ballots, weighs
the evidence, resolves conflicts, and outputs:
  · Final action:    BUY / HOLD / SELL
  · Confidence:      Aggregate conviction score
  · Rationale:       Synthesized reasoning
  · Committee votes: Full breakdown

STEP 4 — LEDGER LOGGING
The complete committee paper — including all individual
analyst reports, vote breakdowns, and timestamps — is
written to a persistent chronological ledger.
```

---

## Key Features

### 🔊 Live Voice Narration
Integrated with the Web Speech Synthesis API, users can trigger a high-quality verbal brief of the committee's consolidated report with a single click. The narration covers the final recommendation, confidence score, rationale, and committee vote breakdown — making the analysis accessible without reading.

### 📊 Dynamic Terminal Cockpit
Built with React 18 and Framer Motion, the dashboard presents a high-contrast dark interface combining Space Grotesk and JetBrains Mono typography — designed to feel like a premium institutional trading terminal. Real-time animations reflect agent activity, vote tallying, and synthesis in progress.

### 📥 Comprehensive CSV Exporter
The custom ledger exporter maps the complete chronological history into structured spreadsheet columns — including committee votes, individual analyst signals, confidence levels, key takeaways, and full report text — enabling downstream analysis, backtesting dataset creation, and audit trails.

### ⚡ Analysis Modes
- **Tactical Fast Check** — Rapid 4-analyst sweep prioritizing speed
- **Deep Comprehensive Diagnostic** — Full multi-tool research cycle per analyst with broader data coverage

---

## 📁 Demo Run Records & Verification

For hackathon evaluation, the analytical outputs and live execution logs generated during active committee cycles have been saved in the [`demo_run_record/`](./demo_run_record/) directory:

* **BTC Cycle (June 19, 2026)**:
  * [PDF Advisory Memorandum](./demo_run_record/BTC%20june%2019.pdf) — Comprehensive, multi-page consensus report for Bitcoin.
  * [Advisory Terminal Logs](./demo_run_record/BTC%20june%2019.txt) — Unedited step-by-step console logs showing concurrent analyst field research and API recovery.
* **ETH Cycle (June 19, 2026)**:
  * [PDF Advisory Memorandum](./demo_run_record/ETH%20JUNE%2019.pdf) — Structured Advisory Council synthesis output for Ethereum.
  * [Advisory Terminal Logs](./demo_run_record/ETH%20JUNE%2019.txt) — Real-time telemetry, concurrent tool-calling, and final synthesis votes.
* **ETH Cycle (June 20, 2026)**:
  * [PDF Advisory Memorandum](./demo_run_record/ETH%20june%2020th.pdf) — Multi-agent field research analysis.
  * [Advisory Terminal Logs](./demo_run_record/ETH%20june%2020th.txt) — Full console logging showing the live API gateway and synthesis.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Agent Framework | Python 3.12 · asyncio |
| AI Model | Qwen (OpenAI-compatible API) |
| Market Data | Bitget MCP Server · 19 live data tools |
| MCP Transport | `mcp.client.streamable_http` |
| Backend API | FastAPI · Uvicorn |
| Frontend | React 18 · TypeScript · Vite |
| UI Animations | Framer Motion |
| Styling | Tailwind CSS |
| Data Persistence | JSON ledger (local) |

---

## MCP Integration

OmniSignal connects to the Bitget Agent Hub MCP server at `https://datahub.noxiaohao.com/mcp` using the MCP `streamable_http` transport protocol. On startup, the platform:

1. Establishes a persistent MCP session
2. Fetches all 19 available tool definitions
3. Dynamically converts them to the AI model's function calling schema
4. Assigns tool subsets to each specialist analyst
5. Executes tool calls on behalf of analysts during their research phase

This architecture means OmniSignal automatically picks up new tools added to the Bitget MCP server without any code changes — the tool mapping is fully dynamic.

---

## Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- Qwen API key
- Bitget API key (for `bgc` CLI tools)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/omnisignal

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys:
# QWEN_API_KEY=your_key
# QWEN_BASE_URL=
# QWEN_MODEL=
# BITGET_API_KEY=your_key
# BITGET_SECRET_KEY=your_secret
# BITGET_PASSPHRASE=your_passphrase

# Start the FastAPI server
python api/server.py
```

### Frontend Setup
```bash
# Install Node dependencies
npm install

# Start the React dashboard
npm run dev
```

### Run a Single Analysis Cycle
```bash
python main.py
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | Agent status and last run info |
| `GET` | `/api/decisions` | Last 20 committee decisions |
| `POST` | `/api/analyze` | Trigger analysis for a coin/stock |

### Example Request
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"coin": "BTC"}'
```

### Example Response
```json
{
  "success": true,
  "decision": {
    "coin": "BTC",
    "action": "BUY",
    "confidence": 78,
    "rationale": "Three of four analysts present bullish signals...",
    "committeeVotes": {
      "bullish": 3,
      "bearish": 0,
      "neutral": 1
    },
    "analystReports": [...],
    "timestamp": "2026-06-17T10:30:00Z"
  }
}
```

---

## Why OmniSignal Wins

| Traditional AI Trading Tools | OmniSignal |
|------------------------------|------------|
| Single model, single opinion | 4 specialists + 1 synthesizer |
| No data grounding | 19 live MCP data tools |
| Black box reasoning | Full committee transparency |
| Static rule triggers | Dynamic AI-driven tool selection |
| One asset class | Crypto + Equities |
| No audit trail | Persistent ledger with full reports |

---

## Roadmap

- [ ] Simulated trade execution via Bitget API
- [ ] Backtesting integration using the `backtest` MCP tool
- [ ] Portfolio-level multi-asset analysis
- [ ] Scheduled autonomous monitoring with alerts
- [ ] WebSocket real-time streaming to dashboard
- [ ] Additional specialist agents (Technical Analysis, Options Flow)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- **Bitget Agent Hub** — MCP server and skill hub infrastructure
- **Alibaba Cloud** — Qwen model API
- **Model Context Protocol** — Open standard for AI tool integration

---

*Built for the Bitget AI Base Camp Hackathon S1 · Track 3: Open Innovation*
