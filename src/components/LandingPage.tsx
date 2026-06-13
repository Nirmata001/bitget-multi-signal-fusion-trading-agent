import React from "react";
import { Clock, Cpu, Workflow, Sparkles, Database, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Decision, SystemStatus } from "../types";

interface LandingPageProps {
  currentTime: string;
  selectedCoin: string;
  latestDecision: Decision | null;
  ledgerData: Decision[];
  systemStatus: SystemStatus;
  onInitialize: () => void;
}

export default function LandingPage({
  currentTime,
  selectedCoin,
  latestDecision,
  ledgerData,
  systemStatus,
  onInitialize
}: LandingPageProps) {
  return (
    <motion.div
      key="landing-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full flex flex-col justify-between flex-1"
    >
      {/* Platform Header Metadata Panel */}
      <header className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0a152d] flex items-center justify-center text-white font-bold select-none text-sm animate-pulse">
            ✦
          </div>
          <div className="text-left">
            <h2 className="text-[13px] font-bold text-[#0a1b33] tracking-tight uppercase">
              Fusion Autonomous Advisory Platform
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="font-mono text-[11px] text-slate-500 bg-white border border-slate-200/60 px-3 py-1 rounded-full shadow-xs flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {currentTime || "Connecting to atomic clock..."}
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
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

        {/* Hero Text Content Wrapper (Left 65%) */}
        <div className="relative z-20 w-full md:w-[65%] px-8 md:px-14 pt-10 md:pt-12 pb-10 flex flex-col justify-between items-start bg-gradient-to-r from-white via-white/95 md:via-white/80 to-transparent h-full">
          <div className="flex-1 flex flex-col justify-center text-left">
            {/* Headline */}
            <h1 
              id="hero-headline"
              className="font-display text-[42px] md:text-[52px] font-medium leading-[1.05] tracking-tight text-[#0a1b33] mb-4 text-left"
              dangerouslySetInnerHTML={{ __html: "Autonomous crypto intelligence<br />driven by AI swarm consensus" }}
            />

            {/* Subheadline & Active Metrics */}
            <p 
              id="hero-subheadline"
              className="font-sans text-[13px] md:text-[14px] text-[#64748b] max-w-md mb-6 leading-relaxed text-left"
            >
              Deploy a synchronized council of four specialized analysts monitoring global liquidity, on-chain whale activity, social sentiments, and regulatory feeds to synthesize secure advisory verdicts.
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
                className="bg-[#0a152d] text-white rounded-full px-7 py-3 text-[13px] font-semibold tracking-wide hover:shadow-lg hover:shadow-[#0a152d]/15 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
                Initialize Advisory Run
              </motion.button>
              

            </div>
          </div>


        </div>
      </div>
    </motion.div>
  );
}
