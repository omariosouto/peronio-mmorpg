import express, { type Express } from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import { env, validateEnv } from "./config/env";
import { createDatabase } from "@peronio/database";
import { safeParseClientMessage } from "@peronio/shared";
import {
  ServerMessageType,
  type SystemMessageResponse,
  type PongMessage,
  type ErrorMessage,
} from "@peronio/shared/protocol";
import { sql } from "drizzle-orm";

// Validate environment
validateEnv();

// Initialize database
const db = createDatabase(env.DATABASE_URL);

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

// Health check with database verification
app.get("/health", async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      database: "disconnected",
    });
  }
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

// Helper to send typed messages
function sendMessage<T extends { type: ServerMessageType; timestamp: number }>(
  ws: WebSocket,
  message: T
): void {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.info(`[WS] New connection from ${clientIp}`);

  ws.on("message", (data) => {
    const result = safeParseClientMessage(JSON.parse(data.toString()));

    if (!result.success) {
      const errorMessage: ErrorMessage = {
        type: ServerMessageType.ERROR,
        timestamp: Date.now(),
        code: "INVALID_MESSAGE",
        message: result.error.issues[0]?.message || "Invalid message format",
      };
      sendMessage(ws, errorMessage);
      return;
    }

    const message = result.data;
    console.info(`[WS] Received: ${message.type}`);

    // Handle different message types
    switch (message.type) {
      case "system:ping": {
        const pongMessage: PongMessage = {
          type: ServerMessageType.PONG,
          timestamp: Date.now(),
        };
        sendMessage(ws, pongMessage);
        break;
      }

      // TODO: Add more message handlers as features are implemented
      default:
        console.info(`[WS] Unhandled message type: ${message.type}`);
    }
  });

  ws.on("close", () => {
    console.info(`[WS] Connection closed from ${clientIp}`);
  });

  ws.on("error", (error) => {
    console.error(`[WS] Error from ${clientIp}:`, error.message);
  });

  // Send welcome message
  const welcomeMessage: SystemMessageResponse = {
    type: ServerMessageType.SYSTEM_MESSAGE,
    timestamp: Date.now(),
    content: "Welcome to Peronio MMORPG!",
    level: "info",
  };
  sendMessage(ws, welcomeMessage);
});

// Start server
server.listen(env.PORT, () => {
  console.info(`
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
  console.info("\n[Server] Shutting down gracefully...");
  wss.close(() => {
    server.close(() => {
      console.info("[Server] Goodbye!");
      process.exit(0);
    });
  });
});

export { app, server, wss, db };
