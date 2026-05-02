
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { exec } from "child_process";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "path";

// Imports (adjusted for server/ root)
// Note: We are now in server/entry.ts, so relative paths are simpler
import { registerOAuthRoutes } from "./_core/oauth";
import { appRouter } from "./routers";
import { uploadRouter } from "./upload";
import { createContext } from "./_core/context";
import { serveStatic, setupVite } from "./_core/vite";

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
    throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
    try {
        console.log("Starting server initialization (from server/entry.ts)...");
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
            console.log("Setting up Vite middleware...");
            await setupVite(app, server);
        } else {
            serveStatic(app);
        }

        const preferredPort = parseInt(process.env.PORT || "3000");
        console.log(`Attempting to find available port starting from ${preferredPort}...`);
        const port = await findAvailablePort(preferredPort);

        if (port !== preferredPort) {
            console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
        }

        server.listen(port, () => {
            const url = `http://localhost:${port}/`;
            console.log(`\n=== SERVER STARTED ===`);
            console.log(`Server running on ${url}`);

            if (process.env.NODE_ENV === "development") {
                console.log(`Attempting to open browser at ${url}`);
                exec(`start ${url}`, (error: any) => {
                    if (error) {
                        console.error("Failed to open browser:", error);
                    }
                });
            }
        });

    } catch (err) {
        console.error("FATAL ERROR during server startup:", err);
        process.exit(1);
    }
}

startServer().catch(console.error);
