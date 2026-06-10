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
    id: "technical",
    name: "Quantitative Signal Engine",
    role: "Indicators, Order-Flow & CVD Logs",
    icon: TrendingUp,
    badge: "Technical Index",
    description: "Computes exponential moving averages on multiple time intervals, relative strength index (RSI) ranges, and cumulative volume delta.",
    telemetry: ["EMA Support Multi-Bands", "Consolidated Spot/Futures CVD", "Momentum RSI Intercept"],
    status: "SCANNING DATA",
    colorBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
    gradient: "from-emerald-500/5 to-teal-500/5 hover:border-emerald-200 hover:shadow-emerald-500/5"
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

export default function App() {
  const [activeTab, setActiveTab] = useState<"console" | "ledger" | "status">("console");
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  const [customCoinInput, setCustomCoinInput] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [latestDecision, setLatestDecision] = useState<Decision | null>(null);
  const [ledgerData, setLedgerData] = useState<Decision[]>([
    {
      coin: "BTC",
      action: "BUY",
      confidence: 84,
      rationale: "Bitcoin exhibits strong accumulation trends with institutional custody integrations. Cumulative Volume Delta (CVD) represents massive spot bidding across Coinbase and Binance desks, supported by stablecoin liquidity inflow.",
      committeeVotes: { bullish: 4, bearish: 0, neutral: 1 },
      analystReports: [
        {
          analyst: "macro",
          signal: "BULLISH",
          confidence: 80,
          summary: "Aggregated stablecoin minting velocities show active USD capital inflows.",
          keyPoints: ["USD stable liquidity expanding", "OTC desks reporting depletion"]
        },
        {
          analyst: "technical",
          signal: "BULLISH",
          confidence: 85,
          summary: "Consolidating key averages point to exponential support levels.",
          keyPoints: ["200 EMA support tested", "Bullish MACD structures aligned"]
        },
        {
          analyst: "sentiment",
          signal: "BULLISH",
          confidence: 82,
          summary: "Derivatives leverage resets completed during recent consolidation phases.",
          keyPoints: ["Mempool mining rates healthy", "Orderbook depth positive bias"]
        },
        {
          analyst: "market_intel",
          signal: "BULLISH",
          confidence: 88,
          summary: "Whale inventory tracking networks report active transfers to long-term storage.",
          keyPoints: ["Exchange reserves near lows", "OTC desks experiencing drawdowns"]
        },
        {
          analyst: "news",
          signal: "NEUTRAL",
          confidence: 65,
          summary: "Institutional ETF inflow volumes remain steady with positive net backing.",
          keyPoints: ["Prospectus files verified", "ETF net absorption high"]
        }
      ],
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      coin: "SOL",
      action: "BUY",
      confidence: 78,
      rationale: "Solana showcases exceptional transaction speed retention and parallel compute utilization. Decentralized exchange volumes have surpassed mainnet peers, reflecting massive retail momentum.",
      committeeVotes: { bullish: 3, bearish: 1, neutral: 1 },
      analystReports: [
        {
          analyst: "macro",
          signal: "BULLISH",
          confidence: 76,
          summary: "Active validator stakes and on-chain fee generations are peaking.",
          keyPoints: ["Fee capture indexes high", "Validator growth uniform"]
        },
        {
          analyst: "technical",
          signal: "BULLISH",
          confidence: 81,
          summary: "Breakout confirmed on high volume above current regional ranges.",
          keyPoints: ["RSI showing bullish diverging momentum", "Golden cross formation"]
        },
        {
          analyst: "sentiment",
          signal: "BULLISH",
          confidence: 75,
          summary: "Extreme social volume multipliers combined with minor liquidation cascades.",
          keyPoints: ["Leverage spikes cleared", "Social consensus absolute high"]
        },
        {
          analyst: "market_intel",
          signal: "NEUTRAL",
          confidence: 60,
          summary: "Venture allocation flow charts show consolidation before major ecosystem releases.",
          keyPoints: ["Protocol lockups intact", "Grant funds active"]
        },
        {
          analyst: "news",
          signal: "BULLISH",
          confidence: 72,
          summary: "Approval of spot custodian vehicles driving high institutional speculative interest.",
          keyPoints: ["Institutional prospectus draft", "Regulatory clearance positive"]
        }
      ],
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ]);
  const [selectedLedgerIndex, setSelectedLedgerIndex] = useState<number>(-1);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: "active",
    lastRun: new Date().toISOString(),
    lastDecision: "BUY",
    lastConfidence: 84
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

  // Sync state data on mount - purely client-side offline mock mode
  useEffect(() => {
    if (ledgerData.length > 0 && !latestDecision) {
      setLatestDecision(ledgerData[0]);
    }
  }, []);

  const fetchStatus = async () => {
    // Pure offline mode - state is preserved locally
    console.log("Client-side design environment active. Status API is decoupled.");
  };

  const fetchDecisions = async () => {
    // Pure offline mode - state is preserved locally
    console.log("Client-side design environment active. Decisions are loaded statically.");
  };

  const executeAdvisoryAnalysis = async (coinSymbol: string) => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setLogs([]);
    
    const targetSymbol = coinSymbol.toUpperCase().trim() || "BTC";
    
    // Detailed step-by-step interactive log feed
    const steps = [
      { text: "⚡ Initializing Fusion advisory container node...", delay: 300 },
      { text: "🔌 Models connected. Simulating offline local server connect...", delay: 600 },
      { text: "📡 Model Context Protocol loaded mock dataset for prompt synthesis...", delay: 900 },
      { text: "🧠 Technical Analyst initiated. Evaluating simulated EMA and CVD data...", delay: 1300 },
      { text: "📊 Macro Analyst triggered. Plotting stablecoin volume indicators...", delay: 1700 },
      { text: "💬 Sentiment and On-Chain swarm scanning social graphs...", delay: 2100 },
      { text: "🗳️ News Analyst gathering mock filings and RSS ticker logs...", delay: 2500 },
      { text: "🧩 Advisory algorithm compiling votes from 5 parallel containers...", delay: 2900 }
    ];

    let stepIndex = 0;
    const logInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[stepIndex].text}`]);
        stepIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    // Dynamic, responsive client-side simulated generation
    setTimeout(() => {
      clearInterval(logInterval);
      const fallback = generateSyntheticDecision(targetSymbol);
      setLatestDecision(fallback);
      setLedgerData(prev => [fallback, ...prev]);
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 🪐 SYNTHESIS COMPLETE (Offline Safe Mode). Recommendation: ${fallback.action} (${fallback.confidence}% Conf)`
      ]);
      setSystemStatus({
        status: "running",
        lastRun: new Date().toISOString(),
        lastDecision: fallback.action,
        lastConfidence: fallback.confidence
      });
      setIsAnalyzing(false);
    }, 3800);
  };

  const generateSyntheticDecision = (symbol: string): Decision => {
    const isBull = symbol === "BTC" || symbol === "SOL";
    const act = isBull ? "BUY" : "HOLD";
    const conf = isBull ? 84 : 58;

    return {
      coin: symbol,
      action: act,
      confidence: conf,
      rationale: `${symbol} exhibits consolidated price behavior hovering immediately over local key support zones. Derivatives funding rates show baseline resets while stablecoin issuance rates maintain expansion trends, reflecting organic buy momentum rather than speculative overleverage.`,
      committeeVotes: {
        bullish: isBull ? 4 : 2,
        bearish: 0,
        neutral: isBull ? 1 : 3
      },
      analystReports: [
        {
          analyst: "macro",
          signal: "BULLISH",
          confidence: 78,
          summary: "Improving stablecoin liquidity & softening Treasury pressures.",
          keyPoints: ["Treasury injection index active", "M2 money supply positive turn", "Sovereign liquidity inflow potential"]
        },
        {
          analyst: "technical",
          signal: isBull ? "BULLISH" : "NEUTRAL",
          confidence: 82,
          summary: "RSI consolidating at 54, EMA 200 acting as clear structural support.",
          keyPoints: ["Bollinger Band squeezing on 4h timeframe", "MACD bullish histogram expand", "Spot CVD breakout"]
        },
        {
          analyst: "sentiment",
          signal: "BULLISH",
          confidence: 80,
          summary: "Spot order books report strong buy grids matching local key liquidity levels.",
          keyPoints: ["Spot exchange balances negative", "Short liquidations ready to cascade", "High social conversation rates"]
        },
        {
          analyst: "market_intel",
          signal: "BULLISH",
          confidence: 76,
          summary: "Active whale wallet accumulation addresses rising dramatically.",
          keyPoints: ["Multi-sig cold storage intake up", "OTC desk inventories severely low", "Exchange reserve outflux trend"]
        },
        {
          analyst: "news",
          signal: "NEUTRAL",
          confidence: 65,
          summary: "Pending Q3 custody product announcement of major institutional asset desks.",
          keyPoints: ["Custodial framework updates", "Macro inflation reviews safe", "Volume multipliers active"]
        }
      ],
      timestamp: new Date().toISOString()
    };
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
    <div className="min-h-screen bg-[#f9fafb] flex flex-col justify-between py-6 px-4 md:px-8 overflow-hidden font-sans select-none">
      
      {/* Platform Header Metadata Panel */}
      <header className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0a152d] flex items-center justify-center text-white font-bold select-none text-sm">
            ✦
          </div>
          <div>
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
            <Clock className="w-32.5 h-3.5 text-slate-400 shrink-0" />
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
            className="flex-1 flex flex-col justify-center"
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
                <span className="text-[11px] font-semibold text-[#0a152d]">5 Autonomous Swarm Analysts</span>
              </div>
              <div className="bg-[#0a152d]/5 border border-[#0a152d]/10 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-[#0a152d]" />
                <span className="text-[11px] font-semibold text-[#0a152d]">MCP Tool Context Integration</span>
              </div>
            </div>

            {/* Contact Button */}
            <div className="flex items-center gap-3">
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
              
              <div className="hidden sm:inline-flex flex-col text-[10px] text-slate-500 font-mono">
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

      {/* 5. Premium Analysts Cards Grid */}
      <div 
        id="analysts-cards-section"
        className="mt-8 mb-4 w-full max-w-[1400px] mx-auto px-4 py-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
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

      {/* 4. Floating Bottom Navbar positioned just under the cards */}
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

          {/* Standard Navigation Links */}
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

          {/* "Get in touch" Action Button */}
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
            {/* Header tab details based on current view selected in nav */}
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 mb-2 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
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
                    <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
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

                    {/* Active Work Console display when running */}
                    {isAnalyzing ? (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-[250px] flex flex-col justify-between font-mono">
                        <div className="overflow-y-auto space-y-1.5 text-[10px] text-slate-300 flex-1 pr-1 scrollbar-thin">
                          {logs.map((log, index) => (
                            <div key={index} className="leading-relaxed border-l-2 border-slate-700 pl-2">
                              {log}
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-800 shrink-0 flex items-center justify-between">
                          <span className="text-[9px] text-[#0a1b33] animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                            Parallel MCP Containers Active...
                          </span>
                          <span className="text-[10px] text-slate-500">Processing Node</span>
                        </div>
                      </div>
                    ) : latestDecision ? (
                      /* Display actual outcome if decision present */
                      <div className="space-y-3">
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
                            <div className={`px-4 py-2.5 rounded-2xl border text-center ${getActionTheme(latestDecision.action).bg}`}>
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

                          <p className="text-[11px] text-slate-600 line-clamp-3 mt-3 leading-relaxed border-l-2 border-indigo-200/60 pl-2 whitespace-pre-line">
                            {latestDecision.rationale}
                          </p>
                        </div>

                        {/* Split analyst votes and keys */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block">Council Votes</span>
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
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase block">Detailed Reports</span>
                              <span className="text-[10px] font-extrabold text-indigo-600">Browse Swarm Logs →</span>
                            </div>
                            <History className="w-4 h-4 text-indigo-500" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Welcome Prompt */
                      <div className="flex flex-col items-center justify-center h-[245px] border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/30 p-4 text-center">
                        <Workflow className="w-8 h-8 text-indigo-400/80 mb-2 animate-bounce" />
                        <h4 className="text-[12px] font-bold text-[#0a1b33]">No Active Advisory Files Loaded</h4>
                        <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                          Click \"Initialize Advisory Run\" or select a coin asset to engage the autonomous 5-agent advisory swarm.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/40 shrink-0">
                    <button
                      onClick={() => executeAdvisoryAnalysis(selectedCoin)}
                      disabled={isAnalyzing}
                      className="w-full bg-[#0a152d] text-white rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-[#122345] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Running Autopilot Analysts...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Activate Swarm Advisory Consensus Mode (✦)
                        </>
                      )}
                    </button>
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
                  className="flex-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3">
                    {/* Left side: List of runs */}
                    <div className="w-full md:w-[35%] overflow-y-auto border-r border-slate-200/40 pr-2 space-y-1.5 max-h-[380px] md:max-h-full">
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
                            <div className="flex items-center justify-between">
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
                    <div className="flex-1 overflow-y-auto max-h-[380px] md:max-h-full bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
                      {(() => {
                        const activeItem = ledgerData[selectedLedgerIndex !== -1 ? selectedLedgerIndex : 0];
                        if (!activeItem) return <div className="text-slate-400 text-center py-10 text-[11px]">No run payload selected.</div>;
                        
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                              <h5 className="text-[12px] font-bold text-[#0a1b33]">Swarm Payload: {activeItem.coin}</h5>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(activeItem.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 italic">
                              "{activeItem.rationale}"
                            </p>

                            {/* Reports Accordion Tab */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block">
                                Swarm Analyst Segment Files
                              </span>
                              
                              <div className="flex gap-1 overflow-x-auto pb-1">
                                {["macro", "technical", "sentiment", "market_intel", "news"].map((at) => (
                                  <button
                                    key={at}
                                    onClick={() => setActiveAnalystTab(at)}
                                    className={`px-2 py-1 rounded-lg text-[9px] uppercase font-bold tracking-wider shrink-0 transition-all ${
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
                                const rep = activeItem.analystReports?.find(r => r.analyst === activeAnalystTab) || 
                                            activeItem.analystReports?.[0];
                                if (!rep) return <div className="text-[10px] text-slate-400">Analyst file omitted.</div>;
                                return (
                                  <div className="bg-white border border-slate-200/60 p-2.5 rounded-xl space-y-1.5 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold uppercase text-indigo-600">{rep.analyst} file report</span>
                                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                        Signal: {rep.signal} | Conf: {rep.confidence}%
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-600 leading-relaxed font-sans">{rep.summary}</p>
                                    
                                    {rep.keyPoints && rep.keyPoints.length > 0 && (
                                      <div className="pt-1.5 border-t border-slate-100 space-y-1">
                                        <span className="text-[8px] font-extrabold text-slate-400 uppercase font-mono block">Core telemetry data:</span>
                                        <div className="flex flex-wrap gap-1">
                                          {rep.keyPoints.map((kp, ki) => (
                                            <span key={ki} className="text-[8.5px] bg-slate-50 border border-slate-200/40 text-slate-600 px-2 py-0.5 rounded-full font-mono">
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

                  <div className="pt-2 border-t border-slate-200/40 flex justify-between gap-2 shrink-0">
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
                  className="flex-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div className="space-y-3">
                      <h4 className="text-[12px] font-bold text-[#0a1b33]">System Config: Swarm Node Coordinates</h4>
                      
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] text-slate-400 font-mono">Model Engine</span>
                          <span className="text-[11px] font-extrabold text-[#0a1b33] mt-1 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            <Cpu className="w-3.5 h-3.5 text-[#0a1b33]" />
                            gemini-2.5-flash
                          </span>
                        </div>
                        
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] text-slate-400 font-mono">MCP Protocol Tunnel</span>
                          <span className="text-[11px] font-extrabold text-indigo-600 mt-1 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            <Workflow className="w-3.5 h-3.5 text-[#0a1b33]" />
                            DataHub MCPS
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/60 p-3.5 rounded-2xl space-y-2">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block">Registered Tools Inventory</span>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono p-1 rounded hover:bg-slate-50">
                            <span>🛠️ get_balance / get_supply</span>
                            <span className="text-emerald-600">Attached</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono p-1 rounded hover:bg-slate-50">
                            <span>📊 query_index / fetch_indicators</span>
                            <span className="text-emerald-600">Attached</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono p-1 rounded hover:bg-slate-50 font-sans">
                            <span>📰 fetch_breaking_news / RSS</span>
                            <span className="text-emerald-700 font-mono">Attached</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-2xl flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          <strong>Note about API execution Keys:</strong> Credentials and environment secrets reside inside host `.env` settings. The proxy layer bridges requests directly to container microservices without displaying them to the browser client.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/40 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block text-center">
                      FastAPI microserver running at 0.0.0.0:3001
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

        {/* Right column: Reserved workspace slot for upcoming elements */}
        <div id="right-workspace-column" className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-[510px] bg-slate-50 border border-dashed border-slate-200/80 rounded-[32px] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-[13px] font-bold text-[#0a1b33] font-sans">Workspace Slot</h3>
            <p className="text-[11px] text-slate-400 max-w-sm mt-1.5 leading-relaxed font-sans">
              This space resides on the right column. It is ready for custom charts, deep research outputs, or additional monitoring modules of your choice.
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
