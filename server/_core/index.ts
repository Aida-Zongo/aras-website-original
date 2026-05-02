
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { exec } from "child_process";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "path";

import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { uploadRouter } from "../upload";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  return startPort; // Fallback or throw? Fallback to let system error out naturally if busy
}

async function startServer() {
  try {
    const app = express();
    const server = createServer(app);

    // Configure body parser with larger size limit for file uploads
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    // OAuth callback under /api/oauth/callback
    registerOAuthRoutes(app);

    // tRPC API
    app.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );

    // File Upload API
    app.use("/api/upload", uploadRouter);

    // Serve uploaded files
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

    // development mode uses Vite, production mode uses static files
    if (process.env.NODE_ENV === "development") {
      console.log("[Server] Starting in Development Mode (Vite)...");
      await setupVite(app, server);
    } else {
      console.log("[Server] Starting in Production Mode (Static)...");
      serveStatic(app);
    }

    const preferredPort = parseInt(process.env.PORT || "3000");
    const port = await findAvailablePort(preferredPort);

    if (port !== preferredPort) {
      console.log(`[Server] Port ${preferredPort} is busy, using port ${port} instead`);
    }

    server.listen(port, () => {
      const url = `http://localhost:${port}/`;
      console.log(`\n---------------------------------`);
      console.log(`   ARAS Website Running on: ${url}`);
      console.log(`---------------------------------\n`);

      if (process.env.NODE_ENV === "development") {
        console.log(`[Server] Opening browser...`);
        const startCmd = process.platform === 'win32' ? 'start' : 'open';
        exec(`${startCmd} ${url}`, (error: any) => {
          if (error) {
            // ignore error if browser fails to open, non-critical
          }
        });
      }
    });

  } catch (err) {
    console.error("[Server] FATAL STARTUP ERROR:", err);
    process.exit(1);
  }
}

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
});

startServer().catch(console.error);
