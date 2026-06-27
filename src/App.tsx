import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Server, RefreshCw, X } from "lucide-react";
import { Decision, SystemStatus } from "./types";
import LandingPage from "./components/LandingPage";
import HomepageCockpit from "./components/HomepageCockpit";

export default function App() {
  const [activeTab, setActiveTab] = useState<"console" | "ledger" | "status">("console");
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  const [customCoinInput, setCustomCoinInput] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [latestDecision, setLatestDecision] = useState<Decision | null>(null);
  const [ledgerData, setLedgerData] = useState<Decision[]>([]);
  const [selectedLedgerIndex, setSelectedLedgerIndex] = useState<number>(-1);
  const [analyzedCoinsInSession, setAnalyzedCoinsInSession] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: "active",
    lastRun: null,
    lastDecision: null,
    lastConfidence: null,
    model: "qwen3.6-plus"
  });
  const [activeAnalystTab, setActiveAnalystTab] = useState<string>("macro");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [view, setView] = useState<"landing" | "homepage">("landing");
  const [serverOffline, setServerOffline] = useState<boolean>(false);
  const [showReloadPrompt, setShowReloadPrompt] = useState<boolean>(false);

  // Keep live UTC clock refreshed every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchDecisions();
    fetchStatus();
    fetchStartupLogs();

    // Trigger exactly two delayed syncs to handle any Render cold-start lag, without continuous polling
    const syncTimeout1 = setTimeout(() => {
      if (!isAnalyzing) {
        fetchDecisions();
        fetchStatus();
        fetchStartupLogs();
      }
    }, 3000);

    const syncTimeout2 = setTimeout(() => {
      if (!isAnalyzing) {
        fetchDecisions();
        fetchStatus();
        fetchStartupLogs();
      }
    }, 8000);

    return () => {
      clearTimeout(syncTimeout1);
      clearTimeout(syncTimeout2);
    };
  }, [isAnalyzing]);

  // Periodic background ping when server is sleeping/booting (cold-start recovery)
  useEffect(() => {
    if (!serverOffline || showReloadPrompt) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          setShowReloadPrompt(true);
          setServerOffline(false);
          fetchDecisions();
          fetchStatus();
          fetchStartupLogs();
          clearInterval(interval);
        }
      } catch (err) {
        // Still sleeping/offline
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [serverOffline, showReloadPrompt]);

  const fetchStartupLogs = async () => {
    try {
      const res = await fetch("/api/realtime-logs");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.logs) && data.logs.length > 0) {
          setLogs(data.logs);
        }
        if (serverOffline) {
          setShowReloadPrompt(true);
          setServerOffline(false);
        }
      } else {
        setServerOffline(true);
      }
    } catch (err) {
      console.error("Failed to fetch startup logs from server:", err);
      setServerOffline(true);
    }
  };

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
          if (serverOffline) {
            setShowReloadPrompt(true);
            setServerOffline(false);
          }
        }
      } else {
        setServerOffline(true);
      }
    } catch (err) {
      console.error("Failed to fetch system status from API:", err);
      setServerOffline(true);
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
        if (serverOffline) {
          setShowReloadPrompt(true);
          setServerOffline(false);
        }
      } else {
        setServerOffline(true);
      }
    } catch (err) {
      console.error("Failed to fetch historical decisions from API:", err);
      setServerOffline(true);
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

  const executeAdvisoryAnalysis = async (coinSymbol: string, mode: string = "fast", category?: string) => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setLogs([]);

    const targetSymbol = coinSymbol.toUpperCase().trim() || "BTC";

    // Clear server logs first to start fresh for this analysis run
    try {
      await fetch("/api/realtime-logs/clear", { method: "POST" });
    } catch (e) {
      console.error("Failed to clear server logs:", e);
    }

    const pollLogs = async () => {
      try {
        const res = await fetch("/api/realtime-logs");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.logs)) {
            setLogs(data.logs);
          }
        }
      } catch (err) {
        console.error("Error polling logs:", err);
      }
    };

    // Begin polling real-time logs every 1.5 seconds
    pollLogs();
    const logInterval = setInterval(pollLogs, 1500);

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
        body: JSON.stringify({ coin: targetSymbol, mode: mode, category: category }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || data.message || `Request failed (${res.status})`;
        setLogs(prev => [...prev, `❌ Analysis failed: ${errorMsg}`]);
        return;
      }

      const decision = await pollForResult();
      if (!decision) return;

      setLatestDecision(decision);
      setLedgerData((prev) => [decision, ...prev]);
      setAnalyzedCoinsInSession((prev) => [...prev, targetSymbol]);
      await fetchStatus();
      await fetchDecisions();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setLogs(prev => [...prev, `❌ Analysis failed: ${message}`]);
      await fetchDecisions();
      console.error("Advisory analysis failed:", err);
    } finally {
      clearInterval(logInterval);
      // Final poll to get absolute trailing output
      await pollLogs();
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
    <div className="min-h-screen bg-[#f9fafb] flex flex-col justify-between py-6 px-4 md:px-8 overflow-x-hidden font-sans select-none relative">
      <AnimatePresence>
        {showReloadPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-[#0c142c] border border-indigo-500/30 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 backdrop-blur-md bg-opacity-95">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Server className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <div className="text-left">
                  <h5 className="text-[12px] font-bold text-white tracking-tight flex items-center gap-1.5">
                    Back-end Online!
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h5>
                  <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                    Server finished booting. Reload to sync historical records.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-indigo-600/15"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reload</span>
                </button>
                <button
                  onClick={() => setShowReloadPrompt(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <LandingPage
            currentTime={currentTime}
            selectedCoin={selectedCoin}
            latestDecision={latestDecision}
            ledgerData={ledgerData}
            systemStatus={systemStatus}
            onInitialize={() => setView("homepage")}
          />
        ) : (
          <HomepageCockpit
            currentTime={currentTime}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            customCoinInput={customCoinInput}
            setCustomCoinInput={setCustomCoinInput}
            isAnalyzing={isAnalyzing}
            logs={logs}
            latestDecision={latestDecision}
            ledgerData={ledgerData}
            analyzedCoinsInSession={analyzedCoinsInSession}
            selectedLedgerIndex={selectedLedgerIndex}
            setSelectedLedgerIndex={setSelectedLedgerIndex}
            systemStatus={systemStatus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeAnalystTab={activeAnalystTab}
            setActiveAnalystTab={setActiveAnalystTab}
            executeAdvisoryAnalysis={executeAdvisoryAnalysis}
            cancelAnalysis={cancelAnalysis}
            fetchDecisions={fetchDecisions}
            normalizeAnalystName={normalizeAnalystName}
            getActionTheme={getActionTheme}
            onBack={() => setView("landing")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
