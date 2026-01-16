import express, { type Express } from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { env, validateEnv } from "./config/env";
import { createDatabase } from "@peronio/database";

// Validate environment
validateEnv();

// Create Express app
const app: Express = express();

// Middleware
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
  });
});

// API routes placeholder
app.get("/api/v1/status", (_req, res) => {
  res.json({
    server: "peronio-mmorpg",
    version: "0.1.0",
    environment: env.NODE_ENV,
  });
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: "/ws" });

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[WS] New connection from ${clientIp}`);

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("[WS] Received:", message.type);

      // Echo back for now
      ws.send(
        JSON.stringify({
          type: "system:pong",
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("[WS] Invalid message:", error);
    }
  });

  ws.on("close", () => {
    console.log(`[WS] Connection closed from ${clientIp}`);
  });

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "system:message",
      timestamp: Date.now(),
      content: "Welcome to Peronio MMORPG!",
      level: "info",
    })
  );
});

// Initialize database
const db = createDatabase(env.DATABASE_URL);
console.log("[DB] Database connection initialized");

// Start server
server.listen(env.PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                  PERONIO MMORPG SERVER                    ║
╠═══════════════════════════════════════════════════════════╣
║  HTTP:  http://localhost:${env.PORT}                           ║
║  WS:    ws://localhost:${env.PORT}/ws                          ║
║  Env:   ${env.NODE_ENV.padEnd(47)}║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n[Server] Shutting down gracefully...");
  wss.close(() => {
    server.close(() => {
      console.log("[Server] Goodbye!");
      process.exit(0);
    });
  });
});

export { app, server, wss, db };
