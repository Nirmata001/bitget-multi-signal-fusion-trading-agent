import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { spawn } from "child_process";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Spawn secondary Python FastAPI server on port 3001
  console.log("Spawning Python FastAPI server on port 3001...");
  const pythonServer = spawn("python3", ["api/server.py"], {
    env: { ...process.env },
  });

  pythonServer.stdout.on("data", (data) => {
    console.log(`[Python API] ${data.toString().trim()}`);
  });

  pythonServer.stderr.on("data", (data) => {
    console.error(`[Python API Error] ${data.toString().trim()}`);
  });

  pythonServer.on("error", (err) => {
    console.error("Failed to start Python server process:", err);
  });

  pythonServer.on("exit", (code) => {
    console.log(`Python API process exited with code ${code}`);
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

      const fetchOptions: RequestInit = {
        method: req.method,
        headers: headers,
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
