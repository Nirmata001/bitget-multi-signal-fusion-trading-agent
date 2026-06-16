import React, { useState, useRef, useEffect } from "react";
import { 
  Clock, Cpu, Workflow, Sparkles, Database, TrendingUp, Activity, 
  Globe, Newspaper, ChevronRight, Terminal, ArrowRight, ShieldCheck, 
  Radio, Layers, Flame, FileText, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Decision, SystemStatus } from "../types";
import StockBackground from "./StockBackground";

interface LandingPageProps {
  currentTime: string;
  selectedCoin: string;
  latestDecision: Decision | null;
  ledgerData: Decision[];
  systemStatus: SystemStatus;
  onInitialize: () => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface AgentSpec {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgClass: string;
  borderClass: string;
  accentBg: string;
  indigoAccent: string;
  textColor: string;
  bulletColor: string;
  description: string;
  inputs: string[];
  tools: string[];
  promptExample: string;
}

const AGENT_SPECS: AgentSpec[] = [
  {
    id: "macro",
    name: "Macro Analyst",
    icon: Globe,
    color: "#f43f5e", // Rose
    bgClass: "bg-rose-50/40 hover:bg-rose-50/80 border-rose-100 hover:border-rose-200",
    borderClass: "border-rose-100",
    accentBg: "bg-rose-50/50 border-rose-100",
    indigoAccent: "text-rose-500",
    textColor: "text-rose-700",
    bulletColor: "bg-rose-500",
    description: "Evaluates global interest rates, yield curve behavior, central bank actions, inflation metrics, and cross-asset correlations.",
    inputs: [
      "Interest rates, yield curve, Fed policy",
      "Inflation indicators (CPI, PCE, NFP)",
      "Cross-asset correlations (Equities vs DXY, Gold, Bonds, VIX)",
      "Global market conditions",
      "Upcoming macro catalysts"
    ],
    tools: ["rates_yields", "macro_indicators", "global_assets", "cross_asset", "tradfi_news", "cn_market", "global_data"],
    promptExample: ""
  },
  {
    id: "market_intel",
    name: "Market Intel Analyst",
    icon: TrendingUp,
    color: "#6366f1", // Indigo
    bgClass: "bg-indigo-50/40 hover:bg-indigo-50/80 border-indigo-100 hover:border-indigo-200",
    borderClass: "border-indigo-100",
    accentBg: "bg-indigo-50/50 border-indigo-100",
    indigoAccent: "text-indigo-500",
    textColor: "text-indigo-700",
    bulletColor: "bg-indigo-500",
    description: "Evaluates tokenized equity price patterns, market capitalization, market weight, equity capital flows, equities orderbook depth & settlement fees, and corporate treasury indices.",
    inputs: [
      "Current price, market cap, market weight / equity share",
      "Equity Capital Flows & Earnings Valuation",
      "Growth Equities and liquidity",
      "Equities Orderbook Depth & Settlement Fees",
      "Corporate Treasury & Cash Reserves indicator"
    ],
    tools: ["crypto_market", "defi_analytics", "dex_market", "network_status", "crypto_price"],
    promptExample: ""
  },
  {
    id: "sentiment",
    name: "Sentiment Analyst",
    icon: Activity,
    color: "#06b6d4", // Cyan
    bgClass: "bg-cyan-50/40 hover:bg-cyan-50/80 border-cyan-100 hover:border-cyan-200",
    borderClass: "border-cyan-100",
    accentBg: "bg-cyan-50/50 border-cyan-100",
    indigoAccent: "text-cyan-500",
    textColor: "text-cyan-700",
    bulletColor: "bg-cyan-500",
    description: "Tracks social crowd perspectives, derivatives sentiment skews, funding rates, open interest trends, and retail-to-institutional positioning differentials.",
    inputs: [
      "Fear & Greed Index current value and recent trend",
      "Long/short ratios (retail vs top traders)",
      "Funding rates and open interest",
      "Taker buy/sell ratio",
      "Reddit and social sentiment"
    ],
    tools: ["sentiment_index", "derivatives_sentiment"],
    promptExample: ""
  },
  {
    id: "news",
    name: "News & Narrative Analyst",
    icon: Newspaper,
    color: "#f59e0b", // Amber
    bgClass: "bg-amber-50/40 hover:bg-amber-50/80 border-amber-100 hover:border-amber-200",
    borderClass: "border-amber-100",
    accentBg: "bg-amber-50/50 border-amber-100",
    indigoAccent: "text-amber-500",
    textColor: "text-amber-700",
    bulletColor: "bg-amber-500",
    description: "Monitors daily equity headliners, macroeconomic developments, trending social topics, analyst insights, and prominent narrative cycles.",
    inputs: [
      "Latest equity news from major financial outlets",
      "Macro and geopolitical news that could affect equities",
      "Social media trending topics",
      "KOL and analyst opinions",
      "Current market narrative and dominant theme"
    ],
    tools: ["news_feed", "social_trending", "tradfi_news"],
    promptExample: ""
  }
];

// Robust image component with secondary backup fallback resource
function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setCurrentSrc(src);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount === 0) {
      setRetryCount(1);
      // Fallback URLs that are ultra-stable and guaranteed to render
      if (src.includes("1507537") || src.includes("150767")) {
        setCurrentSrc("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop");
      } else if (src.includes("1542744") || src.includes("159028")) {
        setCurrentSrc("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop");
      } else if (src.includes("1573496")) {
        setCurrentSrc("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop");
      } else {
        setCurrentSrc("https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop");
      }
    } else if (retryCount === 1) {
      setRetryCount(2);
      // Deep fallback to generic solid background with symbol if all network requests fail
      setCurrentSrc("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='380' viewBox='0 0 500 380'><rect width='100%' height='100%' fill='%23f1f5f9'/><circle cx='250' cy='190' r='40' fill='%23cbd5e1'/></svg>");
    }
  };

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className} 
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

