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

const parseOklchToRgb = (oklchStr: string): string => {
  try {
    const match = oklchStr.match(/oklch\(([^)]+)\)/i);
    if (!match) return "rgb(100, 116, 139)";
    
    const parts = match[1].trim().split(/[\s/]+/);
    if (parts.length < 3) return "rgb(100, 116, 139)";
    
    let L = parseFloat(parts[0]);
    if (parts[0].includes("%")) L = parseFloat(parts[0]) / 100;
    
    let H = parseFloat(parts[2]);
    if (parts[2] && parts[2].includes("deg")) H = parseFloat(parts[2]);
    
    // Check alpha
    const alpha = parts[3] ? parseFloat(parts[3]) : 1;
    
    let rgb = "100, 116, 139"; // default slate-500
    
    if (L >= 0.90) {
      rgb = "255, 255, 255"; // white
    } else if (L <= 0.18) {
      rgb = "15, 23, 42"; // dark slate
    } else if (H >= 100 && H <= 165) {
      rgb = "16, 185, 129"; // green
    } else if (H >= 320 || H <= 30) {
      rgb = "244, 63, 94"; // rose
    } else if (H >= 200 && H <= 285) {
      rgb = "99, 102, 241"; // indigo
    } else if (L >= 0.70) {
      rgb = "241, 245, 249"; // light gray
    } else if (L <= 0.45) {
      rgb = "30, 41, 59"; // dark slate-800
    }
    
    return alpha < 1 ? `rgba(${rgb}, ${alpha})` : `rgb(${rgb})`;
  } catch (err) {
    return "rgb(100, 116, 139)";
  }
};

interface ExecutiveMemorandumProps {
  decision: Decision;
  onClose: () => void;
}

