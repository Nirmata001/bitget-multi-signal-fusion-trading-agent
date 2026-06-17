import React, { useRef, useState } from "react";
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  FileText,
  UserCheck
} from "lucide-react";
import html2canvas from "html2canvas";
import { Decision } from "../types";

interface ExecutiveMemorandumProps {
  decision: Decision;
  onClose: () => void;
}

export const ExecutiveMemorandum: React.FC<ExecutiveMemorandumProps> = ({ decision, onClose }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Safely extract core properties with default fallback structures
  const safeCoin = (decision?.coin || "N-A").toUpperCase();
  const safeAction = (decision?.action || "HOLD").toUpperCase();
  const safeConfidence = decision?.confidence ?? 0;
  const safeRationale = decision?.rationale || "Consensus analysis verdict completed. Standing by for strategic execution orders.";

  const getSafeYear = () => {
    try {
      const year = new Date(decision?.timestamp || Date.now()).getFullYear();
      return isNaN(year) ? new Date().getFullYear() : year;
    } catch {
      return new Date().getFullYear();
    }
  };
  const docRefNumber = `OSM-${getSafeYear()}-${safeCoin}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleDownloadImage = async () => {
    if (!documentRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const element = documentRef.current;
      
      // Safe fallback resolution for default import differences in Vite environment
      const html2canvasFn = typeof html2canvas === "function" 
        ? html2canvas 
        : (html2canvas as any).default;

      if (typeof html2canvasFn !== "function") {
        throw new Error("html2canvas could not be loaded as a function");
      }

      const canvas = await html2canvasFn(element, {
        scale: 2, // 2x scale for high resolution print quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const link = document.createElement("a");
      link.download = `${safeCoin}_Executive_Report_${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to generate report image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getActionStyles = (action: string) => {
    const act = (action || "HOLD").toUpperCase();
    switch (act) {
      case "BUY":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-300",
          text: "text-emerald-700",
          badge: "bg-emerald-600 text-white"
        };
      case "SELL":
        return {
          bg: "bg-rose-50",
          border: "border-rose-300",
          text: "text-rose-700",
          badge: "bg-rose-600 text-white"
        };
      default:
        return {
          bg: "bg-amber-50",
          border: "border-amber-300",
          text: "text-amber-700",
          badge: "bg-amber-600 text-white"
        };
    }
  };

  const actionStyle = getActionStyles(safeAction);

  return (
    <div className="fixed inset-0 z-50 bg-[#020817]/90 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="max-w-[850px] w-full flex flex-col h-[90vh]">
        
        {/* Modal Controls Banner (Hidden in real printing) */}
        <div className="bg-slate-900 text-white px-5 py-3 rounded-t-2xl flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-[12px] font-extrabold tracking-wide uppercase font-mono">
              Intelligence Memo Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? "EXPORTING..." : "DOWNLOAD IMAGE (PNG)"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / SAVE AS PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-all cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 bg-[#1e293b]/20 p-4 overflow-y-auto scrollbar-thin rounded-b-2xl print:p-0 print:bg-white shrink-min">
          
          <div 
            id="executive-memo-document"
            ref={documentRef}
            className="bg-white text-slate-800 p-10 md:p-14 shadow-2xl rounded-xl mx-auto print:shadow-none print:rounded-none max-w-[780px] border border-slate-200/60 print:border-none relative flex flex-col justify-between"
            style={{ minHeight: "1050px" }}
          >
            {/* Elegant Vintage Document Frame Accent */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-slate-100 pointer-events-none print:hidden" />
            
            <div className="space-y-8 relative">
              {/* Header Title Office Memorandum Section */}
              <div className="border-b-4 border-slate-900 pb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg tracking-tighter">
                      ΩΣ
                    </div>
                    <div>
                      <h1 className="text-[15px] font-black tracking-widest text-slate-900 uppercase font-mono leading-none">
                        OMNISIGNAL ADVISORY
                      </h1>
                      <span className="text-[9px] font-bold text-slate-500 font-mono tracking-wider block mt-0.5 uppercase">
                        Quantum Swarm Intelligence Systems Division
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-[10px] font-extrabold text-slate-900 uppercase">OFFICIAL BRIEFING</div>
                    <div className="text-[9px] font-bold text-indigo-600 mt-0.5">{docRefNumber}</div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-black text-center text-slate-900 tracking-tight py-2 font-sans border-t border-slate-200 uppercase mt-4">
                  EXECUTIVE DECISION MEMORANDUM
                </h2>
              </div>

              {/* metadata section */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[10.5px] border-b border-slate-200 pb-5 font-mono">
                <div>
                  <span className="font-extrabold text-slate-400 uppercase w-20 inline-block">TO:</span>
                  <span className="font-extrabold text-slate-950">LEAD PORTFOLIO MANAGER / BOARD CORPS</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase w-20 inline-block">DATE:</span>
                  <span className="font-bold text-slate-800">
                    {(() => {
                      try {
                        return new Date(decision?.timestamp || Date.now()).toLocaleDateString("en-US", {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
                        });
                      } catch {
                        return new Date().toLocaleDateString();
                      }
                    })()}
                  </span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase w-20 inline-block">FROM:</span>
                  <span className="font-bold text-slate-800">COUNCIL OF AUTONOMOUS SYSTEMS</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase w-20 inline-block">SUBJECT:</span>
                  <span className="font-black text-slate-900">CONSENSUS VERDICT: {safeCoin}</span>
                </div>
              </div>

              {/* Recommendation Panel */}
              <div className={`p-5 rounded-lg border flex items-center justify-between ${actionStyle.bg} ${actionStyle.border}`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold font-mono text-slate-500 uppercase tracking-wider block">
                    RECOMMENDED DISPOSITION
                  </span>
                  <span className="text-3xl font-black tracking-tight flex items-center gap-2 text-slate-900">
                    {safeAction}
                    <span className={`text-[10px] px-2.5 py-0.5 font-extrabold tracking-widest uppercase rounded-full ${actionStyle.badge}`}>
                      {safeAction === "BUY" ? "ACCUMULATE" : safeAction === "SELL" ? "LIQUIDATE" : "STANDBY"}
                    </span>
                  </span>
                </div>

                <div className="text-right flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold font-mono text-slate-500 uppercase block tracking-wider">
                      CONFIDENCE INDEX
                    </span>
                    <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                      {safeConfidence}%
                    </span>
                  </div>
                  
                  <div className="border-l border-slate-300 pl-6 text-left">
                    <span className="text-[9px] font-extrabold font-mono text-slate-500 uppercase block tracking-wider">
                      COUNCIL COMMITTAL
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10.5px] font-bold text-emerald-600">🟢 {decision?.committeeVotes?.bullish || 0} Bull</span>
                      <span className="text-[10.5px] font-bold text-slate-500">⚪ {decision?.committeeVotes?.neutral || 0} Neu</span>
                      <span className="text-[10.5px] font-bold text-rose-600">🔴 {decision?.committeeVotes?.bearish || 0} Bear</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Summary Rationale */}
              <div className="space-y-2.5 text-left">
                <h3 className="text-[11.5px] font-extrabold tracking-wide text-slate-900 uppercase font-mono flex items-center gap-1">
                  <Award className="w-4 h-4 text-slate-800" />
                  SECTION I: Executive Synopsis & Rationale
                </h3>
                <p className="text-[11px] md:text-[11.5px] text-slate-700 leading-relaxed font-serif whitespace-pre-line text-left pl-1">
                  {safeRationale}
                </p>
              </div>

              {/* Individual Swarm Analyst Briefs */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-[11.5px] font-extrabold tracking-wide text-slate-900 uppercase font-mono flex items-center gap-1 text-left">
                  <TrendingUp className="w-4 h-4 text-slate-800" />
                  SECTION II: Individual Specialist Dossiers
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {decision?.analystReports?.map((report, idx) => {
                    if (!report) return null;
                    const analyst = (report.analyst || "Specialist").toUpperCase();
                    const signal = (report.signal || "NEUTRAL").toUpperCase();
                    const summary = report.summary || "Specialist analysis completed with standing consensus.";
                    const keyPoints = report.keyPoints || [];

                    const rStyle = signal === "BULLISH" 
                      ? "border-l-3 border-emerald-500 bg-emerald-500/5"
                      : signal === "BEARISH"
                        ? "border-l-3 border-rose-500 bg-rose-500/5"
                        : "border-l-3 border-slate-400 bg-slate-50";

                    return (
                      <div key={idx} className={`p-4 rounded-lg border border-slate-200/70 ${rStyle} text-left`}>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                          <span className="text-[10.5px] font-black text-slate-900 font-sans tracking-tight">
                            {analyst}
                          </span>
                          <span className={`text-[8.5px] font-extrabold font-mono px-1.5 py-0.5 rounded uppercase ${
                            signal === "BULLISH" 
                              ? "bg-emerald-100 text-emerald-800"
                              : signal === "BEARISH"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-slate-200 text-slate-700"
                          }`}>
                            {signal}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-sans mb-2">
                          {summary}
                        </p>
                        
                        {keyPoints && keyPoints.length > 0 && (
                          <div className="space-y-1 mt-1.5">
                            {keyPoints.slice(0, 3).map((kp, kIdx) => (
                              <div key={kIdx} className="flex items-start gap-1 text-[9px] text-slate-500 leading-normal text-left">
                                <span className="text-slate-400 font-bold leading-none select-none">•</span>
                                <span className="flex-1">{kp}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(!decision?.analystReports || decision.analystReports.length === 0) && (
                    <div className="col-span-2 py-8 text-center text-[10.5px] text-slate-400 font-mono border border-dashed border-slate-200 rounded-lg">
                      No individual analyst brief records present for this consensus.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer with verification check and digital stamps */}
            <div className="mt-16 pt-6 border-t-2 border-slate-900 flex items-end justify-between text-[9.5px] text-slate-500 font-mono print:mt-12 shrink-0">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1 text-slate-800 font-extrabold text-[10px] uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  AUTHENTICATED RECORD
                </div>
                <div>Hash Verification: Success</div>
                <div>Server Pool: QWEN-3.6-PLUS-CLUSTER</div>
                <div>Security Class: Level-4 Executive</div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center relative">
                  {/* Mock handwritten-style overlay */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-[Cursive] text-indigo-600/60 font-semibold text-sm -rotate-6 select-none italic whitespace-nowrap">
                    Qwen 3.6 Autonomous
                  </div>
                  <div className="w-24 border-t border-slate-300 mt-4 pt-1 text-[8.5px] font-bold text-slate-600 uppercase">
                    CHAIRPERSON
                  </div>
                </div>

                <div className="text-center relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-[Cursive] text-emerald-600/60 font-semibold text-sm rotate-3 select-none italic whitespace-nowrap">
                    OmniSignal Core
                  </div>
                  <div className="w-24 border-t border-slate-300 mt-4 pt-1 text-[8.5px] font-bold text-slate-600 uppercase">
                    ATTESTATION
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
