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
  History,
  Workflow,
  Sparkles,
  Globe,
  Users,
  Newspaper,
  Coins,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Decision, SystemStatus } from "../types";

const analystsList = [
  {
    id: "macro",
    name: "Macro Analyst",
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
    name: "Sentiment Analyst",
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
    name: "Market Intel Analyst",
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
  { name: "cross_asset", desc: "Calculates regressions and correlations of crypto assets against legacy assets and global liquidity index variations." },
  { name: "tradfi_news", desc: "Pulls institutional macro commentary, Wall Street market notes, and economic policy releases." },
  { name: "cn_market", desc: "Monitors Chinese macroeconomic vectors, equity indices, renminbi liquidity, and policy directives." },
  { name: "global_data", desc: "Broad macro database index query tool linking liquidity, commodities, and credit market conditions." },
  { name: "technical_analysis", desc: "Computes multi-timeband Simple/Exponential Moving Averages, RSI, MACD, and Bollinger Bands." },
  { name: "crypto_derivatives", desc: "Fetches futures trading volume, open interest changes, futures-to-spot ratio, and options distributions." },
  { name: "backtest", desc: "Synthesizes multi-period quantitative rule backtests based on customized trend-following parameters." },
  { name: "sentiment_index", desc: "Analyzes social sentiment intensity, active Reddit discussion volume, and keyword fear/greed velocity." },
  { name: "derivatives_sentiment", desc: "Monitors real-time contract funding rates, leverage ratios, and aggregate long/short account skews." },
  { name: "crypto_market", desc: "Checks global cryptocurrency market capitalization, dominance indexes, and daily transaction volume counts." },
  { name: "defi_analytics", desc: "Tracks aggregate Total Value Locked (TVL) metrics, gas fee levels, and protocol-specific pool variations." },
  { name: "dex_market", desc: "Audits decentralized exchange liquidity pools, slippage curves, arbitrage margins, and smart-contract volume." },
  { name: "network_status", desc: "Pulls blockchain network health status, average hash rates, active validators, and block propagation velocities." },
  { name: "crypto_price", desc: "Queries precise, sub-second spot exchange prices and cumulative historical candlestick datasets." },
  { name: "news_feed", desc: "Aggregates real-time crypto news publications, premium wire summaries, and ETF flow reports." },
  { name: "social_trending", desc: "Monitors viral social terms, ticker velocity on major platforms, and high-impact developer activity." }
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
  executeAdvisoryAnalysis: (coin: string, mode?: string) => void;
  cancelAnalysis: () => void;
  fetchDecisions: () => void;
  normalizeAnalystName: (name: string) => string;
  getActionTheme: (action: string) => { bg: string; dots: string };
  onBack: () => void;
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
      <header className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 px-4 text-left">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#0a152d]/5 hover:bg-[#0a152d]/10 border border-slate-200/60 flex items-center justify-center text-[#0a152d] font-bold select-none text-sm cursor-pointer transition-all shrink-0 shadow-2xs"
          >
            ←
          </button>
          <div className="text-left">
            <h2 className="text-[13px] font-bold text-[#0a1b33] tracking-tight uppercase flex items-center gap-2 flex-wrap">
              Omnisignal Equity Intelligence
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
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
            className="w-full bg-white border border-slate-200/60 rounded-[32px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] h-[510px] flex flex-col justify-between text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 mb-2 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                {activeTab === "console" && "Swarm Advisor Laboratory"}
                {activeTab === "ledger" && `Committee Historical Ledger (${ledgerData.length})`}
                {activeTab === "status" && "Workspace Engine Hub"}
              </span>
              
              <div className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400">127.0.0.1:3000</span>
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
                  className="flex-1 flex flex-col justify-between overflow-hidden text-left"
                >
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1 pb-1 text-left">
                    
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
                              customCoinInput ? "border-[#0a152d]" : "border-slate-200/70"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                     {/* Decision results */}
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
                            <span className="text-[10px] text-slate-400 font-mono">
                              {matchedDecision.timestamp ? new Date(matchedDecision.timestamp).toLocaleTimeString() : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={`px-4 py-2.5 rounded-2xl border text-center min-w-[100px] ${getActionTheme(matchedDecision.action).bg}`}>
                              <span className="text-[10px] font-extrabold font-mono uppercase text-slate-400 block tracking-wider leading-none">Recommendation</span>
                              <span className="text-xl font-bold tracking-tight">{matchedDecision.action}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-[11px] font-bold text-[#0a1b33] mb-1">
                                <span>Synthesis Confidence</span>
                                <span className="font-mono text-indigo-600">{matchedDecision.confidence}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full animate-pulse" 
                                  style={{ width: `${matchedDecision.confidence}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-3 mt-3 leading-relaxed border-l-2 border-indigo-200/60 pl-2 whitespace-pre-line text-left">
                            {matchedDecision.rationale}
                          </p>
                        </div>

                        {/* Split analyst votes and keys */}
                        <div className="grid grid-cols-2 gap-2 text-left">
                          <div className="bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block text-left">Council Votes</span>
                            <div className="flex items-center gap-3 mt-1.5 font-mono">
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">🟢 {matchedDecision.committeeVotes?.bullish || 0} Bull</span>
                              <span className="text-[10px] font-bold text-[#64748b] flex items-center gap-1">⚪ {matchedDecision.committeeVotes?.neutral || 0} Neu</span>
                              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">🔴 {matchedDecision.committeeVotes?.bearish || 0} Bear</span>
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
                        <Terminal className="w-8 h-8 text-indigo-400/80 mb-2" />
                        <h4 className="text-[12px] font-bold text-[#0a1b33]">Swarm Console Ready</h4>
                        <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                          Select an asset above and trigger the autonomous multi-agent advisory swarm below.
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {/* Dynamic Mode Switcher (Space-Saving Inline Refinement) */}
                  <div className="pt-2.5 border-t border-slate-200/40 mt-2 flex items-center justify-between gap-2 w-full text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-mono">
                        Mode:
                      </span>
                      <div className="flex gap-0.5 bg-slate-100/85 p-0.5 rounded-lg border border-slate-200/50">
                        <button
                          type="button"
                          disabled={isAnalyzing}
                          onClick={() => setAnalysisMode("fast")}
                          className={`px-2 py-1 text-[9.5px] font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${
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
                          className={`px-2 py-1 text-[9.5px] font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${
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

                    <div className="text-[10px] text-slate-400 font-medium italic select-none">
                      {analysisMode === "fast" ? "⚡ Core consensus (~30s)" : "🔬 Deep analysis (~2m)"}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/40 shrink-0 flex gap-2 w-full text-left">
                    {isAnalyzing ? (
                      <>
                        <button
                          disabled
                          className="flex-1 bg-[#0a152d]/5 border border-indigo-100 text-[#0a152d]/60 rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2"
                        >
                          Analyzing {selectedCoin} ({analysisMode === "fast" ? "⚡ Fast" : "🔬 Comprehensive"})...
                        </button>
                        <button
                          onClick={cancelAnalysis}
                          className="px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all animate-pulse"
                        >
                          <X className="w-4 h-4" />
                          Stop
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => executeAdvisoryAnalysis(selectedCoin, analysisMode)}
                          className="flex-1 bg-[#0a152d] hover:bg-[#122345] text-white rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                        >
                          Activate New Swarm Advisory for {selectedCoin.toUpperCase()}
                        </button>
                        {(logs.length > 0 || matchedDecision) && (
                          <button
                            onClick={fetchDecisions}
                            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-2xl py-3 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
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
                  <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3 text-left">
                    {/* Left Run List */}
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

                    {/* Right Run Details */}
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
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase font-mono block text-left">Registered Tools Inventory</span>
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

                  <div className="pt-2 border-t border-slate-200/40 shrink-0 w-full flex justify-between gap-2 text-left">
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

        {/* Right Column: Permanently Visible Swarm Log Console */}
        <div id="right-workspace-column" className="w-full">
          <motion.div 
            id="right-console-terminal-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] h-[510px] flex flex-col justify-between items-start text-left"
          >
            <div className="w-full flex-1 flex flex-col overflow-hidden text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4 font-mono w-full">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
              </div>

              {/* Terminal Log Output List */}
              <div 
                ref={terminalContainerRef}
                className="flex-1 overflow-y-auto space-y-2 pr-1 pb-2 w-full font-mono text-left scrollbar-thin"
              >
                {(logs.length > 0 ? logs : [
                  `[OMNISIGNAL-OS/BOOT] Gateway port 3000 online and fully responsive.`,
                  `[OMNISIGNAL-OS/DEVICES] Secondary Python container swarm linked via parallel IPC channels.`,
                  `[OMNISIGNAL-OS/STANDBY] Awaiting new consensus simulation for asset: ${selectedCoin.toUpperCase() || 'BTC'}...`,
                  `[OMNISIGNAL-OS/SYSTEM] Status: 100% operational | Core processing matrix: stable.`,
                  `[OMNISIGNAL-OS/TIPS] Click 'Synthesize Swarm Consensus' to activate parallel worker nodes.`
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

    </motion.div>
  );
}
