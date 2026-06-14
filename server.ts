import express from "express";
import path from "path";
import os from "os";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { spawn } from "child_process";

function resolvePythonPath(): string {
  if (process.env.PYTHON_PATH) {
    try {
      if (fs.existsSync(process.env.PYTHON_PATH)) {
        const stat = fs.statSync(process.env.PYTHON_PATH);
        if (stat.isFile()) {
          return process.env.PYTHON_PATH;
        }
        if (stat.isDirectory()) {
          const binPath = path.join(process.env.PYTHON_PATH, "bin", "python3");
          if (fs.existsSync(binPath)) {
            const binStat = fs.statSync(binPath);
            if (binStat.isFile()) return binPath;
          }
          const binPath2 = path.join(process.env.PYTHON_PATH, "bin", "python");
          if (fs.existsSync(binPath2)) {
            const binStat2 = fs.statSync(binPath2);
            if (binStat2.isFile()) return binPath2;
          }
          const binPath3 = path.join(process.env.PYTHON_PATH, "python3");
          if (fs.existsSync(binPath3)) {
            const binStat3 = fs.statSync(binPath3);
            if (binStat3.isFile()) return binPath3;
          }
          const binPath4 = path.join(process.env.PYTHON_PATH, "python");
          if (fs.existsSync(binPath4)) {
            const binStat4 = fs.statSync(binPath4);
            if (binStat4.isFile()) return binPath4;
          }
        }
      }
    } catch (e) {
      console.error("[resolvePythonPath Warning]:", e);
    }
  }
  if (process.platform === "win32") {
    const userProfile = process.env.USERPROFILE || os.homedir();
    return path.join(
      userProfile,
      "AppData",
      "Local",
      "Programs",
      "Python",
      "Python312",
      "python.exe"
    );
  }
  return "python3";
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // 1. Spawn secondary Python FastAPI server on port 3001
  const pythonPath = resolvePythonPath();
  console.log(`Spawning Python FastAPI server on port 3001 (${pythonPath})...`);
  const projectRoot = process.cwd();
  
  // In-memory log buffer to hold capture of stdout and stderr
  const logBuffer: string[] = [];
  const MAX_LOGS = 1000;

  function addLogToBuffer(text: string) {
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned) {
        logBuffer.push(cleaned);
        if (logBuffer.length > MAX_LOGS) {
          logBuffer.shift();
        }
      }
    }
  }

  const pythonServer = spawn(pythonPath, ["api/server.py"], {
    env: {
      ...process.env,
      PYTHONPATH: projectRoot,
      PYTHONIOENCODING: "utf-8",
      PYTHONUTF8: "1",
      PYTHONUNBUFFERED: "1", // Force Python to flush stdout and stderr immediately
    },
    cwd: projectRoot,
  });

  pythonServer.stdout.on("data", (data) => {
    const str = data.toString();
    console.log(`[Python API] ${str.trim()}`);
    addLogToBuffer(str);
  });

  pythonServer.stderr.on("data", (data) => {
    const str = data.toString();
    console.error(`[Python API Error] ${str.trim()}`);
    addLogToBuffer(`[Python API Server] ${str}`);
  });

  pythonServer.on("error", (err) => {
    console.error("Failed to start Python server process:", err);
    addLogToBuffer(`[SYSTEM Error] Failed to start Python server process: ${err.message}`);
  });

  pythonServer.on("exit", (code) => {
    console.log(`Python API process exited with code ${code}`);
    addLogToBuffer(`[SYSTEM Log] Python API process exited with code ${code}`);
  });

  // Kill child process on exit
  const killPython = () => {
    try {
      pythonServer.kill();
    } catch (e) {}
  };
  process.on("exit", killPython);
  process.on("SIGINT", () => {
    killPython();
    process.exit();
  });
  process.on("SIGTERM", () => {
    killPython();
    process.exit();
  });

  // Enable JSON parsing middleware
  app.use(express.json());

  // Real-time server-side log routes (Intercepts before general proxy block)
  app.post("/api/realtime-logs/clear", (req, res) => {
    logBuffer.length = 0;
    res.json({ success: true });
  });

  app.get("/api/realtime-logs", (req, res) => {
    res.json({ logs: logBuffer });
  });

  // 2. Gateway Proxy for /api/* routed straight to the FastAPI server
  app.all("/api/*", async (req, res) => {
    const targetUrl = `http://127.0.0.1:3001${req.originalUrl}`;
    try {
      const headers: { [key: string]: string } = {};
      for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined) {
          headers[key] = Array.isArray(value) ? value.join(", ") : value;
        }
      }
      headers["host"] = "127.0.0.1:3001";

      const isAnalyzeRequest =
        req.method === "POST" && req.originalUrl.startsWith("/api/analyze");
      const timeoutMs = isAnalyzeRequest ? 20 * 60 * 1000 : 60_000;

      const fetchOptions: RequestInit = {
        method: req.method,
        headers: headers,
        signal: AbortSignal.timeout(timeoutMs),
      };

      if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
        fetchOptions.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      res.status(response.status);
      
      response.headers.forEach((v, k) => {
        res.setHeader(k, v);
      });

      const text = await response.text();
      res.send(text);
    } catch (error: any) {
      console.error(`[Proxy Error] Fail translating to 127.0.0.1:3001:`, error.message);
      res.status(502).json({
        error: "Bad Gateway",
        message: "The Swarm API server is still launching or unreachable.",
        details: error.message
      });
    }
  });

  // 3. Integrate UI Frontend (Vite middleware in dev, static server in prod)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const ANALYZE_TIMEOUT_MS = 20 * 60 * 1000;
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  // Agent analysis can run 10+ minutes; Node defaults to 5 min request timeout
  server.requestTimeout = ANALYZE_TIMEOUT_MS;
  server.headersTimeout = ANALYZE_TIMEOUT_MS + 60_000;
  server.keepAliveTimeout = ANALYZE_TIMEOUT_MS;
}

startServer();
