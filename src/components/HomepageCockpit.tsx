import React from "react";
import { 
  ChevronRight, 
  TrendingUp, 
  Cpu, 
  Database, 
  Terminal, 
  Check, 
  X, 
  Clock, 
  RefreshCw, 
  ShieldAlert, 
  AlertCircle,
  History,
  Workflow,
  Sparkles,
  Globe,
  Users,
  Newspaper,
  Coins,
  Zap,
  Activity,
  Volume2,
  VolumeX,
  Download,
  FileText,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Decision, SystemStatus } from "../types";
import { ExecutiveMemorandum } from "./ExecutiveMemorandum";

const analystsList = [
  {
    id: "macro",
    name: "Macro Analyst",
    role: "Global Macro & Equity Capital Flows",
    icon: Globe,
    badge: "Liquidity Index",
    description: "Monitors sovereign central bank reserves, corporate treasury cash flows, and aggregate legacy and tokenized equity flow metrics.",
    telemetry: ["Corporate Cash Squeeze", "USD Liquidity Index", "DXY Momentum Tracker"],
    status: "SYNCHRONIZED",
    colorBg: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    gradient: "from-blue-500/5 to-indigo-500/10 hover:border-blue-200 hover:shadow-blue-500/5"
  },
  {
    id: "sentiment",
    name: "Sentiment Analyst",
    role: "Social Media Mining & Depth Chart",
    icon: Users,
    badge: "Sentiment Index",
    description: "Crawls institutional order books, liquidation heatmaps, and scans social micro-trends for retail and institutional bias ratios.",
    telemetry: ["Liquidation Heatmaps", "Social Volume Multipliers", "Ask/Bid Depth Imbalance"],
    status: "MONITORING ORDERBOOKS",
    colorBg: "bg-purple-500/10 border-purple-500/20 text-purple-600",
    gradient: "from-purple-500/5 via-pink-500/5 to-rose-500/5 hover:border-purple-200 hover:shadow-purple-500/5"
  },
  {
    id: "market_intel",
    name: "Market Intel Analyst",
    role: "Institutional Fund Flows & Equity Ledger Audits",
    icon: Coins,
    badge: "Whale Tracker",
    description: "Monitors dark pool block-trades, specialized market maker inventory drawdown rates, and corporate treasure buyback frequencies.",
    telemetry: ["Institutional Block Inflows", "Dark Pool Vault Drawdowns", "Ledger Net Inventory Flows"],
    status: "MONITORING LEDGERS",
    colorBg: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    gradient: "from-yellow-500/5 to-amber-500/5 hover:border-amber-200 hover:shadow-amber-500/5"
  },
  {
    id: "news",
    name: "News & Narrative Analyst",
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
  { name: "rates_yields", desc: "Monitors central bank policies, sovereign bond yields, interest rate changes, and yield curve spreads." },
  { name: "macro_indicators", desc: "Pulls inflation data (CPI/PCE), unemployment rates, and global industrial manufacturing/GDP growth metrics." },
  { name: "global_assets", desc: "Correlates traditional equity indices (S&P 500, Nasdaq), Gold, and US Dollar Index (DXY) aggregate performance." },
  { name: "cross_asset", desc: "Calculates regressions and correlations of tokenized equity assets against other legacy assets and global indexes." },
  { name: "tradfi_news", desc: "Pulls institutional macro commentary, Wall Street market notes, and economic policy releases." },
  { name: "cn_market", desc: "Monitors Chinese macroeconomic vectors, equity indices, renminbi liquidity, and policy directives." },
  { name: "global_data", desc: "Broad macro database index query tool linking liquidity, commodities, and credit market conditions." },
  { name: "technical_analysis", desc: "Computes multi-timeband Simple/Exponential Moving Averages, RSI, MACD, and Bollinger Bands." },
  { name: "crypto_derivatives", desc: "Fetches equity options volume, open interest changes, put-to-call ratio, and implied volatility distributions." },
  { name: "backtest", desc: "Synthesizes multi-period quantitative rule backtests based on customized trend-following parameters." },
  { name: "sentiment_index", desc: "Analyzes social sentiment intensity, active market discussion volume, and keyword fear/greed velocity." },
  { name: "derivatives_sentiment", desc: "Monitors real-time options open interest ratios, leverage structures, and aggregate long/short option positions." },
  { name: "crypto_market", desc: "Checks global tokenized stock market capitalization, market weight / equity share, and daily transaction volumes." },
  { name: "defi_analytics", desc: "Tracks aggregate Equity Capital Flows (Earnings Valuation), equities orderbook depth & settlement fees, and share class variations." },
  { name: "dex_market", desc: "Audits alternative trading systems, order depth curves, arbitrage margins, and tokenized stock liquidity pools." },
  { name: "network_status", desc: "Pulls transfer agent network health status, settlement confirmations, and security deposit velocity." },
  { name: "crypto_price", desc: "Queries precise, sub-second equity spot exchange prices and cumulative historical candlestick datasets." },
  { name: "news_feed", desc: "Aggregates real-time financial news publications, premium market wires, and SEC filing updates." },
  { name: "social_trending", desc: "Monitors viral social terms, ticker velocity on major platforms, and high-impact developer activity." }
];

const TOUR_STEPS = [
  {
    title: "1. Select Your Target Asset",
    description: "Choose a pre-configured Stock (like Apple or Nvidia) or Cryptocurrency (like Bitcoin or Ethereum) from the left sidebar of the Advisory panel. You can also type any custom asset symbol at the bottom text field (e.g., LINK, AAPL)!",
  },
  {
    title: "2. Choose Analysis Intensity Mode",
    description: "Toggle between 'Fast' mode (swift, streamlined 2-round multi-agent synthesis) and 'Full' mode (intensive, 4-round deep reasoning incorporating historical files and media sentiment trends).",
  },
  {
    title: "3. Trigger Advisory Committee Swarm",
    description: "Click 'Trigger Analysis' to launch the specialist research analysts (Macro, Sentiment, Market Intel, News) in parallel to retrieve real-time data and begin their collaborative consensus deliberations.",
  },
  {
    title: "4. Monitor Live Telemetry Logs",
    description: "Watch unedited terminal logs and raw API records stream in real-time. Once the audit run is complete, you can download the PDF memo report or listen to the spoken consensus!",
  }
];

interface HomepageCockpitProps {
  currentTime: string;
  selectedCoin: string;
  setSelectedCoin: (coin: string) => void;
  customCoinInput: string;
  setCustomCoinInput: (input: string) => void;
  isAnalyzing: boolean;
  logs: string[];
  latestDecision: Decision | null;
  ledgerData: Decision[];
  analyzedCoinsInSession: string[];
  selectedLedgerIndex: number;
  setSelectedLedgerIndex: (idx: number) => void;
  systemStatus: SystemStatus;
  activeTab: "console" | "ledger" | "status";
  setActiveTab: (tab: "console" | "ledger" | "status") => void;
  activeAnalystTab: string;
  setActiveAnalystTab: (tab: string) => void;
  executeAdvisoryAnalysis: (coin: string, mode?: string, category?: string) => void;
  cancelAnalysis: () => void;
  fetchDecisions: () => void;
  normalizeAnalystName: (name: string) => string;
  getActionTheme: (action: string) => { bg: string; dots: string };
  onBack: () => void;
}

function AssetLogo({ symbol, logoUrl }: { symbol: string, logoUrl: string }) {
  const [hasError, setHasError] = React.useState(false);

  // Fallback for known unstable/missing paths or when an error triggers
  const isKnownUnstableLogo = !logoUrl || ["solana.png", "binance-coin.png", "dogecoin.png", "cardano.png", "polkadot.png"].some(name => logoUrl.toLowerCase().includes(name));

  if (hasError || isKnownUnstableLogo) {
    const getThemeColors = (sym: string) => {
      const s = sym.trim().toUpperCase();
      switch (s) {
        case "AAPL": return { bg: "bg-slate-100 text-slate-800 border-slate-300", text: "A" };
        case "NVDA": return { bg: "bg-emerald-50 text-emerald-600 border-emerald-200", text: "N" };
        case "TSLA": return { bg: "bg-red-50 text-red-600 border-red-200", text: "T" };
        case "MSFT": return { bg: "bg-blue-50 text-blue-600 border-blue-200", text: "M" };
        case "AMZN": return { bg: "bg-amber-50 text-amber-650 border-amber-200", text: "A" };
        case "GOOG": return { bg: "bg-blue-50 text-blue-500 border-blue-200", text: "G" };
        case "META": return { bg: "bg-indigo-50 text-indigo-600 border-indigo-200", text: "M" };
        case "AMD": return { bg: "bg-red-50 text-red-500 border-red-200", text: "A" };
        case "BTC": return { bg: "bg-amber-500 text-white border-amber-600 font-extrabold", text: "₿" };
        case "ETH": return { bg: "bg-indigo-500 text-white border-indigo-600 font-extrabold", text: "Ξ" };
        case "SOL": return { bg: "bg-purple-600 text-white border-purple-700 font-extrabold", text: "S" };
        case "BNB": return { bg: "bg-yellow-500 text-amber-950 border-yellow-600 font-extrabold", text: "B" };
        case "XRP": return { bg: "bg-sky-500 text-white border-sky-600 font-bold", text: "X" };
        case "DOGE": return { bg: "bg-amber-400 text-amber-950 border-amber-500 font-extrabold", text: "Ð" };
        case "ADA": return { bg: "bg-blue-600 text-white border-blue-700 font-bold", text: "₳" };
        case "DOT": return { bg: "bg-pink-600 text-white border-pink-700 font-bold", text: "●" };
        default: return { bg: "bg-slate-100 text-slate-600 border-slate-300", text: s.charAt(0) || "?" };
      }
    };

    const config = getThemeColors(symbol);
    return (
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] border ${config.bg} shrink-0 overflow-hidden shadow-2xs font-sans font-black leading-none`}>
        {config.text}
      </div>
    );
  }

  return (
    <img 
      src={logoUrl} 
      alt={symbol} 
      className="w-3.5 h-3.5 object-contain shrink-0" 
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

export default function HomepageCockpit({
  currentTime,
  selectedCoin,
  setSelectedCoin,
  customCoinInput,
  setCustomCoinInput,
  isAnalyzing,
  logs,
  latestDecision,
  ledgerData,
  analyzedCoinsInSession,
  selectedLedgerIndex,
  setSelectedLedgerIndex,
  systemStatus,
  activeTab,
  setActiveTab,
  activeAnalystTab,
  setActiveAnalystTab,
  executeAdvisoryAnalysis,
  cancelAnalysis,
  fetchDecisions,
  normalizeAnalystName,
  getActionTheme,
  onBack
}: HomepageCockpitProps) {
  const terminalContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [analysisMode, setAnalysisMode] = React.useState<"fast" | "full">("fast");
  const [sidebarTab, setSidebarTab] = React.useState<"stocks" | "crypto">("crypto");
  const [speakingText, setSpeakingText] = React.useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);
  const [memoDecision, setMemoDecision] = React.useState<Decision | null>(null);
  const [copiedLogs, setCopiedLogs] = React.useState<boolean>(false);

  // Onboarding Guided Tour state
  const [tourActive, setTourActive] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("omnisignal_tour_completed");
      return completed !== "true";
    }
    return false;
  });
  const [tourStarted, setTourStarted] = React.useState<boolean>(false);
  const [currentStep, setCurrentStep] = React.useState<number>(0);

  // Auto-switch back to "console" tab during the tour so elements are visible
  React.useEffect(() => {
    if (tourActive && tourStarted) {
      setActiveTab("console");
    }
  }, [tourActive, tourStarted, setActiveTab]);

  const handleCopyLogs = () => {
    const logsToCopy = logs.length > 0 ? logs : [
      `[SYSTEM] Terminal ready. Awaiting live telemetry logs...`
    ];
    try {
      navigator.clipboard.writeText(logsToCopy.join("\n"));
      setCopiedLogs(true);
      setTimeout(() => {
        setCopiedLogs(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy logs to clipboard", err);
    }
  };

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingText(null);
    }
  };

  const speakSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking && speakingText === text) {
      stopSpeech();
      return;
    }

    // Stop active speech first
    window.speechSynthesis.cancel();

    // Clean text of visual markers
    const cleanText = text.replace(/[✦🟢⚪🔴]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Bind available high-quality English voice if accessible
    if (window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || 
                              voices.find(v => v.lang.startsWith("en"));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingText(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingText(null);
    };

    setSpeakingText(text);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const exportLedgerToCSV = () => {
    if (ledgerData.length === 0) return;
    
    // Find all unique analyst titles in the complete ledger
    const uniqueAnalysts: string[] = [];
    ledgerData.forEach(item => {
      if (item.analystReports) {
        item.analystReports.forEach(rep => {
          if (rep.analyst && !uniqueAnalysts.includes(rep.analyst)) {
            uniqueAnalysts.push(rep.analyst);
          }
        });
      }
    });

    // Create the headers
    const headers = [
      "Coin", 
      "Action", 
      "Confidence (%)", 
      "Timestamp", 
      "Committee Votes (Bullish)", 
      "Committee Votes (Bearish)", 
      "Committee Votes (Neutral)",
      "Rationale"
    ];

    // For each unique analyst, add corresponding output columns
    uniqueAnalysts.forEach(analyst => {
      headers.push(
        `Analyst ${analyst} Signal`,
        `Analyst ${analyst} Confidence (%)`,
        `Analyst ${analyst} Summary`,
        `Analyst ${analyst} Key Points`
      );
    });
    
    const rows = ledgerData.map(item => {
      const coin = `"${(item.coin || "").replace(/"/g, '""')}"`;
      const action = `"${(item.action || "").replace(/"/g, '""')}"`;
      const confidence = `${item.confidence}`;
      const timestamp = `"${new Date(item.timestamp).toLocaleString().replace(/"/g, '""')}"`;
      
      const bullish = `${item.committeeVotes?.bullish ?? 0}`;
      const bearish = `${item.committeeVotes?.bearish ?? 0}`;
      const neutral = `${item.committeeVotes?.neutral ?? 0}`;
      
      const rationale = `"${(item.rationale || "").replace(/"/g, '""')}"`;
      
      const rowData = [
        coin, 
        action, 
        confidence, 
        timestamp, 
        bullish, 
        bearish, 
        neutral, 
        rationale
      ];

      // Match corresponding reports for each unique analyst
      uniqueAnalysts.forEach(analyst => {
        const rep = item.analystReports?.find(r => r.analyst === analyst);
        if (rep) {
          const sig = `"${(rep.signal || "").replace(/"/g, '""')}"`;
          const conf = `${rep.confidence ?? ""}`;
          const summ = `"${(rep.summary || "").replace(/"/g, '""')}"`;
          const kp = `"${(rep.keyPoints ? rep.keyPoints.join("; ") : "").replace(/"/g, '""')}"`;
          rowData.push(sig, conf, summ, kp);
        } else {
          // If this analyst did not review this coin, put empty cells
          rowData.push("", "", "", "");
        }
      });

      return rowData;
    });

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `committee_ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const matchedDecision = ledgerData.find(
    (d) => d.coin?.trim().toUpperCase() === selectedCoin.trim().toUpperCase()
  );
  const isSessionReport = analyzedCoinsInSession.some(
    (c) => c.trim().toUpperCase() === selectedCoin.trim().toUpperCase()
  );

  React.useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div
      key="homepage-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Platform Header Metadata Panel */}
      <header className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-4 text-left pt-4">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#0a152d]/5 hover:bg-[#0a152d]/15 border border-slate-200/70 flex items-center justify-center text-[#0a152d] font-bold select-none text-base cursor-pointer transition-all shrink-0 shadow-sm"
          >
            ←
          </button>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0a152d] to-[#1e293b] flex items-center justify-center text-white select-none shadow-md shadow-[#0a152d]/10 border border-slate-700/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/25 to-transparent opacity-30" />
            <Activity className="w-5.5 h-5.5 text-emerald-400 stroke-[2.5] relative z-10" />
          </div>
          <div className="text-left">
            <h2 className="text-[17px] font-display font-extrabold text-[#0a1b33] tracking-tight uppercase block leading-none">
              OMNISIGNAL
            </h2>
            <p className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-1.5">
              Crypto & Stocks Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <button
            onClick={() => {
              setTourActive(true);
              setTourStarted(true);
              setCurrentStep(0);
            }}
            className="font-sans text-[11px] font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 px-4 py-1.5 rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200"
            title="Launch interactive app guide"
          >
            <span>Walkthrough</span>
          </button>

          <a
            href="https://x.com/Michelangelo_0_/status/2068593661986640209?s=20"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.5)] border border-indigo-500 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 duration-200 animate-pulse"
          >
            <span>Watch Demo Video</span>
          </a>
          <div className="font-mono text-[11px] text-slate-500 bg-white border border-slate-200/60 px-3 py-1 rounded-full shadow-xs flex items-center gap-2 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {currentTime || "Connecting to atomic clock..."}
          </div>
        </div>
      </header>



      {/* Floating Bottom Navbar inside Cockpit */}
      <div 
        id="floating-nav-wrapper"
        className="mt-2 mb-6 flex justify-center w-full max-w-[1400px] mx-auto px-4 relative z-30"
      >
        <motion.nav 
          id="bottom-navbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center bg-white/95 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-200/40 w-max whitespace-nowrap"
        >
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

      {/* Lower Workspace & Interactive Dashboard Grid */}
      <div 
        id="lower-dashboard-workspace"
        className="mt-4 mb-8 w-full max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-30 text-left"
      >
        {/* Left column: Swarm Advisor Cockpit Panel */}
        <div id="left-workspace-column" className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/50 rounded-[24px] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03),0_0_24px_rgba(99,102,241,0.01)] h-[510px] flex flex-col justify-between text-left transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06),0_0_30px_rgba(99,102,241,0.02)]"
          >
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 mb-2 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                {activeTab === "console" && "Swarm Advisor Laboratory"}
                {activeTab === "ledger" && `Committee Historical Ledger (${ledgerData.length})`}
                {activeTab === "status" && "Workspace Engine Hub"}
              </span>
              
              <div className="flex items-center gap-3 font-mono">
                {activeTab === "ledger" && ledgerData.length > 0 && (
                  <button
                    onClick={() => {
                      const activeItem = ledgerData[selectedLedgerIndex !== -1 ? selectedLedgerIndex : 0];
                      if (activeItem) {
                        setMemoDecision(activeItem);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-extrabold font-mono transition-all cursor-pointer bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-xs border border-indigo-500/30"
                    title="View & Download Pristine Office Document Memorandum as PDF"
                  >
                    <FileText className="w-3 h-3 text-white" />
                    <span>EXPORT REPORT</span>
                  </button>
                )}

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
                  className="flex-1 flex flex-col justify-between overflow-hidden text-left h-full"
                >
                  <div className="flex-1 flex gap-4 overflow-hidden min-h-0 text-left w-full h-full pb-1">
                    {/* Left Sidebar for Stocks, Crypto & Custom Inputs */}
                    <div className="w-[140px] shrink-0 border-r border-slate-100 pr-3 flex flex-col justify-between h-full py-0.5">
                      <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 p-1 rounded-xl border border-transparent">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase font-mono block mb-1 text-left">
                          Asset Target
                        </span>

                        {/* Sub-selector tabs to toggle between Stocks and Crypto */}
                        <div className="flex gap-0.5 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/50 mb-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSidebarTab("stocks");
                              setSelectedCoin("AAPL");
                              setCustomCoinInput("");
                            }}
                            className={`flex-1 py-1 text-[9px] font-bold rounded-md cursor-pointer transition-all text-center leading-none ${
                              sidebarTab === "stocks"
                                ? "bg-white text-[#0a152d] shadow-2xs font-extrabold"
                                : "text-slate-500 hover:text-slate-700 bg-transparent"
                            }`}
                          >
                            Stocks
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSidebarTab("crypto");
                              setSelectedCoin("BTC");
                              setCustomCoinInput("");
                            }}
                            className={`flex-1 py-1 text-[9px] font-bold rounded-md cursor-pointer transition-all text-center leading-none ${
                              sidebarTab === "crypto"
                                ? "bg-white text-[#0a152d] shadow-2xs font-extrabold"
                                : "text-slate-500 hover:text-slate-700 bg-transparent"
                            }`}
                          >
                            Crypto
                          </button>
                        </div>

                        {(sidebarTab === "stocks" ? [
                          { symbol: "AAPL", name: "Apple", logo: "https://img.icons8.com/ios-filled/100/000000/mac-os.png" },
                          { symbol: "NVDA", name: "NVIDIA", logo: "https://img.icons8.com/color/100/nvidia.png" },
                          { symbol: "TSLA", name: "Tesla", logo: "https://img.icons8.com/ios-filled/100/tesla-logo.png" },
                          { symbol: "MSFT", name: "Microsoft", logo: "https://img.icons8.com/color/100/microsoft.png" },
                          { symbol: "AMZN", name: "Amazon", logo: "https://img.icons8.com/ios-filled/100/amazon.png" },
                          { symbol: "GOOG", name: "Google", logo: "https://img.icons8.com/color/100/google-logo.png" },
                          { symbol: "META", name: "Meta", logo: "https://img.icons8.com/ios-filled/100/meta.png" },
                          { symbol: "AMD", name: "AMD", logo: "https://img.icons8.com/color/100/amd.png" }
                        ] : [
                          { symbol: "BTC", name: "Bitcoin", logo: "https://img.icons8.com/color/100/bitcoin.png" },
                          { symbol: "ETH", name: "Ethereum", logo: "https://img.icons8.com/color/100/ethereum.png" },
                          { symbol: "SOL", name: "Solana", logo: "https://img.icons8.com/color/100/solana.png" },
                          { symbol: "BNB", name: "BNB", logo: "https://img.icons8.com/color/100/binance-coin.png" },
                          { symbol: "XRP", name: "XRP", logo: "https://img.icons8.com/color/100/xrp.png" },
                          { symbol: "DOGE", name: "Dogecoin", logo: "https://img.icons8.com/color/100/dogecoin.png" },
                          { symbol: "ADA", name: "Cardano", logo: "https://img.icons8.com/color/100/cardano.png" },
                          { symbol: "DOT", name: "Polkadot", logo: "https://img.icons8.com/color/100/polkadot.png" }
                        ]).map((asset) => (
                          <button
                            key={asset.symbol}
                            onClick={() => { setSelectedCoin(asset.symbol); setCustomCoinInput(""); }}
                            className={`flex items-center gap-2 p-1.5 w-full rounded-lg border text-left transition-all cursor-pointer ${
                              selectedCoin === asset.symbol && !customCoinInput
                                ? "bg-white text-[#0a152d] border-2 border-[#0a152d] font-bold shadow-xs scale-[1.01]"
                                : "bg-white/60 text-slate-500 border-slate-200/70 hover:border-slate-300 hover:text-slate-700 opacity-80 hover:opacity-100"
                            }`}
                          >
                            <AssetLogo symbol={asset.symbol} logoUrl={asset.logo} />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold tracking-tight block leading-none">{asset.symbol}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Custom Asset Input at the bottom of the left sidebar */}
                      <div className="pt-2 border-t border-slate-200/50 shrink-0">
                        <span className="text-[8px] font-extrabold text-[#0a152d] uppercase font-mono block mb-1">
                          CUSTOM
                        </span>
                        <input 
                          type="text"
                          placeholder={sidebarTab === "stocks" ? "e.g. NFLX" : "e.g. LINK"}
                          value={customCoinInput}
                          onChange={(e) => {
                            const v = e.target.value.toUpperCase();
                            setCustomCoinInput(v);
                            setSelectedCoin(v || (sidebarTab === "stocks" ? "AAPL" : "BTC"));
                          }}
                          className={`w-full px-2 py-1 rounded-lg text-[9.5px] font-bold border text-slate-700 uppercase focus:outline-none focus:ring-1 focus:ring-[#0a152d] transition-all bg-white ${
                            customCoinInput ? "border-[#0a152d]" : "border-slate-200/70"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Right Workspace: Advisory Report & Decision Actions */}
                    <div className="flex-1 flex flex-col justify-between overflow-hidden h-full min-w-0">
                      {/* Scrollable outputs of advisory */}
                      <div className="flex-1 overflow-y-auto pr-1 pb-1 scrollbar-thin space-y-3">
                        {!isAnalyzing && matchedDecision ? (
                          <div className="space-y-3 text-left">
                            <div className="bg-white border border-slate-200/60 p-3.5 rounded-2xl shadow-xs text-left">
                              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-extrabold text-slate-400 uppercase font-mono">
                                    Council Consensus for {matchedDecision.coin}
                                  </span>
                                  {!isSessionReport ? (
                                    <span className="text-[9.5px] font-semibold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 select-none whitespace-nowrap">
                                      LAST REPORT
                                    </span>
                                  ) : (
                                    <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/40 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 select-none animate-pulse whitespace-nowrap">
                                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                                      CURRENT SESSION
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setMemoDecision(matchedDecision || null)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-extrabold font-mono transition-all cursor-pointer bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-xs border border-indigo-500/30"
                                    title="View & Download Pristine Office Document Memorandum"
                                  >
                                    <FileText className="w-3 h-3 text-white" />
                                    <span>EXPORT REPORT</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const fullReportText = `Council consensus recommendation for ${matchedDecision.coin} is ${matchedDecision.action} with ${matchedDecision.confidence} percent confidence. Here is the rationale: ${matchedDecision.rationale}`;
                                      speakSpeech(fullReportText);
                                    }}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono transition-all cursor-pointer ${
                                      isSpeaking && speakingText?.includes(matchedDecision.rationale)
                                        ? "bg-rose-600 text-white shadow-xs"
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60"
                                    }`}
                                    title={isSpeaking && speakingText?.includes(matchedDecision.rationale) ? "Stop speaking" : "Listen to report summary"}
                                  >
                                    {isSpeaking && speakingText?.includes(matchedDecision.rationale) ? (
                                      <>
                                        <VolumeX className="w-3 h-3 text-white" />
                                        <span>STOP VOICE</span>
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 className="w-3 h-3 text-indigo-500" />
                                        <span>LISTEN REPORT</span>
                                      </>
                                    )}
                                  </button>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {matchedDecision.timestamp ? new Date(matchedDecision.timestamp).toLocaleTimeString() : ""}
                                  </span>
                                </div>
                              </div>

                              {!isSessionReport && (
                                <div className="mt-1 mb-3.5 p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-left text-amber-800">
                                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                  <div className="text-[10px] leading-relaxed font-sans font-medium">
                                    <span className="font-bold">Historical Report Notice:</span> This consensus was generated in a previous session or cycle. Market conditions may have shifted. Please trigger a new analysis below for the latest intelligence.
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-3.5">
                                <div className={`px-3 py-2 rounded-xl border text-center min-w-[85px] shrink-0 ${getActionTheme(matchedDecision.action).bg}`}>
                                  <span className="text-[9px] font-extrabold font-mono uppercase text-slate-400 block tracking-wider leading-none mb-1">Recommendation</span>
                                  <span className="text-lg font-black tracking-tight leading-none">{matchedDecision.action}</span>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between text-[10.5px] font-bold text-[#0a1b33] mb-0.5">
                                    <span>Synthesis Confidence</span>
                                    <span className="font-mono text-indigo-600">{matchedDecision.confidence}%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/50">
                                    <div 
                                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full animate-pulse" 
                                      style={{ width: `${matchedDecision.confidence}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <p className="text-[11px] text-slate-600 line-clamp-3 mt-2.5 leading-relaxed border-l-2 border-indigo-200/60 pl-2 whitespace-pre-line text-left font-sans">
                                {matchedDecision.rationale}
                              </p>
                            </div>

                            {/* Council Votes and Embedded Analyst Segment Files layout */}
                            <div className="space-y-3.5 text-left">
                              <div className="bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl flex items-center justify-between font-sans">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9.5px] font-extrabold text-slate-400 uppercase font-mono">Council Votes:</span>
                                  <span className="text-[10px] font-bold text-emerald-600">🟢 {matchedDecision.committeeVotes?.bullish || 0} Bull</span>
                                  <span className="text-[10px] font-bold text-slate-400">⚪ {matchedDecision.committeeVotes?.neutral || 0} Neu</span>
                                  <span className="text-[10px] font-bold text-rose-600">🔴 {matchedDecision.committeeVotes?.bearish || 0} Bear</span>
                                </div>
                                <span className="text-[9.5px] text-slate-400 font-mono font-medium">Consensus Consolidated</span>
                              </div>

                              {/* Swarm Analyst Segment Files */}
                              <div className="space-y-2 text-left">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block">
                                  Swarm Analyst Segment Files
                                </span>
                                
                                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                                  {["macro", "sentiment", "market_intel", "news"].map((at) => (
                                    <button
                                      key={at}
                                      onClick={() => setActiveAnalystTab(at)}
                                      className={`px-2 py-0.5 rounded-md text-[8.5px] uppercase font-bold tracking-wider shrink-0 transition-colors cursor-pointer ${
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
                                  const rep = matchedDecision.analystReports?.find(r => normalizeAnalystName(r.analyst) === normalizeAnalystName(activeAnalystTab)) || 
                                              matchedDecision.analystReports?.[0];
                                  if (!rep) return <div className="text-[9.5px] text-slate-400 italic">Analyst file omitted for this run.</div>;
                                  return (
                                    <div className="bg-white border border-slate-200/60 p-2.5 rounded-xl space-y-1.5 shadow-2xs text-left">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9.5px] font-bold uppercase text-indigo-600">{rep.analyst} file report</span>
                                        <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                          Signal: {rep.signal} | Conf: {rep.confidence}%
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-600 leading-relaxed font-sans text-left">{rep.summary}</p>
                                      
                                      {rep.keyPoints && rep.keyPoints.length > 0 && (
                                        <div className="pt-1.5 border-t border-slate-100 space-y-1 text-left">
                                          <span className="text-[8px] font-extrabold text-slate-400 uppercase font-mono block text-left">Core telemetry:</span>
                                          <div className="space-y-1">
                                            {rep.keyPoints.map((kp, ki) => (
                                              <div key={ki} className="flex items-start gap-1.5 text-[9.5px] text-slate-600 leading-relaxed font-sans text-left">
                                                <span className="text-indigo-500 font-bold select-none leading-none pt-[3px]">✦</span>
                                                <span className="flex-1">{kp}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ) : !isAnalyzing && logs.length === 0 ? (
                          /* Welcome Prompt */
                          <div className="flex flex-col items-center justify-center h-[240px] border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/30 p-4 text-center my-auto">
                            <Terminal className="w-6 h-6 text-indigo-400/80 mb-2" />
                            <h4 className="text-[12px] font-bold text-[#0a1b33]">System Standby</h4>
                            <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                              Select a target asset from the left panel and click 'Trigger Analysis' to initiate a multi-agent consensus run.
                            </p>
                          </div>
                        ) : null}
                      </div>

                      {/* Mode Switcher Block inside right container */}
                      <div className="pt-2 border-t border-slate-200/40 flex items-center justify-between gap-2 w-full text-left shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider font-mono">
                            Mode:
                          </span>
                          <div className="flex gap-0.5 bg-slate-100/85 p-0.5 rounded-lg border border-slate-200/50">
                            <button
                              type="button"
                              disabled={isAnalyzing}
                              onClick={() => setAnalysisMode("fast")}
                              className={`px-2 py-0.5 text-[9.5px] font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                                analysisMode === "fast"
                                  ? "bg-[#0a152d] text-white shadow-xs"
                                  : "text-slate-500 hover:text-slate-700 bg-transparent disabled:opacity-50"
                              }`}
                              title="⚡ Fast Mode: Est. 30-45s run, 2-round reasoning, streamlined indicator sets."
                            >
                              <Zap className="w-2.5 h-2.5" />
                              Fast
                            </button>
                            <button
                              type="button"
                              disabled={isAnalyzing}
                              onClick={() => setAnalysisMode("full")}
                              className={`px-2 py-0.5 text-[9.5px] font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                                analysisMode === "full"
                                  ? "bg-[#0a152d] text-white shadow-xs"
                                  : "text-slate-500 hover:text-slate-700 bg-transparent disabled:opacity-50"
                              }`}
                              title="🔬 Comprehensive Mode: Est. 2 min run, 4-round deep reasoning, incorporates historical archives, SEC filings under macro vectors & social consensus tracking."
                            >
                              <Cpu className="w-2.5 h-2.5" />
                              Full
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Execution Action buttons at bottom of right container */}
                      <div className="pt-2 mt-1 border-t border-slate-200/40 shrink-0 flex gap-1.5 w-full text-left">
                        {isAnalyzing ? (
                          <>
                            <button
                              disabled
                              className="flex-1 bg-[#0a152d]/5 border border-indigo-100 text-[#0a152d]/60 rounded-xl py-2.5 text-[11px] font-semibold flex items-center justify-center gap-2"
                            >
                              Analyzing {selectedCoin}...
                            </button>
                            <button
                              onClick={cancelAnalysis}
                              className="px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all animate-pulse shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => executeAdvisoryAnalysis(selectedCoin, analysisMode, sidebarTab)}
                              className="flex-1 bg-[#0a152d] hover:bg-[#122345] text-white rounded-xl py-2.5 text-[11.5px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all duration-300"
                            >
                              {matchedDecision 
                                ? `Trigger New Analysis for ${selectedCoin.toUpperCase()}`
                                : `Trigger Analysis for ${selectedCoin.toUpperCase()}`
                              }
                            </button>
                            {(logs.length > 0 || matchedDecision) && (
                              <button
                                onClick={fetchDecisions}
                                className="px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-200/80 rounded-xl py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all shrink-0"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
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
                  <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3 text-left">
                    {/* Left Run List */}
                    <div className="w-full md:w-[35%] overflow-y-auto border-r border-slate-200/40 pr-2 space-y-1.5 max-h-[140px] md:max-h-full text-left">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono">
                          Select Run File
                        </span>
                        {ledgerData.length > 0 && (
                          <button
                            onClick={() => {
                              const activeItem = ledgerData[selectedLedgerIndex !== -1 ? selectedLedgerIndex : 0];
                              if (activeItem) {
                                setMemoDecision(activeItem);
                              }
                            }}
                            className="text-[9.5px] font-bold text-[#4f46e5] hover:text-[#3730a3] flex items-center gap-1 font-mono transition-colors cursor-pointer"
                            title="Export selected ledger item as a pristine PDF report document"
                          >
                            <FileText className="w-2.5 h-2.5" />
                            <span>Export Report</span>
                          </button>
                        )}
                      </div>
                      {ledgerData.length === 0 ? (
                        <div className="text-center p-4 text-slate-400 text-[11px]">
                          No records in file logs for this session.
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
                                item.action?.toUpperCase() === "BUY"
                                  ? "text-emerald-600 bg-emerald-50"
                                  : item.action?.toUpperCase() === "SELL"
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-amber-500 bg-amber-50"
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

                    {/* Right Run Details */}
                    <div className="flex-1 overflow-y-auto max-h-[220px] md:max-h-full bg-slate-50/50 rounded-2xl p-3 border border-slate-100 text-left">
                      {(() => {
                        const activeItem = ledgerData[selectedLedgerIndex !== -1 ? selectedLedgerIndex : 0];
                        if (!activeItem) return <div className="text-slate-400 text-center py-10 text-[11px]">No run payload selected.</div>;
                        
                        return (
                          <div className="space-y-3 text-left">
                            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 flex-wrap gap-2">
                              <h5 className="text-[12px] font-bold text-[#0a1b33] text-left">Swarm Payload: {activeItem.coin}</h5>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const fullText = `Swarm payload consensus for ${activeItem.coin} is ${activeItem.action} with ${activeItem.confidence} percent confidence. Rationale: ${activeItem.rationale}`;
                                    speakSpeech(fullText);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono transition-all cursor-pointer ${
                                    isSpeaking && speakingText?.includes(activeItem.rationale)
                                      ? "bg-rose-600 text-white shadow-xs animate-pulse"
                                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60"
                                  }`}
                                  title={isSpeaking && speakingText?.includes(activeItem.rationale) ? "Stop speaking" : "Listen to run summary"}
                                >
                                  {isSpeaking && speakingText?.includes(activeItem.rationale) ? (
                                    <>
                                      <VolumeX className="w-2.5 h-2.5 text-white" />
                                      <span>STOP</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-2.5 h-2.5 text-indigo-500" />
                                      <span>LISTEN</span>
                                    </>
                                  )}
                                </button>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {new Date(activeItem.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 italic text-left">
                              "{activeItem.rationale}"
                            </p>

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
                                        <div className="space-y-1">
                                          {rep.keyPoints.map((kp, ki) => (
                                            <div key={ki} className="flex items-start gap-1.5 text-[9.5px] text-slate-600 leading-relaxed font-sans text-left">
                                              <span className="text-indigo-500 font-bold select-none leading-none pt-[3px]">✦</span>
                                              <span className="flex-1">{kp}</span>
                                            </div>
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

                  <div className="pt-2 border-t border-slate-200/40 flex justify-between gap-2 shrink-0 w-full text-left">
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
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-left">
                    <div className="space-y-2 text-left">
                      <h4 className="text-[12px] font-bold text-[#0a1b33] text-left">System Config: Swarm Node Coordinates</h4>
                      
                      <div className="grid grid-cols-2 gap-2.5 text-left">
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col justify-between shadow-xs text-left">
                          <span className="text-[10px] text-slate-400 font-mono">Model Engine</span>
                          <span className="text-[11px] font-extrabold text-[#0a1b33] mt-1 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            <Cpu className="w-3.5 h-3.5 text-[#0a1b33] shrink-0" />
                            {systemStatus.model || "qwen3.6-plus"}
                          </span>
                        </div>
                        
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col justify-between shadow-xs text-left">
                          <span className="text-[10px] text-slate-400 font-mono">MCP Protocol Tunnel</span>
                          <span className="text-[11px] font-extrabold text-indigo-600 mt-1 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            <Workflow className="w-3.5 h-3.5 text-[#0a1b33] shrink-0" />
                            DataHub MCPS
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/60 p-3.5 rounded-2xl space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block text-left">Analyst Tools</span>
                          <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1 py-0.5 font-mono">
                            {registeredTools.length} Tools Active
                          </span>
                        </div>
                        <div className="space-y-1.5 text-left">
                          {registeredTools.map((t, idx) => (
                            <div key={idx} className="flex flex-col border-b border-slate-100 pb-1.5 last:border-0 text-left">
                              <span className="text-[10px] font-mono font-bold text-slate-800">✦ {t.name}</span>
                              <span className="text-[9px] text-slate-400">{t.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>


                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Column: Permanently Visible Swarm Log Console */}
        <div 
          id="right-workspace-column" 
          className="w-full"
        >
          <motion.div 
            id="right-console-terminal-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/50 rounded-[24px] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03),0_0_24px_rgba(99,102,241,0.01)] h-[510px] flex flex-col justify-between items-start text-left transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06),0_0_30px_rgba(99,102,241,0.02)]"
          >
            <div className="w-full flex-1 flex flex-col overflow-hidden text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4 font-mono w-full">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <button
                  onClick={handleCopyLogs}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold font-sans text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 rounded-lg transition-all cursor-pointer select-none active:scale-95"
                  title="Copy Swarm Logs to clipboard"
                >
                  {copiedLogs ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500 animate-pulse" />
                      <span className="text-emerald-600 font-medium">Logs Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Logs</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Log Output List */}
              <div 
                ref={terminalContainerRef}
                className="flex-1 overflow-y-auto space-y-2 pr-1 pb-2 w-full font-mono text-left scrollbar-thin"
              >
                {(logs.length > 0 ? logs : [
                  `[SYSTEM] Terminal ready. Awaiting live telemetry logs...`
                ]).map((log, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={index}
                    className="text-[10.5px] text-slate-600 leading-relaxed border-l-2 border-indigo-500/30 pl-2.5 py-0.5 text-left"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-200/40 flex items-center justify-end gap-4 font-mono">
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Tour Guide Step Card */}
      <AnimatePresence>
        {tourActive && tourStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="fixed bottom-6 right-6 max-w-sm w-[360px] bg-slate-950/90 backdrop-blur-xl text-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),_0_0_50px_rgba(99,102,241,0.15)] p-5 border border-white/10 z-50 overflow-hidden text-left flex flex-col gap-4"
          >
            {/* Ambient aesthetic glow behind content */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-[30px] pointer-events-none" />

            <div className="flex items-center justify-between pb-1 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  Walkthrough • Step {currentStep + 1} of 4
                </span>
              </div>
              <button
                onClick={() => {
                  setTourActive(false);
                  setTourStarted(false);
                  localStorage.setItem("omnisignal_tour_completed", "true");
                }}
                className="text-slate-400 hover:text-white transition-all cursor-pointer p-1 rounded-lg hover:bg-white/5 active:scale-90"
                title="Exit Walkthrough"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 relative z-10">
              <h4 className="text-[13.5px] font-bold tracking-tight font-sans text-white">
                {TOUR_STEPS[currentStep].title}
              </h4>
              <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                {TOUR_STEPS[currentStep].description}
              </p>
            </div>

            {/* Premium Visual Dynamic Step Progress Indicator */}
            <div className="flex items-center justify-between relative z-10 pt-1">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className="group flex items-center justify-center relative cursor-pointer"
                      title={`Go to Step ${idx + 1}`}
                    >
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive 
                          ? "w-6 bg-gradient-to-r from-indigo-500 to-violet-500" 
                          : isCompleted 
                            ? "w-2.5 bg-indigo-400" 
                            : "w-1.5 bg-slate-800 hover:bg-slate-700"
                      }`} />
                    </button>
                  );
                })}
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                {Math.round(((currentStep + 1) / 4) * 100)}% Complete
              </span>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 relative z-10">
              <button
                onClick={() => {
                  setTourActive(false);
                  setTourStarted(false);
                  localStorage.setItem("omnisignal_tour_completed", "true");
                }}
                className="text-[10.5px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Skip Guide
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl text-[10.5px] font-bold cursor-pointer transition-all"
                  >
                    Back
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-[10.5px] font-bold cursor-pointer transition-all shadow-md shadow-indigo-950/20 flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTourActive(false);
                      setTourStarted(false);
                      localStorage.setItem("omnisignal_tour_completed", "true");
                    }}
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[10.5px] font-bold cursor-pointer transition-all shadow-md shadow-emerald-950/20"
                  >
                    Complete 🎉
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {memoDecision && (
        <ExecutiveMemorandum 
          decision={memoDecision}
          onClose={() => setMemoDecision(null)}
        />
      )}
    </motion.div>
  );
}
