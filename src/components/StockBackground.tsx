import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isUp: boolean;
}

export default function StockBackground() {
  const [tickerData, setTickerData] = useState<TickerItem[]>([
    { symbol: "AAPL", name: "Apple Inc.", price: 182.45, change: 1.24, isUp: true },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 124.80, change: 3.82, isUp: true },
    { symbol: "TSLA", name: "Tesla Inc.", price: 176.60, change: -0.74, isUp: false },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 421.90, change: 0.65, isUp: true },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 187.20, change: -1.12, isUp: false },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 178.35, change: 1.48, isUp: true },
    { symbol: "META", name: "Meta Platforms Inc.", price: 475.50, change: 2.15, isUp: true },
    { symbol: "AVGO", name: "Broadcom Inc.", price: 1395.00, change: -0.32, isUp: false },
    { symbol: "AMD", name: "Advanced Micro Devices", price: 160.20, change: 1.88, isUp: true },
    { symbol: "NFLX", name: "Netflix Inc.", price: 610.40, change: 0.95, isUp: true },
    { symbol: "COST", name: "Costco Wholesale", price: 725.10, change: -1.05, isUp: false },
    { symbol: "QCOM", name: "Qualcomm Inc.", price: 173.80, change: 2.45, isUp: true },
  ]);

  // Simulate sub-second real-time price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData((prev) =>
        prev.map((item) => {
          const changeDelta = (Math.random() - 0.49) * 0.4; // Slightly upward biased
          const nextPrice = Math.max(10, +(item.price + changeDelta).toFixed(2));
          const basePct = item.change;
          const nextPct = +(basePct + changeDelta * 0.15).toFixed(2);
          return {
            ...item,
            price: nextPrice,
            change: nextPct,
            isUp: nextPct >= 0,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="stock-visualizer-bg" className="absolute inset-0 w-full h-full bg-[#f8fafc]/40 overflow-hidden flex flex-col justify-between">
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_30px] opacity-[0.25] pointer-events-none" />

      {/* Radial Ambient Gradient */}
      <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_70%_30%,#e0e7ff_0%,transparent_60%)] opacity-35" />

      {/* Top Floating Order Tape */}
      <div className="w-full bg-white/70 backdrop-blur-xs border-b border-slate-100 py-2.5 overflow-hidden relative z-10 select-none">
        <div className="flex w-max shrink-0 items-center">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap pr-6">
            {tickerData.map((stock, idx) => (
              <div 
                key={`${stock.symbol}-first-${idx}`} 
                className="inline-flex items-center gap-2 text-xs font-mono font-bold"
              >
                <span className="text-slate-800">{stock.symbol}</span>
                <span className="text-slate-500">${stock.price.toFixed(2)}</span>
                <span className={`flex items-center gap-0.5 ${stock.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {stock.isUp ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
                  {stock.isUp ? "+" : ""}{stock.change.toFixed(2)}%
                </span>
                <span className="text-slate-200 mx-1">|</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap pr-6" aria-hidden="true">
            {tickerData.map((stock, idx) => (
              <div 
                key={`${stock.symbol}-second-${idx}`} 
                className="inline-flex items-center gap-2 text-xs font-mono font-bold"
              >
                <span className="text-slate-800">{stock.symbol}</span>
                <span className="text-slate-500">${stock.price.toFixed(2)}</span>
                <span className={`flex items-center gap-0.5 ${stock.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {stock.isUp ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
                  {stock.isUp ? "+" : ""}{stock.change.toFixed(2)}%
                </span>
                <span className="text-slate-200 mx-1">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Central Stock Candlestick Structure & Wave Chart Panel */}
      <div className="relative flex-1 w-full h-full flex flex-col justify-center items-end pr-8 pl-12 lg:pr-16 md:pl-0 select-none">
        <div className="w-full max-w-[500px] h-[340px] relative border-l border-b border-slate-200/50 pb-5 pl-5">
          {/* Y Axis Grid Labels */}
          <div className="absolute left-[-45px] inset-y-0 flex flex-col justify-between text-[9px] font-mono font-bold text-slate-400">
            <span>$435.00</span>
            <span>$350.00</span>
            <span>$265.00</span>
            <span>$180.00</span>
            <span>$95.00</span>
          </div>

          {/* Glowing Animated Bezier Quote Line */}
          <svg className="w-full h-full absolute inset-0 overflow-visible" style={{ zIndex: 2 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Simulated Stock price wave Area */}
            <motion.path
              d="M 0 240 C 60 210, 100 270, 160 220 C 220 170, 260 250, 320 160 C 380 70, 420 140, 500 80 L 500 320 L 0 320 Z"
              fill="url(#chartGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />

            {/* Glowing Stock Line */}
            <motion.path
              d="M 0 240 C 60 210, 100 270, 160 220 C 220 170, 260 250, 320 160 C 380 70, 420 140, 500 80"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />


          </svg>

          {/* Interactive Stock Candlesticks overlaying the visualizer area */}
          <div className="absolute inset-0 w-full h-full flex justify-around items-end pb-3 pointer-events-none z-10 px-6">
            {[
              { height: 110, wick: 140, isUp: true, delay: 0.3 },
              { height: 95, wick: 125, isUp: false, delay: 0.45 },
              { height: 130, wick: 170, isUp: true, delay: 0.6 },
              { height: 160, wick: 190, isUp: true, delay: 0.75 },
              { height: 120, wick: 155, isUp: false, delay: 0.9 },
              { height: 195, wick: 240, isUp: true, delay: 1.05 },
              { height: 170, wick: 215, isUp: false, delay: 1.2 },
              { height: 230, wick: 280, isUp: true, delay: 1.35 },
            ].map((candle, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-end relative"
                style={{ width: "16px" }}
              >
                {/* Wick */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: candle.delay, duration: 0.6 }}
                  className="w-[1.5px] bg-slate-400 absolute"
                  style={{ 
                    height: `${candle.wick}px`,
                    bottom: `${(candle.height / 2) - 15}px`
                  }}
                />

                {/* Candles Body */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: candle.delay + 0.15, duration: 0.5, type: "spring", stiffness: 70 }}
                  className={`w-3.5 rounded-xs relative z-10 shadow-xs border transition-all ${
                    candle.isUp 
                      ? "bg-emerald-500/80 border-emerald-500 shadow-emerald-500/10 hover:bg-emerald-500" 
                      : "bg-rose-500/80 border-rose-500 shadow-rose-500/10 hover:bg-rose-500"
                  }`}
                  style={{ 
                    height: `${candle.height}px`,
                    transformOrigin: "bottom"
                  }}
                />
              </div>
            ))}
          </div>

          {/* Time axis grid indicators */}
          <div className="absolute bottom-[-22px] inset-x-0 flex justify-between px-2 text-[9px] font-mono font-bold text-slate-400">
            <span>09:30 AM</span>
            <span>11:00 AM</span>
            <span>12:30 PM</span>
            <span>02:00 PM</span>
            <span>03:30 PM</span>
          </div>
        </div>

        {/* Ambient Market Indicators panel on bottom-right overlay */}
        <div className="mt-8 flex gap-4 select-none relative z-10 mr-12 lg:mr-2">
          <div className="bg-white/80 border border-slate-100 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] rounded-xl px-3 py-1.5 text-right font-mono">
            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wide block">US EQUITIES SPREAD</span>
            <span className="text-[12px] font-bold text-[#0a152d]">0.01 SEC BILLING</span>
          </div>
          <div className="bg-white/80 border border-slate-100 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] rounded-xl px-3 py-1.5 text-right font-mono">
            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wide block">SWARM CONFIDENCE</span>
            <span className="text-[12px] font-bold text-indigo-600 flex items-center justify-end gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 85.4%
            </span>
          </div>
        </div>
      </div>

      {/* Decorative CSS Animation style injecting */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