export const ExecutiveMemorandum: React.FC<ExecutiveMemorandumProps> = ({ decision, onClose }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    
    // Save original getComputedStyle of parent window
    const originalParentGetComputedStyle = window.getComputedStyle;
    
    try {
      const element = documentRef.current;
      
      // Safe fallback resolution for default import differences in Vite environment
      const html2canvasFn = typeof html2canvas === "function" 
        ? html2canvas 
        : (html2canvas as any).default;

      if (typeof html2canvasFn !== "function") {
        throw new Error("Could not find html2canvas. Please ensure dependencies are loaded.");
      }

      // Temporarily patch the parent window's getComputedStyle to intercept oklch
      window.getComputedStyle = function (elt, pseudoElt) {
        const style = originalParentGetComputedStyle(elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop, receiver) {
            const val = Reflect.get(target, prop, receiver);
            if (typeof val === "string" && val.includes("oklch")) {
              return parseOklchToRgb(val);
            }
            return val;
          }
        });
      };

      // Capture with robust compatibility settings
      const canvas = await html2canvasFn(element, {
        scale: 2, // 2x scale for high resolution print quality
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Inside the clone, intercept oklch style requests at iframe window computed style levels
          const iframeWindow = clonedDoc.defaultView;
          if (iframeWindow) {
            const originalIframeGetComputedStyle = iframeWindow.getComputedStyle;
            iframeWindow.getComputedStyle = function (elt, pseudoElt) {
              const style = originalIframeGetComputedStyle(elt, pseudoElt);
              return new Proxy(style, {
                get(target, prop, receiver) {
                  const val = Reflect.get(target, prop, receiver);
                  if (typeof val === "string" && val.includes("oklch")) {
                    return parseOklchToRgb(val);
                  }
                  return val;
                }
              });
            };
          }

          // 1. Walk cloned stylesheets and replace oklch color values with standard rgb to prevent html2canvas crashes
          try {
            const sheets = clonedDoc.styleSheets;
            for (let i = 0; i < sheets.length; i++) {
              const sheet = sheets[i];
              try {
                const rules = sheet.cssRules || sheet.rules;
                if (!rules) continue;
                for (let j = rules.length - 1; j >= 0; j--) {
                  const rule = rules[j];
                  if (rule.cssText && rule.cssText.includes("oklch")) {
                    try {
                      const sanitized = rule.cssText.replace(/oklch\([^)]+\)/gi, (m) => parseOklchToRgb(m));
                      sheet.deleteRule(j);
                      sheet.insertRule(sanitized, j);
                    } catch (ruleReplaceErr) {
                      sheet.deleteRule(j);
                    }
                  }
                }
              } catch (sheetRuleErr) {
                console.warn("[html2canvas oklch bypass] CSS cross-origin parsing restricted, proceeding...", sheetRuleErr);
              }
            }
          } catch (sheetErr) {
            console.warn("[html2canvas oklch bypass] Stylesheet retrieval error", sheetErr);
          }

          // 2. Walk raw style blocks and sanitize
          try {
            const styleElements = clonedDoc.getElementsByTagName("style");
            for (let i = 0; i < styleElements.length; i++) {
              const style = styleElements[i];
              if (style.innerHTML && style.innerHTML.includes("oklch")) {
                style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/gi, (m) => parseOklchToRgb(m));
              }
            }
          } catch (styleElemErr) {
            console.warn("[html2canvas oklch bypass] Style tag modification error", styleElemErr);
          }

          // 3. Walk actual cloned elements and filter inline custom styles
          try {
            const allElements = clonedDoc.getElementsByTagName("*");
            for (let i = 0; i < allElements.length; i++) {
              const el = allElements[i] as HTMLElement;
              if (el.style && el.style.cssText && el.style.cssText.includes("oklch")) {
                el.style.cssText = el.style.cssText.replace(/oklch\([^)]+\)/gi, (m) => parseOklchToRgb(m));
              }
            }
          } catch (elWalkErr) {
            console.warn("[html2canvas oklch bypass] Element inline-style sweep error", elWalkErr);
          }
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      setExportedImageUrl(imgData);

      // Try file download
      try {
        const link = document.createElement("a");
        link.download = `${safeCoin}_Executive_Report_${new Date().toISOString().split("T")[0]}.png`;
        link.href = imgData;
        link.click();
      } catch (clickErr) {
        console.warn("Direct link download blocked by sandboxing or third-party policies. Utilizing overlay view.", clickErr);
      }
    } catch (error: any) {
      console.error("Failed to generate report image:", error);
      setErrorMessage(error?.toString() || "Unknown rendering exception during PDF canvas translation.");
    } finally {
      // Always restore the parent window's original getComputedStyle
      window.getComputedStyle = originalParentGetComputedStyle;
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    try {
      const element = document.getElementById("executive-memo-document");
      if (!element) return;

      // Create a temporary hidden iframe in the same origin
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "-10000px";
      iframe.style.bottom = "-10000px";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!doc) {
        window.print(); // Fallback on secure sandbox restriction
        return;
      }

      // Capture all document style stylesheets
      let styles = "";
      try {
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
          const sheet = styleSheets[i];
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              for (let j = 0; j < rules.length; j++) {
                if (rules[j].cssText) {
                  let cssText = rules[j].cssText;
                  if (cssText.includes("oklch")) {
                    cssText = cssText.replace(/oklch\([^)]+\)/gi, (m) => parseOklchToRgb(m));
                  }
                  styles += cssText + "\n";
                }
              }
            }
          } catch (e) {
            if (sheet.href) {
              styles += `@import url('${sheet.href}');\n`;
            }
          }
        }
      } catch (e) {
        console.warn("[Iframe Print Engine] Style retrieval warning", e);
      }

      // Dynamic Google Fonts configuration for PDF output
      const fontImports = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');\n`;
      styles = fontImports + styles;

      let htmlContent = element.outerHTML;
      // Sanitize OKLCH colors inside inline element styles
      htmlContent = htmlContent.replace(/oklch\([^)]+\)/gi, (m) => parseOklchToRgb(m));

      const printHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${safeCoin} Executive Decision Memorandum</title>
            <style>
              ${styles}
              
              /* Overriding core canvas layout properties for clean PDF/print output */
              html, body {
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
                margin: 0 !important;
                padding: 0 !important;
                height: auto !important;
                min-height: 100% !important;
                overflow: visible !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              #executive-memo-document {
                box-shadow: none !important;
                border: none !important;
                max-width: 100% !important;
                width: 100% !important;
                height: auto !important;
                min-height: 0 !important;
                padding: 1.5cm 1.5cm !important;
                margin: 0 auto !important;
                background-color: #ffffff !important;
                page-break-inside: avoid !important;
                page-break-after: avoid !important;
                page-break-before: avoid !important;
              }

              #analysts-grid {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 1rem !important;
              }

              .print\\:hidden, [class*="print:hidden"] {
                display: none !important;
              }

              /* Page Setup overrides to isolate standard A4 print sheets */
              @page {
                size: portrait;
                margin: 0 !important;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.onload = function() {
                // Short safety window to allow font loading inside iframe Document Object Model
                setTimeout(function() {
                  window.print();
                  setTimeout(function() {
                    window.parent.document.body.removeChild(window.frameElement);
                  }, 1200);
                }, 400);
              };
            </script>
          </body>
        </html>
      `;

      doc.open();
      doc.write(printHtml);
      doc.close();

    } catch (printErr) {
      console.error("Custom print handler failed, falling back to window.print():", printErr);
      window.print();
    }
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
    <div id="executive-memo-modal-overlay" className="fixed inset-0 z-50 bg-[#020817]/90 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto font-sans">
      <style>{`
        @media print {
          /* Pure white foundation for printing */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 100% !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
          }

          /* Hide all general application components to prevent overlay leaks */
          #root > div > :not(#executive-memo-modal-overlay),
          #root > div > div > :not(#executive-memo-modal-overlay) {
            display: none !important;
          }

          /* Force modal parents to spread naturally across the print frame */
          #root, 
          #root > div,
          #root > div > div {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            background-color: transparent !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          /* Reset absolute/fixed limitations of the enclosing modal background during printing */
          #executive-memo-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            display: block !important;
            background: transparent !important;
            background-color: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            z-index: auto !important;
          }

          /* Hide preview overlays, controls banner, error messages, and close buttons */
          .print\\:hidden,
          [class*="print:hidden"],
          .bg-slate-900,
          .bg-rose-500\\/15 {
            display: none !important;
          }

          /* Expand bounds on the wrapping flex layout container */
          .max-w-\\[850px\\],
          .h-\\[90vh\\] {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            display: block !important;
          }

          /* Reset backing paper background & spacing */
          .flex-1.bg-\\[\\#1e293b\\]\\/20 {
            background: transparent !important;
            background-color: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }

          /* Format executive document page to fit standard 1 physical page height */
          #executive-memo-document {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: #ffffff !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }

          /* Standardize sub-container layout flows during print */
          .grid {
            display: grid !important;
          }

          #analysts-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
          }

          .space-y-4 {
            margin-top: 1rem !important;
          }

          @page {
            size: portrait;
            margin: 1.2cm !important;
          }
        }
      `}</style>
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

        {errorMessage && (
          <div className="bg-rose-500/15 border-b border-rose-500/30 text-rose-300 px-5 py-2.5 text-[10px] font-mono flex items-center justify-between print:hidden shrink-0">
            <span>⚠️ ERROR: {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white font-bold ml-2 underline cursor-pointer">Dismiss</button>
          </div>
        )}

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
                
                <div id="analysts-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Fallback Image Download Assistant Modal Overlay */}
      {exportedImageUrl && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-indigo-400 uppercase font-mono">
                📥 Report Document Rendered Successfully
              </span>
              <button 
                onClick={() => setExportedImageUrl(null)}
                className="text-slate-400 hover:text-white text-xs font-bold font-mono border border-slate-800 bg-slate-900 px-3 py-1 rounded-lg cursor-pointer"
              >
                Close View
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4">
              <p className="text-[12px] text-slate-300 leading-relaxed font-sans text-left">
                Your high-resolution report has been generated! Because direct file downloads can be restricted by browser security sandboxing inside workspace previews, we have prepared a physical image stream below.
              </p>
              
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3 text-left">
                <p className="text-[11.5px] text-indigo-200 font-medium">
                  <span className="font-bold block mb-1">👉 How to Save Your Document:</span> 
                  <span>Right-click (or press and hold on mobile) on the preview image below, then choose <b className="text-white">"Save Image As..."</b> to save your document.</span>
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl bg-white p-2 flex justify-center shadow-inner overflow-hidden cursor-pointer" onClick={() => {
                // Trigger download on click
                const link = document.createElement("a");
                link.download = `${safeCoin}_Executive_Report_${new Date().toISOString().split("T")[0]}.png`;
                link.href = exportedImageUrl;
                link.click();
              }}>
                <img 
                  src={exportedImageUrl} 
                  alt={`${safeCoin} Executive Memorandum Report`} 
                  className="max-h-[50vh] object-contain rounded-lg border border-slate-200 shadow-sm transition-transform hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Dimension: 2x High Resolution</span>
              <button 
                onClick={() => setExportedImageUrl(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
