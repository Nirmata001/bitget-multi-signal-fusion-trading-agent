import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  TrendingUp, 
  Cpu, 
  Database, 
  Terminal, 
  Check, 
  X, 
  Clock, 
  PieChart, 
  User, 
  RefreshCw, 
  ShieldAlert, 
  History,
  Workflow,
  Sparkles,
  Link2,
  Globe,
  Users,
  Newspaper,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnalystReport {
  analyst: string;
  signal: string;
  confidence: number;
  summary: string;
  keyPoints: string[];
  fullReport?: string;
}

interface CommitteeVotes {
  bullish: number;
  bearish: number;
  neutral: number;
}

interface Decision {
  coin: string;
  action: string;
  confidence: number;
  rationale: string;
  committeeVotes: CommitteeVotes;
  analystReports: AnalystReport[];
  timestamp: string;
}

interface SystemStatus {
  status: string;
  lastRun: string | null;
  lastDecision: string | null;
  lastConfidence: number | null;
  model?: string | null;
}

const analystsList = [
  {
    id: "macro",
    name: "Macro Liquidity Suite",
    role: "Global Macro & Stablecoin Flows",
    icon: Globe,
    badge: "Liquidity Index",
    description: "Monitors sovereign central bank reserves, stablecoin mint velocities, and aggregate global fiat/crypto flow metrics.",
    telemetry: ["Stablecoin Mint Velocity", "USD Liquidity Index", "DXY Momentum Tracker"],
    status: "SYNCHRONIZED",
    colorBg: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    gradient: "from-blue-500/5 to-indigo-500/10 hover:border-blue-200 hover:shadow-blue-500/5"
  },
  {
    id: "sentiment",
    name: "Social Sentiment & Orderbook Swarm",
    role: "Social Media Mining & Depth Chart",
    icon: Users,
    badge: "Sentiment Index",
    description: "Crawls institutional order books, liquidation heatmaps, and scans social micro-trends for retail and institutional bias ratios.",
    telemetry: ["Liquidation Heatmaps", "Social Volume Multipliers", "Ask/Bid Depth Imbalance"],
    status: "MINING MEMPOOLS",
    colorBg: "bg-purple-500/10 border-purple-500/20 text-purple-600",
    gradient: "from-purple-500/5 via-pink-500/5 to-rose-500/5 hover:border-purple-200 hover:shadow-purple-500/5"
  },
  {
    id: "market_intel",
    name: "Smart Money & Wallet Analytics",
    role: "Whale Wallet Inflows & Cold Storage Intake",
    icon: Coins,
    badge: "Whale Tracker",
    description: "Monitors multi-signature whale cold storage addresses, OTC broker desk inventory drawdown rates, and venture capital allocations.",
    telemetry: ["Whale Inflow Ratio", "OTC Vault Drawdowns", "Exchange Balance Net Flows"],
    status: "MONITORING WALLETS",
    colorBg: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    gradient: "from-yellow-500/5 to-amber-500/5 hover:border-amber-200 hover:shadow-amber-500/5"
  },
  {
    id: "news",
    name: "Global News & Fundamental Agent",
    role: "Breaking News & Regulatory Filings",
    icon: Newspaper,
    badge: "News Feed",
    description: "Ingests global institutional news wires, regulatory filings, SEC updates, and ETF prospectus filings in real time.",
    telemetry: ["SEC Filings Real-time Feed", "ETF Inflow/Outflow Sheets", "Macro Inflation Reviews"],
    status: "INGESTING FEEDS",
    colorBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600",
    gradient: "from-cyan-500/5 to-teal-500/5 hover:border-cyan-200 hover:shadow-cyan-500/5"
  }
];

