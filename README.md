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
