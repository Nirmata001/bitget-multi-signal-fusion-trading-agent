# 📈 OmniSignal AI Investment Committee

> Institutional-grade stock and crypto analysis powered by a council of specialized AI analysts.

## 🚀 Overview

OmniSignal is a multi-agent AI trading intelligence platform that simulates an investment committee rather than relying on a single AI model.

Instead of generating trading decisions from one general-purpose assistant, OmniSignal assembles a council of specialist analysts focused on different market dimensions:

* 🌍 Macroeconomic Analysis
* 📊 Earnings & Fundamentals
* 📉 Technical Analysis
* 📰 Market Sentiment Analysis

Each specialist independently evaluates an asset, submits its recommendation, and participates in a consensus process that produces a final investment outlook.

The result is a more structured, explainable, and transparent approach to AI-powered market analysis.

---

## 🎯 Problem

Modern investors are overwhelmed by fragmented information:

* Earnings reports
* Economic releases
* Technical indicators
* Market sentiment
* News events
* Social media discussions

Most AI trading tools provide a single opinion without exposing the reasoning process behind the decision.

OmniSignal addresses this by creating a collaborative AI committee where multiple specialist agents contribute to a final recommendation.

---

## 💡 Solution

OmniSignal introduces a Swarm Intelligence Investment Committee.

Every analysis request is routed through multiple expert agents that:

1. Research the asset from their domain perspective
2. Produce independent findings
3. Vote bullish, bearish, or neutral
4. Participate in a consensus engine
5. Generate a final investment recommendation with supporting rationale

This mirrors how professional investment firms often operate through committees rather than individual analysts.

---

## 🏗️ Architecture

```text
                  ┌─────────────────────────────────────┐
                  │          USER TRIGGER               │
                  │   (Asset Select & Analysis Mode)    │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    COUNCIL CONSENSUS ENGINE HUB     │
                  └──────┬───────┬───────┬───────┬──────┘
                         │       │       │       │
             ┌───────────┘       │       │       └───────────┐
             ▼                   ▼       ▼                   ▼
       ┌─────────────┐     ┌─────────────┐ ┌─────────────┐     ┌─────────────┐
       │    MACRO    │     │MARKET INTEL │ │   NEWS AI   │     │  SENTIMENT  │
       │   ANALYST   │     │  ANALYST    │ │   ANALYST   │     │   ANALYST   │
       └──────┬──────┘     └──────┬──────┘ └──────┬──────┘     └──────┬──────┘
              │                   │       │                   │
              └───────────┐       │       │       ┌───────────┘
                          ▼       ▼       ▼       ▼
                   ┌─────────────────────────────────────┐
                   │      VOTING & RESOLUTION TABLE      │
                   │      (Bullish / Bearish / Neutral)  │
                   └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    FINAL COMMITTEE LEDGER RECORD    │
                  │  (Aggregate Decision & Rationale)   │
                  └──────────────────┬──────────────────┘
                                     │
            ┌────────────────────────┴────────────────────────┐
            ▼                                                 ▼
┌───────────────────────┐                         ┌───────────────────────┐
│ 🔊 LIVE VOICE SYNTH   │                         │ 📥 CSV EXPORTER       │
│ (Universal Narrator)  │                         │ (All Analyst Papers)  │
└───────────────────────┘                         └───────────────────────┘
```

---

## 📡 Dynamic Data Sourcing & MCP Server Integration