const registeredTools = [
  { name: "rates_yields", desc: "Monitors federal funds rate, sovereign bond yields, yield curves, and central bank macro directives." },
  { name: "macro_indicators", desc: "Pulls inflation data (CPI/PCE), unemployment rates, global manufacturing/GDP growth statistics." },
  { name: "global_assets", desc: "Correlates S&P500, Nasdaq, Gold, and US Dollar Index (DXY) aggregate performance metrics." },
  { name: "cross_asset", desc: "Performs regression calculations regarding crypto assets vs legacy equity and liquidity indices." },
  { name: "technical_analysis", desc: "Computes multi-timeframe moving averages, Relative Strength Indexes (RSI), MACD, and Bollinger Bands." },
  { name: "sentiment_index", desc: "Analyzes social sentiment volumes, Reddit active threads, and social volatility matrices." },
  { name: "derivatives_sentiment", desc: "Pulls options open interest, retail funding rates, liquidation ratios, and order book cumulative depths." },
  { name: "crypto_market", desc: "Tracks global coin valuations, dominance scores, and daily stablecoin volume allocations." },
  { name: "defi_analytics", desc: "Scans smart-contract metrics, protocol total value locked (TVL), and network-wide utility metrics." },
  { name: "news_feed", desc: "Ingests live RSS crypto news wires, SEC regulatory filings, and ETF net flow statistics." }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"console" | "ledger" | "status">("console");
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  const [customCoinInput, setCustomCoinInput] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [latestDecision, setLatestDecision] = useState<Decision | null>(null);
  const [ledgerData, setLedgerData] = useState<Decision[]>([]);
  const [selectedLedgerIndex, setSelectedLedgerIndex] = useState<number>(-1);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: "active",
    lastRun: null,
    lastDecision: null,
    lastConfidence: null,
    model: "qwen3.6-plus"
  });
  const [activeAnalystTab, setActiveAnalystTab] = useState<string>("macro");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Keep live UTC clock refreshed every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDecisions();
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setSystemStatus({
            status: data.status || "active",
            lastRun: data.lastRun,
            lastDecision: data.lastDecision,
            lastConfidence: data.lastConfidence,
            model: data.model || "qwen3.6-plus"
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch system status from API:", err);
    }
  };

  const fetchDecisions = async () => {
    try {
      const res = await fetch("/api/decisions");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLedgerData(data);
          setLatestDecision(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch historical decisions from API:", err);
    }
  };

  const appendLog = (text: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const normalizeAnalystName = (name: string): string => {
    if (!name) return "";
    const n = name.toLowerCase().replace(/[\s_-]/g, "");
    if (n.includes("macro")) return "macro";
    if (n.includes("sentiment")) return "sentiment";
    if (n.includes("market")) return "market_intel";
    if (n.includes("news")) return "news";
    return n;
  };

  const cancelAnalysis = async () => {
    try {
      appendLog("🛑 Sending cancellation signal to server...");
      const res = await fetch("/api/analyze/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        appendLog("✅ Server analysis stopped. Workspace reset.");
      } else {
        appendLog("⚠️ Server returned non-ok response for stop request.");
      }
    } catch (err) {
      console.error("Failed to stop analysis:", err);
      appendLog("❌ Failed to contact server to stop analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeAdvisoryAnalysis = async (coinSymbol: string) => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setLogs([]);

    const targetSymbol = coinSymbol.toUpperCase().trim() || "BTC";

    const steps = [
      "⚡ Initializing Fusion advisory container node...",
      "🔌 Connecting to Qwen model and MCP DataHub...",
      "📡 Model Context Protocol loading market data tools...",
      "📊 Macro Analyst triggered — gathering liquidity indicators...",
      "💬 Sentiment swarm scanning derivatives and social signals...",
      "🐋 Market Intel analyst monitoring whale wallet flows...",
      "🗳️ News Analyst ingesting filings and breaking headlines...",
      "🧩 Head of Advisory synthesizing committee votes...",
      "⏳ Analysis in progress — this may take several minutes."
    ];

    let stepIndex = 0;
    appendLog(steps[0]);
    stepIndex = 1;

    const logInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        appendLog(steps[stepIndex]);
        stepIndex++;
      }
    }, 3000);

    const pollForResult = async (): Promise<Decision | null> => {
      const maxWaitMs = 25 * 60 * 1000;
      const startedAt = Date.now();

      while (Date.now() - startedAt < maxWaitMs) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const statusRes = await fetch("/api/analyze/status");
        if (!statusRes.ok) continue;

        const status = await statusRes.json();

        if (status.running) continue;

        if (status.error) {
          throw new Error(status.error);
        }

        if (status.decision) {
          return status.decision as Decision;
        }

        throw new Error("Analysis ended without a result");
      }

      throw new Error("Analysis timed out after 25 minutes");
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coin: targetSymbol }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || data.message || `Request failed (${res.status})`;
        appendLog(`❌ Analysis failed: ${errorMsg}`);
        return;
      }

      appendLog(`🛰️ Background job started for ${targetSymbol} — polling for results...`);

      const decision = await pollForResult();
      if (!decision) return;

      setLatestDecision(decision);
      setLedgerData((prev) => [decision, ...prev]);
      appendLog(
        `🪐 SYNTHESIS COMPLETE. Recommendation: ${decision.action} (${decision.confidence}% confidence)`
      );
      await fetchStatus();
      await fetchDecisions();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      appendLog(`❌ Analysis failed: ${message}`);
      await fetchDecisions();
      console.error("Advisory analysis failed:", err);
    } finally {
      clearInterval(logInterval);
      setIsAnalyzing(false);
    }
  };

  const getActionTheme = (action: string) => {
    switch (action?.toUpperCase()) {
      case "BUY":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600",
          dots: "bg-emerald-500"
        };
      case "SELL":
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-600",
          dots: "bg-rose-500"
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-600",
          dots: "bg-amber-500"
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col justify-between py-6 px-4 md:px-8 overflow-x-hidden font-sans select-none">
      
      {/* Platform Header Metadata Panel */}
      <header className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0a152d] flex items-center justify-center text-white font-bold select-none text-sm animate-pulse">
            ✦
          </div>
          <div className="text-left">
            <h2 className="text-[13px] font-bold text-[#0a1b33] tracking-tight uppercase flex items-center gap-2">
              Fusion Autonomous Advisory Platform
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Node Connect
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              MCP Servers Connection: active | API Port: 3001
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="font-mono text-[11px] text-slate-500 bg-white border border-slate-200/60 px-3 py-1 rounded-full shadow-xs flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {currentTime || "Connecting to atomic clock..."}
          </div>
        </div>
      </header>

      {/* 2. Main Hero Container */}
      <div 
        id="hero-container"
        className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col md:flex-row"
      >
        
        {/* Background Video Layer */}
        <div 
          id="bg-video-layer"
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
        >
          <video 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 3. Hero Text Content Wrapper (Left 65%) */}
        <div className="relative z-20 w-full md:w-[65%] px-8 md:px-14 pt-10 md:pt-12 pb-10 flex flex-col justify-between items-start bg-gradient-to-r from-white via-white/95 md:via-white/80 to-transparent h-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-center text-left"
          >
            {/* Headline */}
            <h1 
              id="hero-headline"
              className="font-display text-[42px] md:text-[52px] font-medium leading-[1.05] tracking-tight text-[#0a1b33] mb-4"
              dangerouslySetInnerHTML={{ __html: "Foundation of the<br />new digital epoch" }}
            />

            {/* Subheadline & Active Metrics */}
            <p 
              id="hero-subheadline"
              className="font-sans text-[13px] md:text-[14px] text-[#64748b] max-w-md mb-6 leading-relaxed"
            >
              Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-6">
              <div className="bg-[#0a152d]/5 border border-[#0a152d]/10 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#0a152d]" />
                <span className="text-[11px] font-semibold text-[#0a152d]">4 Autonomous Swarm Analysts</span>
              </div>
              <div className="bg-[#0a152d]/5 border border-[#0a152d]/10 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-[#0a152d]" />
                <span className="text-[11px] font-semibold text-[#0a152d]">MCP Tool Context Integration</span>
              </div>
            </div>

            {/* Contact Button */}
            <div className="flex items-center gap-3">
              {isAnalyzing ? (
                <>
                  <button 
                    disabled
                    className="bg-indigo-900/10 text-[#0a152d] border border-indigo-200/50 rounded-full px-7 py-3 text-[13px] font-semibold tracking-wide flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing {selectedCoin}...
                  </button>
                  <button 
                    onClick={cancelAnalysis}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 py-3 text-[13px] font-semibold tracking-wide hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                    Stop Run
                  </button>
                </>
              ) : (
                <motion.button 
                  id="hero-contact-button"
                  whileHover={{ scale: 1.04 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => executeAdvisoryAnalysis(selectedCoin)}
                  className="bg-[#0a152d] text-white rounded-full px-7 py-3 text-[13px] font-semibold tracking-wide hover:shadow-lg hover:shadow-[#0a152d]/15 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  Initialize Advisory Run
                </motion.button>
              )}
              
              <div className="hidden sm:inline-flex flex-col text-[10px] text-slate-500 font-mono text-left">
                <span>Active Target: {selectedCoin}</span>
                <span>Committee Verdict: {latestDecision ? latestDecision.action : "Standby"}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats strip inside background */}
          <div className="w-full pt-4 border-t border-slate-200/40 flex items-center justify-between gap-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 font-mono">System Core Status:</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
                <Database className="w-3 h-3 text-slate-400" />
                Logs: {ledgerData.length} records
              </span>
              <span className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-slate-400" />
                Verdict Index: {systemStatus.lastDecision || "N/A"}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Premium Analysts Cards Grid */}
      <div 
        id="analysts-cards-section"
        className="mt-8 mb-4 w-full max-w-[1400px] mx-auto px-4 py-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {analystsList.map((analyst) => {
            const IconComponent = analyst.icon;
            return (
              <motion.div 
                id={`analyst-card-${analyst.id}`}
                key={analyst.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative rounded-[32px] bg-white border border-slate-200/60 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] transition-all overflow-hidden flex flex-col justify-between min-h-[300px] cursor-pointer text-left"
              >
                {/* Background Hover Accent */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-tr ${analyst.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[32px]`}
                />
                
                {/* Top Section with badge and Icon */}
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4 font-mono">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      {analyst.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-slate-50 border border-slate-100/50 text-slate-500 group-hover:bg-white transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {analyst.status}
                    </span>
                  </div>

                  {/* Icon and Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2.5 rounded-2xl border transition-all ${analyst.colorBg} group-hover:scale-105 duration-300 shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-[#0a1b33] font-sans leading-tight group-hover:text-indigo-950 transition-colors">
                        {analyst.name}
                      </h3>
                      <p className="text-[9.5px] text-slate-400 mt-0.5 leading-snug font-sans">
                        {analyst.role}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    {analyst.description}
                  </p>
                </div>

                {/* Bottom Section: Telemetry Indicators */}
                <div className="relative z-10 pt-4 border-t border-slate-100 mt-4">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase font-mono block mb-1.5 tracking-wider">
                    Core Swarm Signals
                  </span>
                  <div className="flex flex-col gap-1">
                    {analyst.telemetry.map((tel, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[9.5px] text-slate-600 font-medium font-mono">
                        <span className="text-[8.5px] text-indigo-400">✦</span>
                        <span className="truncate">{tel}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. Floating Bottom Navbar */}
      <div 
        id="floating-nav-wrapper"
        className="mt-2 mb-8 flex justify-center w-full max-w-[1400px] mx-auto px-4 relative z-30"
      >
        <motion.nav 
          id="bottom-navbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center bg-white/95 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-200/40 w-max whitespace-nowrap"
        >
          {/* Logo Placeholder */}
          <div 
            id="nav-logo"
            onClick={() => setActiveTab("console")}
            className="flex items-center justify-center rounded-full w-9 h-9 bg-white border border-slate-100 shadow-sm text-[#0a1b33] text-sm font-bold mr-2 select-none cursor-pointer hover:bg-slate-50 transition-all"
          >
            ✦
          </div>

          <button 
            id="nav-link-products"
            onClick={() => setActiveTab("console")}
            className={`text-[12px] font-semibold px-3.5 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === "console" ? "text-[#0a1b33] bg-slate-100/80" : "text-slate-500 hover:text-[#0a1b33]"
            }`}
          >
            Advisory Panel
          </button>
          <button 
            id="nav-link-docs"
            onClick={() => setActiveTab("ledger")}
            className={`text-[12px] font-semibold px-3.5 py-2 rounded-full transition-all cursor-pointer mr-2 ${
              activeTab === "ledger" ? "text-[#0a1b33] bg-slate-100/80" : "text-slate-500 hover:text-[#0a1b33]"
            }`}
          >
            Committee Ledger
          </button>

          <button 
            id="nav-action-button"
            onClick={() => setActiveTab("status")}
            className={`group/btn flex items-center gap-1 bg-white px-5 py-2 rounded-full text-[12px] font-semibold border shadow-sm transition-all cursor-pointer ${
              activeTab === "status"
                ? "text-indigo-600 border-indigo-200/80 bg-indigo-50/20"
                : "text-[#0a1b33] border-slate-200/60 hover:border-slate-300"
            }`}
          >
            Status Hub
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </motion.nav>
      </div>

      {/* 6. Lower Workspace & Interactive Dashboard Grid */}
      <div 
        id="lower-dashboard-workspace"
        className="mt-4 mb-16 w-full max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-30"
      >
        {/* Left column: Swarm Advisor Cockpit Panel */}
        <div id="left-workspace-column" className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white border border-slate-200/60 rounded-[32px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] h-[510px] flex flex-col justify-between text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 mb-2 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5 animate-pulse">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                {activeTab === "console" && "Swarm Advisor Laboratory"}
                {activeTab === "ledger" && `Committee Historical Ledger (${ledgerData.length})`}
                {activeTab === "status" && "Workspace Engine Hub"}
              </span>
              
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-slate-400 font-mono">127.0.0.1:3001</span>
              </div>
            </div>

            {/* TAB CONTAINER 1: CONSOLE */}
            <AnimatePresence mode="wait">
              {activeTab === "console" && (
                <motion.div 
                  key="console"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1 pb-1">
                    
                    {/* Token selectors */}
                    <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100/50">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase font-mono block mb-1.5">
                        Target Cryptocurrency Symbol
                      </span>
                      <div className="flex flex-wrap gap-2 items-center">
                        {["BTC", "ETH", "SOL", "XRP"].map((coin) => (
                          <button
                            key={coin}
                            onClick={() => { setSelectedCoin(coin); setCustomCoinInput(""); }}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                              selectedCoin === coin && !customCoinInput
                                ? "bg-[#0a152d] text-white border-[#0a152d]"
                                : "bg-white text-slate-600 border-slate-200/70 hover:border-slate-300"
                            }`}
                          >
                            {coin}
                          </button>
                        ))}
                        
                        {/* Custom Coin Input */}
                        <div className="relative flex-1 min-w-[90px]">
                          <input 
                            type="text"
                            placeholder="OTHER..."
                            value={customCoinInput}
                            onChange={(e) => {
                              const v = e.target.value.toUpperCase();
                              setCustomCoinInput(v);
                              setSelectedCoin(v || "BTC");
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-[11px] font-bold border text-slate-700 uppercase focus:outline-none focus:ring-1 focus:ring-[#0a152d] transition-all bg-white ${
                              customCoinInput ? "border-[#0a152d] ring-1 ring-[#0a152d]" : "border-slate-200/70"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Process log console */}
                    {(isAnalyzing || logs.length > 0) && (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-[180px] flex flex-col justify-between font-mono mb-3">
                        <div className="overflow-y-auto space-y-1.5 text-[10px] text-slate-300 flex-1 pr-1 scrollbar-thin text-left">
                          {logs.map((log, index) => (
                            <div key={index} className="leading-relaxed border-l-2 border-slate-700 pl-2">
                              {log}
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-800 shrink-0 flex items-center justify-between text-[9px]">
                          {isAnalyzing ? (
                            <span className="text-indigo-300 animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                              Parallel MCP Containers Active...
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Run complete — logs retained
                            </span>
                          )}
                          <span className="text-slate-500">Processing Node</span>
                        </div>
                      </div>
                    )}

                    {/* Decision results */}
                    {!isAnalyzing && latestDecision ? (
                      <div className="space-y-3 text-left">
                        <div className="bg-white border border-slate-200/60 p-3.5 rounded-2xl shadow-xs">
                          <div className="flex items-center justify-between pointer-events-none mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-extrabold text-slate-400 uppercase font-mono">
                                Council Consensus for {latestDecision.coin}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {latestDecision.timestamp ? new Date(latestDecision.timestamp).toLocaleTimeString() : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={`px-4 py-2.5 rounded-2xl border text-center min-w-[100px] ${getActionTheme(latestDecision.action).bg}`}>
                              <span className="text-[10px] font-extrabold font-mono uppercase text-slate-400 block tracking-wider leading-none">Recommendation</span>
                              <span className="text-xl font-bold tracking-tight">{latestDecision.action}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-[11px] font-bold text-[#0a1b33] mb-1">
                                <span>Synthesis Confidence</span>
                                <span className="font-mono text-indigo-600">{latestDecision.confidence}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" 
                                  style={{ width: `${latestDecision.confidence}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-3 mt-3 leading-relaxed border-l-2 border-indigo-200/60 pl-2 whitespace-pre-line text-left">
                            {latestDecision.rationale}
                          </p>
                        </div>

                        {/* Split analyst votes and keys */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block text-left">Council Votes</span>
                            <div className="flex items-center gap-3 mt-1.5 font-mono">
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">🟢 {latestDecision.committeeVotes?.bullish || 0} Bull</span>
                              <span className="text-[10px] font-bold text-[#64748b] flex items-center gap-1">⚪ {latestDecision.committeeVotes?.neutral || 0} Neu</span>
                              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">🔴 {latestDecision.committeeVotes?.bearish || 0} Bear</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setActiveTab("ledger");
                            }}
                            className="bg-indigo-50/40 hover:bg-indigo-50/80 border border-indigo-100/50 p-2.5 rounded-xl flex items-center justify-between text-left cursor-pointer transition-colors"
                          >
                            <div className="text-left">
                              <span className="text-[9px] font-bold text-slate-400 uppercase block">Detailed Reports</span>
                              <span className="text-[10px] font-extrabold text-indigo-600">Browse Swarm Logs →</span>
                            </div>
                            <History className="w-4 h-4 text-indigo-500 shrink-0" />
                          </button>
                        </div>
                      </div>
                    ) : !isAnalyzing && logs.length === 0 ? (
                      /* Welcome Prompt */
                      <div className="flex flex-col items-center justify-center h-[245px] border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/30 p-4 text-center">
                        <Workflow className="w-8 h-8 text-indigo-400/80 mb-2 animate-bounce" />
                        <h4 className="text-[12px] font-bold text-[#0a1b33]">No Active Advisory Files Loaded</h4>
                        <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                          Click "Initialize Advisory Run" or select a coin asset to engage the autonomous 4-agent advisory swarm.
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-2 border-t border-slate-200/40 shrink-0 flex gap-2 w-full">
                    {isAnalyzing ? (
                      <>
                        <button
                          disabled
                          className="flex-1 bg-[#0a152d]/5 border border-indigo-100 text-[#0a152d]/60 rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Analyzing {selectedCoin}...
                        </button>
                        <button
                          onClick={cancelAnalysis}
                          className="px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                        >
                          <X className="w-4 h-4" />
                          Stop
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => executeAdvisoryAnalysis(selectedCoin)}
                          className="flex-1 bg-[#0a152d] text-white rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-[#122345] transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          Activate Swarm Advisory Consensus Mode (✦)
                        </button>
                        {(logs.length > 0 || latestDecision) && (
                          <button
                            onClick={() => {
                              setLogs([]);
                              setLatestDecision(null);
                            }}
                            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Reset
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB CONTAINER 2: LEDGER */}
              {activeTab === "ledger" && (
                <motion.div 
                  key="ledger"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between overflow-hidden text-left"
                >
                  <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3">
                    {/* Left side: List of runs */}
                    <div className="w-full md:w-[35%] overflow-y-auto border-r border-slate-200/40 pr-2 space-y-1.5 max-h-[140px] md:max-h-full text-left">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block mb-1">
                        Select Run File
                      </span>
                      {ledgerData.length === 0 ? (
                        <div className="text-center p-4 text-slate-400 text-[11px]">
                          No records in file logs.
                        </div>
                      ) : (
                        ledgerData.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedLedgerIndex(index)}
                            className={`w-full p-2 rounded-xl text-left border text-[11px] transition-all cursor-pointer block ${
                              selectedLedgerIndex === index || (selectedLedgerIndex === -1 && index === 0)
                                ? "bg-white border-indigo-400/80 shadow-xs"
                                : "bg-slate-50/50 hover:bg-slate-100 border-slate-200/40"
                            }`}
                          >
                            <div className="flex items-center justify-between text-left">
                              <span className="font-bold text-[#0a1b33]">{item.coin}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold font-mono ${
                                item.action === "BUY" ? "text-emerald-600 bg-emerald-50" : "text-amber-500 bg-amber-50"
                              }`}>{item.action}</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1">
                              <span>Conf: {item.confidence}%</span>
                              <span>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ""}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Right side: Detailed view of selection or latest */}
                    <div className="flex-1 overflow-y-auto max-h-[220px] md:max-h-full bg-slate-50/50 rounded-2xl p-3 border border-slate-100 text-left">
                      {(() => {
                        const activeItem = ledgerData[selectedLedgerIndex !== -1 ? selectedLedgerIndex : 0];
                        if (!activeItem) return <div className="text-slate-400 text-center py-10 text-[11px]">No run payload selected.</div>;
                        
                        return (
                          <div className="space-y-3 text-left">
                            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                              <h5 className="text-[12px] font-bold text-[#0a1b33] text-left">Swarm Payload: {activeItem.coin}</h5>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(activeItem.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 italic text-left">
                              "{activeItem.rationale}"
                            </p>

                            {/* Reports Accordion Tab */}
                            <div className="space-y-2 text-left">
                              <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block">
                                Swarm Analyst Segment Files
                              </span>
                              
                              <div className="flex gap-1 overflow-x-auto pb-1">
                                {["macro", "sentiment", "market_intel", "news"].map((at) => (
                                  <button
                                    key={at}
                                    onClick={() => setActiveAnalystTab(at)}
                                    className={`px-2 py-1 rounded-lg text-[9px] uppercase font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
                                      activeAnalystTab === at
                                        ? "bg-slate-800 text-white"
                                        : "bg-white text-slate-500 border border-slate-200/70 hover:border-slate-300"
                                    }`}
                                  >
                                    {at.replace("_", " ")}
                                  </button>
                                ))}
                              </div>

                              {(() => {
                                const rep = activeItem.analystReports?.find(r => normalizeAnalystName(r.analyst) === normalizeAnalystName(activeAnalystTab)) || 
                                            activeItem.analystReports?.[0];
                                if (!rep) return <div className="text-[10px] text-slate-400">Analyst file omitted.</div>;
                                return (
                                  <div className="bg-white border border-slate-200/60 p-2.5 rounded-xl space-y-1.5 shadow-2xs text-left">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold uppercase text-indigo-600">{rep.analyst} file report</span>
                                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                        Signal: {rep.signal} | Conf: {rep.confidence}%
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-600 leading-relaxed font-sans text-left">{rep.summary}</p>
                                    
                                    {rep.keyPoints && rep.keyPoints.length > 0 && (
                                      <div className="pt-1.5 border-t border-slate-100 space-y-1 text-left">
                                        <span className="text-[8px] font-extrabold text-slate-400 uppercase font-mono block text-left">Core telemetry data:</span>
                                        <div className="flex flex-wrap gap-1">
                                          {rep.keyPoints.map((kp, ki) => (
                                            <span key={ki} className="text-[8.5px] bg-slate-50 border border-slate-200/40 text-slate-600 px-2 py-0.5 rounded-full font-mono shrink-0">
                                              ✦ {kp}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/40 flex justify-between gap-2 shrink-0 w-full">
                    <button 
                      onClick={fetchDecisions}
                      className="w-full text-slate-600 hover:text-[#0a1b33] border border-slate-200 hover:border-slate-300 text-[11px] font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh Swarm Cache Database
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB CONTAINER 3: ENGINE STATUS */}
              {activeTab === "status" && (
                <motion.div 
                  key="engine"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between overflow-hidden text-left"
                >
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div className="space-y-2">
                      <h4 className="text-[12px] font-bold text-[#0a1b33] text-left">System Config: Swarm Node Coordinates</h4>
                      
                      <div className="grid grid-cols-2 gap-2.5 text-left">
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] text-slate-400 font-mono">Model Engine</span>
                          <span className="text-[11px] font-extrabold text-[#0a1b33] mt-1 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            <Cpu className="w-3.5 h-3.5 text-[#0a1b33] shrink-0" />
                            {systemStatus.model || "qwen3.6-plus"}
                          </span>
                        </div>
                        
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] text-slate-400 font-mono">MCP Protocol Tunnel</span>
                          <span className="text-[11px] font-extrabold text-indigo-600 mt-1 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            <Workflow className="w-3.5 h-3.5 text-[#0a1b33] shrink-0" />
                            DataHub MCPS
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/60 p-3.5 rounded-2xl space-y-2 text-left">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block text-left">Registered Tools Inventory</span>
                        <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1 scrollbar-thin text-left">
                          {registeredTools.map((t, idx) => (
                            <div key={idx} className="flex flex-col border-b border-slate-100 pb-1.5 last:border-0">
                              <span className="text-[10px] font-mono font-bold text-slate-800">✦ {t.name}</span>
                              <span className="text-[9px] text-slate-400">{t.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/40 shrink-0 w-full flex justify-between gap-2">
                    <div className="text-[9.5px] text-slate-400 font-mono flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                      Advisory container nodes in compliance.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Column: Dynamic Banner / Auxiliary Presentation Layer */}
        <div id="right-workspace-column" className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] h-[510px] flex flex-col justify-between items-start text-left"
          >
            <div className="w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-3">
                Decentralized Web Ecosystem
              </span>
              <h3 className="font-display text-[26px] md:text-[30px] font-medium leading-[1.1] tracking-tight text-[#0a1b33] mb-4">
                Redefining sovereign financial intelligence
              </h3>
              <p className="text-[12.5px] text-slate-500 leading-relaxed max-w-md">
                We design and distribute open tools enabling individual consensus nodes. Our dual-server model fuses speed/iteration rules of a lightweight Node client layer with the heavy parallel MCP calculations of a secondary Python container swarm.
              </p>
            </div>

            {/* Micro infographics or animated logo loop */}
            <div className="w-full bg-slate-50 border border-slate-100/80 p-4.5 rounded-[24px] space-y-3">
              <span className="text-[9px] font-extrabold text-[#0a1b33] uppercase font-mono block">Node Consensus Ratios</span>
              <div className="flex gap-4 font-mono text-left">
                <div className="flex-1">
                  <span className="text-[9px] text-slate-400 block uppercase">Network Latency</span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    31ms
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-slate-400 block uppercase">Gateway Proxy</span>
                  <span className="text-sm font-bold text-[#0a1b33] font-mono">127.0.0.1:3000</span>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-slate-400 block uppercase">Calculations Zone</span>
                  <span className="text-sm font-bold text-indigo-600 font-mono">Swarm (4 Nodes)</span>
                </div>
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-200/40 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-mono">Foundation ✦ v2.4.0</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-600 font-semibold font-mono">Core Hub Normal</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
