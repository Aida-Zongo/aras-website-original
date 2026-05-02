import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { exec } from "child_process"; // standard
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "path";

// Local imports - fully resolving relative to root
import { registerOAuthRoutes } from "./server/_core/oauth";
import { appRouter } from "./server/routers";
import { uploadRouter } from "./server/upload";
import { createContext } from "./server/_core/context";
import { serveStatic, setupVite } from "./server/_core/vite";

console.log("All imports success");