To provide institutional-grade precision, OmniSignal implements a secure, sandboxed Model Context Protocol (MCP) data-gathering pipeline. Rather than relying on static pre-training knowledge, each specialist analyst is assigned a dedicated toolkit connected to Bitget market data MCP server(https://datahub.noxiaohao.com/mcp).

When an analysis is triggered, the **Head of Advisory (Consensus Engine)** spins up parallel sandboxed sessions. Each specialized AI analyst then queries the MCP server in real-time, executing only the specific set of financial or digital asset instruments permitted in their security sandbox definition:

### 🌍 Macro Analyst (Liquidity & Legacies)
The Macro Analyst manages currency flows, legacy assets, index data, and sovereign interest positions to formulate high-level equity risk models.
* **Assigned MCP Tools**:
  * `rates_yields`: Fetches sovereign bond distributions and global base interest rates.
  * `macro_indicators`: Evaluates central bank inflation, unemployment metrics, and GDP targets.
  * `global_assets`: Tracks legacy index averages (S&P 500, Nasdaq, DXY, gold).
  * `cross_asset`: Maps commodity-to-token velocity ratios.
  * `tradfi_news`: Pulls legacy corporate financial media disclosures.
  * `cn_market`: Integrates liquidity indicators from specialized international capital markets.
  * `global_data`: Retrieves raw secondary economic index statistics.

### 📊 Market Intel Analyst (On-Chain & Exchange Intelligence)
The Market Intel Analyst represents our primary crypto-native intelligence core. It evaluates raw blockchain metrics, specialized token balances, decentralized reserves, and automated market maker pools.
* **Assigned MCP Tools**:
  * `crypto_market`: Monitors general asset pairs, volume, and depth across major digital asset venues.
  * `defi_analytics`: Measures decentralized lending rates, total value locked (TVL), and farm yields.
  * `dex_market`: Tracks automated market maker (AMM) pools, trades, slippage statistics, and decentralized liquidity.
  * `network_status`: Examines on-chain metrics, gas prices, blockchain hash rates, and block frequencies.
  * `crypto_price`: Fetches real-time localized crypto pricing and ticker details.

### 📰 News AI Analyst (Narrative Velocity & Social Feed Streamer)
The News Analyst computes psychological sentiment trends, trending keyword vectors, corporate developments, and social dominance metrics from live streams.
* **Assigned MCP Tools**:
  * `news_feed`: Gathers chronological headlines and breaking corporate press releases.
  * `social_trending`: Identifies coin triggers, social velocity indexes, and viral keyword clusters.
  * `tradfi_news`: Ingests traditional media coverage vectors to match retail expectations against institution briefings.

### 📉 Sentiment Analyst (Trading Psychology & Orderbook Metrics)
The Sentiment Analyst maps market heatmaps, liquidation metrics, leverage ratios, and retail fear/greed fluctuations.
* **Assigned MCP Tools**:
  * `sentiment_index`: Synthesizes unified social volume ratios and fear-greed indexes.
  * `derivatives_sentiment`: Resolves futures open interest, perpetual funding rates, and options volume spreads.

---

## ✨ Key Features

### 🤖 Multi-Agent Intelligence

Multiple specialized AI analysts work together to evaluate an asset (4 specialized analysts & 1 Head of Advisory).

### 🏛️ Consensus-Based Decision Making

Recommendations are determined through a structured voting process rather than a single AI response.

### 📊 Explainable Analysis

Every recommendation includes supporting reasoning from each specialist.

### 📈 Cross-Asset Research (Stocks & Crypto)

Designed for both traditional stock markets and rapid digital asset crypto markets to provide unified investment decision support.

### 📝 Persistent Decision Ledger

Analysis outputs can be stored and reviewed for transparency and auditing.

### ⚡ Real-Time Insights

Supports dynamic analysis workflows for rapidly changing markets.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express

### AI Layer

* Qwen Models (via DashScope / OpenAI-compatible endpoint)
* Multi-Agent Consensus Orchestration

### Storage

* JSON-based analysis ledger

---

## 📂 Project Structure

```text
.
├── agent/
│   ├── agent.py
│   ├── specialists.py
│   ├── synthesis.py
│   ├── prompts.py
│   └── qwen_client.py
│
├── api/
│   └── server.py
│
├── src/
│   ├── components/
│   ├── lib/
│   └── App.tsx
│
├── data/
│   └── decisions.json
│
├── server.ts
├── package.json
└── requirements.txt
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Nirmata001/bitget-multi-signal-fusion-trading-agent.git

cd bitget-multi-signal-fusion-trading-agent
```

### Install Frontend Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
QWEN_MODEL=
QWEN_API_KEY=
QWEN_BASE_URL=
```

### Start Development Server

```bash
npm run dev
```

---

## 🔄 Analysis Flow

1. User selects a stock or crypto asset
2. Consensus engine launches specialist analysts
3. Each analyst performs independent evaluation
4. Agents submit votes
5. Final recommendation is synthesized by the lead agent (Head of Advisory)
6. Report is saved to the decision ledger

---

## 📸 Screenshots

### Landing Page

Add screenshot here

### Committee Analysis

Add screenshot here

### Final Recommendation

Add screenshot here

---

## 🎥 Demo

### Live Application

[Demo Link]

### Video Walkthrough

[Video Link]

---

## 🔮 Roadmap

* Portfolio Management
* Backtesting Engine
* Autonomous Trade Execution
* Risk Scoring Models
* Earnings Call Analysis
* ETF Coverage

---

## 👥 Team

Built for the Stocks AI Trading Hackathon Track.

---

## 📄 License

MIT License