export default function LandingPage({
  currentTime,
  selectedCoin,
  latestDecision,
  ledgerData,
  systemStatus,
  onInitialize
}: LandingPageProps) {
  const [activeAgentId, setActiveAgentId] = useState<string>("macro");
  const selectedAgent = AGENT_SPECS.find(a => a.id === activeAgentId) || AGENT_SPECS[0];

  // Typewriter animation state for the main action button
  const targetText = "Initialize Advisory Run";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(targetText.slice(0, index + 1));
      index++;
      if (index >= targetText.length) {
        clearInterval(interval);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const specialistRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [connections, setConnections] = useState<{
    [key: string]: { x1: number; y1: number; x2: number; y2: number };
  }>({});

  const updateCoordinates = () => {
    if (!containerRef.current || !hubRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const hubRect = hubRef.current.getBoundingClientRect();

    const hubX = hubRect.left - containerRect.left;
    const hubY = (hubRect.top + hubRect.height / 2) - containerRect.top;

    const newConnections: typeof connections = {};

    AGENT_SPECS.forEach((agent) => {
      const el = specialistRefs.current[agent.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        newConnections[agent.id] = {
          x1: rect.right - containerRect.left,
          y1: (rect.top + rect.height / 2) - containerRect.top,
          x2: hubX,
          y2: hubY,
        };
      }
    });

    setConnections(newConnections);
  };

  useEffect(() => {
    updateCoordinates();
    
    window.addEventListener("resize", updateCoordinates);
    // Extra timeout for rendering stability
    const timer = setTimeout(updateCoordinates, 350);

    return () => {
      window.removeEventListener("resize", updateCoordinates);
      clearTimeout(timer);
    };
  }, [activeAgentId]);

  return (
    <motion.div
      key="landing-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full flex flex-col flex-1"
    >
      {/* Platform Header Metadata Panel */}
      <header className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-4 shrink-0 pt-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0a152d] to-[#1e293b] flex items-center justify-center text-white select-none shadow-md shadow-[#0a152d]/10 border border-slate-700/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/25 to-transparent opacity-30" />
            <Activity className="w-5.5 h-5.5 text-emerald-400 stroke-[2.5] relative z-10" />
          </div>
          <div className="text-left">
            <h2 className="text-[17px] font-display font-extrabold text-[#0a1b33] tracking-tight uppercase block leading-none">
              OMNISIGNAL
            </h2>
            <p className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-1.5">
              Autonomous Equity Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          {/* Clock is kept only in the homepage cockpit layout */}
        </div>
      </header>

      {/* Flex container wrapper to center the main hero region perfectly */}
      <div className="flex-grow flex items-center justify-center w-full py-4 md:py-8">
        {/* Main Hero Container */}
        <div 
          id="hero-container"
          className="relative w-full max-w-[1400px] mx-auto h-[600px] flex flex-col md:flex-row"
        >
          {/* Background Video Layer */}
          <div 
            id="bg-video-layer"
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
          >
            <StockBackground />
          </div>

          {/* Hero Text Content Wrapper (Left 65%) */}
          <div className="relative z-20 w-full md:w-[65%] px-8 md:px-14 pt-10 md:pt-12 pb-10 flex flex-col justify-between items-start bg-gradient-to-r from-[#f9fafb] via-[#f9fafb]/95 md:via-[#f9fafb]/80 to-transparent h-full">
            <div className="flex-1 flex flex-col justify-center text-left">
              {/* Headline */}
              <h1 
                id="hero-headline"
                className="font-display text-[42px] md:text-[52px] font-medium leading-[1.05] tracking-tight text-[#0a1b33] mb-4 text-left"
                dangerouslySetInnerHTML={{ __html: "AI Investment Committee<br />for Crypto & U.S. Stocks" }}
              />

              {/* Subheadline & Active Metrics */}
              <p 
                id="hero-subheadline"
                className="font-sans text-[13px] md:text-[14px] text-[#64748b] max-w-md mb-6 leading-relaxed text-left"
              >
                A synchronized council of specialized analysts evaluating macroeconomic conditions, earnings fundamentals, market sentiment, and technical structure to generate institutional-grade investment decisions
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

              {/* Transition Action Button */}
              <div className="flex items-center gap-3">
                <motion.button 
                  id="hero-contact-button"
                  whileHover={{ scale: 1.04 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={onInitialize}
                  className="bg-[#0a152d] text-white rounded-full px-7 py-3 text-[13px] font-semibold tracking-wide hover:shadow-lg hover:shadow-[#0a152d]/15 transition-all cursor-pointer flex items-center gap-0.5 justify-center min-h-[44px]"
                >
                  <span>{displayText}</span>
                  {displayText !== targetText && (
                    <span className="w-[1.5px] h-[13px] bg-white animate-pulse ml-0.5 opacity-80" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters Section */}
      <div className="max-w-[1100px] w-full mx-auto px-6 mb-24 mt-12">
        <div className="border-t border-slate-100 pt-16">
          <div className="flex items-center gap-2 mb-16">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            <h2 className="text-[12px] font-mono font-bold text-slate-500 tracking-widest uppercase">
              01 / WHY THIS MATTERS
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 items-start relative">
            {/* Elegant connection line for desktop with scroll entrance */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ originY: 0 }}
              className="hidden md:block absolute top-12 left-1/2 bottom-12 w-px bg-slate-200" 
            />

            {/* Problem Section - Left Column */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={containerVariants}
              className="text-left md:pr-8"
            >
              <motion.div variants={childVariants} className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-sm">01</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  The Problem
                </span>
              </motion.div>
              <motion.p variants={childVariants} className="font-sans text-[24px] md:text-[30px] font-light text-slate-400 leading-snug tracking-tight mb-8">
                Retail investors must interpret <span className="font-normal text-slate-900 duration-500 hover:text-indigo-600 transition-colors">earnings</span>, <span className="font-normal text-slate-900 duration-500 hover:text-indigo-600 transition-colors">Fed policy</span>, <span className="font-normal text-slate-900 duration-500 hover:text-indigo-600 transition-colors">news</span>, and <span className="font-normal text-slate-900 duration-500 hover:text-indigo-600 transition-colors">technical signals</span> separately.
              </motion.p>

              {/* Problem Real-World Context Photos */}
              <motion.div variants={childVariants} className="grid grid-cols-2 gap-4">
                <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-xs transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=500&h=380&auto=format&fit=crop" 
                    alt="Dense city crowd of people representing market noise and chaotic inputs" 
                    className="w-full h-[150px] object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
                <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-xs transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500&h=380&auto=format&fit=crop" 
                    alt="Investor overwhelmed by noise" 
                    className="w-full h-[150px] object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
              </motion.div>
            </motion.div>
            
            {/* Solution Section - Right Column & Offset Downwards */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={containerVariants}
              className="text-left md:mt-32 md:pl-8"
            >
              <motion.div variants={childVariants} className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">02</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  The Solution
                </span>
              </motion.div>
              <motion.p variants={childVariants} className="font-sans text-[26px] md:text-[32px] font-light text-slate-800 leading-snug tracking-tight mb-8">
                Our <span className="font-bold text-[#0a152d]">AI Investment Committee</span> synthesizes all market signals into a single, explainable investment thesis.
              </motion.p>

              {/* Solution Real-World Context Photos */}
              <motion.div variants={childVariants} className="grid grid-cols-2 gap-4">
                <div className="relative group overflow-hidden rounded-2xl border border-indigo-100 shadow-xs transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&h=380&auto=format&fit=crop" 
                    alt="Satisfied user reviewing insights" 
                    className="w-full h-[150px] object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
                <div className="relative group overflow-hidden rounded-2xl border border-indigo-100 shadow-xs transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=500&h=380&auto=format&fit=crop" 
                    alt="Collaborative investment decision clarity" 
                    className="w-full h-[150px] object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* System Architecture Section */}
      <div className="max-w-[1100px] w-full mx-auto px-6 mb-32">
        <div className="border-t border-slate-100 pt-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={containerVariants}
            className="flex items-center gap-2 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            <h2 className="text-[12px] font-mono font-bold text-slate-500 tracking-widest uppercase">
              02 / SYSTEM ARCHITECTURE
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={containerVariants}
            className="text-left max-w-3xl mb-14"
          >
            <motion.h3 variants={childVariants} className="font-sans text-[28px] md:text-[34px] font-light tracking-tight text-slate-900 leading-tight mb-4">
              The Omnisignal Consensus Network
            </motion.h3>
            <motion.p variants={childVariants} className="font-sans text-[14px] md:text-[15px] text-slate-500 leading-relaxed">
              A synchronized, multi-agent data-ingest and synthesis pipeline. Each specialist works in parallel utilizing distinct Model Context Protocol (MCP) toolkits to extract live signals, which are then evaluated by our Consensus Coordinator.
            </motion.p>
          </motion.div>

          {/* Interactive Agent Diagram + Specification Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            
            {/* Left Diagram Column (7 Columns Span) */}
            <motion.div variants={childVariants} className="lg:col-span-7 bg-white border border-slate-200/60 rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden min-h-[460px] shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
              
              {/* Decorative subtle grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              {/* Status Header */}
              <div className="relative z-10 flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div id="consensus-map-header" className="flex items-center gap-2 font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Consensus Map
                </div>
                <div id="consensus-agents-count" className="text-[10px] font-mono text-slate-400">
                  Agents: <span className="font-bold text-slate-800">4 Specialists + 1 Lead</span>
                </div>
              </div>

              {/* Main SVG & HTML Flex Diagram Mapping */}
              <div ref={containerRef} className="relative z-10 grid grid-cols-12 gap-2 items-center flex-grow py-4 h-full">
                
                {/* SVG Connecting Flow Lines Layer (Rendered absolutely over the grid items) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 1, opacity: Object.keys(connections).length > 0 ? 1 : 0, transition: "opacity 0.5s ease" }}>
                  {AGENT_SPECS.map((agent) => {
                    const conn = connections[agent.id];
                    if (!conn) return null;
                    const isActive = agent.id === activeAgentId;
                    
                    const dx = Math.abs(conn.x2 - conn.x1);
                    const controlX1 = conn.x1 + dx * 0.45;
                    const controlX2 = conn.x2 - dx * 0.45;
                    const pathData = `M ${conn.x1} ${conn.y1} C ${controlX1} ${conn.y1}, ${controlX2} ${conn.y2}, ${conn.x2} ${conn.y2}`;

                    return (
                      <React.Fragment key={agent.id}>
                        {/* Underlay glow path */}
                        {isActive && (
                          <motion.path
                            d={pathData}
                            fill="none"
                            stroke={agent.color}
                            strokeWidth={4}
                            opacity={0.15}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        {/* Dynamic connecting path */}
                        <motion.path
                          d={pathData}
                          fill="none"
                          stroke={isActive ? agent.color : "rgba(226, 232, 240, 0.65)"}
                          strokeWidth={isActive ? 2.5 : 1.5}
                          strokeDasharray={isActive ? "6 4" : "none"}
                          animate={isActive ? { strokeDashoffset: [0, -20] } : {}}
                          transition={isActive ? { repeat: Infinity, duration: 1.2, ease: "linear" } : {}}
                        />
                      </React.Fragment>
                    );
                  })}
                </svg>

                {/* Sub-Specialist Column (Nodes Left - Span 7) */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-3 relative" style={{ zIndex: 10 }}>
                  <div className="mb-2 text-[9px] font-mono font-bold text-slate-400 tracking-wider">
                    PARALLEL SPECIALISTS [CLICK TO FOCUS]
                  </div>
                  {AGENT_SPECS.map((agent) => {
                    const AgentIcon = agent.icon;
                    const isActive = agent.id === activeAgentId;
                    return (
                      <button
                        key={agent.id}
                        ref={(el) => { specialistRefs.current[agent.id] = el; }}
                        onClick={() => setActiveAgentId(agent.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden cursor-pointer ${
                          isActive 
                            ? "bg-white border-slate-900 shadow-md translate-x-1" 
                            : `${agent.bgClass} ${agent.borderClass}`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                            style={{ 
                              backgroundColor: isActive ? agent.color : "transparent",
                              color: isActive ? "#ffffff" : agent.color,
                              boxShadow: isActive ? `0 4px 12px ${agent.color}40` : "none"
                            }}
                          >
                            <AgentIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[12px] font-semibold text-slate-900">
                              {agent.name}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono tracking-tight flex items-center gap-1 mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-ping' : ''}`} style={{ backgroundColor: agent.color }} />
                              MCP Query Pipeline Active
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-transform ${isActive ? 'translate-x-0.5 text-slate-900' : ''}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Integration Space / Divider (Column Span 1 on desk) */}
                <div className="hidden md:block md:col-span-1" />

                {/* Synthesis Hub Column (Nodes Right - Span 5) */}
                <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center pt-8 md:pt-0 relative" style={{ zIndex: 10 }}>
                  <div className="text-center w-full">
                    {/* Pulsating back glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
                    
                    <div ref={hubRef} className="relative border border-slate-800 rounded-3xl bg-[#0a152d] text-white p-6 shadow-xl w-full max-w-[210px] mx-auto overflow-hidden">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 animate-pulse">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold mb-1">
                          Consensus Engine
                        </div>
                        <h4 className="text-[12px] font-bold tracking-tight text-white mb-2">
                          Head of Advisory
                        </h4>
                        

                      </div>
                    </div>
                    <div className="mt-3 text-[9px] font-mono font-bold text-slate-400 tracking-wider">
                      CONCORD SYNTHESIS NODE
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Footer Metrics */}
              <div className="relative z-10 border-t border-slate-100 pt-3 mt-4 flex items-center text-[10px] font-mono text-slate-400">
                <div id="diagram-model-status" className="flex items-center gap-1.5">
                  Model: qwen3.6-plus
                </div>
              </div>

            </motion.div>

            {/* Right Specification Column (5 Columns Span) */}
            <motion.div variants={childVariants} className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Agent Technical Spec Sheet Card */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[28px] p-7 flex-grow flex flex-col justify-between relative overflow-hidden shadow-[0_12px_38px_-10px_rgba(15,23,42,0.04)] transition-all duration-300">
                {/* Dynamically matched subtle color radial background glow */}
                <div 
                  className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-500" 
                  style={{ backgroundColor: selectedAgent.color }}
                />
                <div 
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-2xl opacity-25 pointer-events-none transition-all duration-500" 
                  style={{ backgroundColor: selectedAgent.color }}
                />

                <div className="relative z-10 space-y-6">
                  {/* Top Header Card Info */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      Agent Configuration
                    </span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Specialist Node
                    </span>
                  </div>

                  {/* Active Agent Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-500 border" 
                      style={{ 
                        backgroundColor: `${selectedAgent.color}08`, 
                        borderColor: `${selectedAgent.color}25`,
                        color: selectedAgent.color,
                        boxShadow: `0 4px 20px ${selectedAgent.color}0a`
                      }}
                    >
                      {React.createElement(selectedAgent.icon, { className: "w-6 h-6 stroke-[2]" })}
                    </div>
                    <div className="text-left">
                      <h4 className="text-[17px] font-bold text-slate-900 tracking-tight leading-snug">
                        {selectedAgent.name}
                      </h4>
                      <p className="text-[9px] font-mono text-slate-400 tracking-wider uppercase mt-1">
                        Node ID: <span className="text-slate-600 font-bold">{selectedAgent.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Active Agent Description */}
                  <p className="text-[13px] text-slate-600 leading-relaxed text-left font-normal">
                    {selectedAgent.description}
                  </p>

                  {/* Telemetry Input Requirements */}
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold block mb-3">
                      Data Streams Analyzed
                    </span>
                    <ul className="space-y-2">
                      {selectedAgent.inputs.map((input, index) => (
                        <li key={index} className="text-[12px] text-slate-600 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 transition-all duration-500" style={{ backgroundColor: selectedAgent.color }} />
                          <span className="leading-normal font-medium">{input}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Available Toolkits */}
                  <div className="text-left pt-2">
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold block mb-2.5">
                      Protocol capabilities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAgent.tools.map((tool, index) => (
                        <span key={index} className="text-[10px] font-mono font-medium bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-0.75 rounded-lg shadow-2xs">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
