import { useEffect, useRef, useState, useCallback } from "react";
import { Application, Graphics, Text, TextStyle } from "pixi.js";
import {
  PLAYER_SPEED,
  PLAYER_SIZE,
  PLAYER_HALF_SIZE,
  WS_RECONNECT_DELAY_MS,
  COLORS,
  TITLE_FONT_SIZE,
  SUBTITLE_FONT_SIZE,
} from "./constants/game";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [serverMessage, setServerMessage] = useState<string>("");

  // Initialize PixiJS
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const keys = new Set<string>();
    let player: Graphics;

    const handleKeyDown = (e: KeyboardEvent) => keys.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    let handleResize: () => void;

    const initPixi = async () => {
      const app = new Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: COLORS.background,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      canvasRef.current?.appendChild(app.canvas);
      appRef.current = app;

      // Draw a test sprite (placeholder player)
      player = new Graphics();
      player.fill(COLORS.player);
      player.rect(-PLAYER_HALF_SIZE, -PLAYER_HALF_SIZE, PLAYER_SIZE, PLAYER_SIZE);
      player.fill();
      player.x = app.screen.width / 2;
      player.y = app.screen.height / 2;
      app.stage.addChild(player);

      // Add title text
      const titleStyle = new TextStyle({
        fontFamily: "Arial",
        fontSize: TITLE_FONT_SIZE,
        fontWeight: "bold",
        fill: COLORS.textPrimary,
        dropShadow: {
          color: "#000000",
          blur: 4,
          distance: 2,
        },
      });
      const title = new Text({ text: "PERONIO MMORPG", style: titleStyle });
      title.anchor.set(0.5);
      title.x = app.screen.width / 2;
      title.y = 100;
      app.stage.addChild(title);

      // Add subtitle
      const subtitleStyle = new TextStyle({
        fontFamily: "Arial",
        fontSize: SUBTITLE_FONT_SIZE,
        fill: COLORS.textSecondary,
      });
      const subtitle = new Text({
        text: "Press WASD to move (coming soon)",
        style: subtitleStyle,
      });
      subtitle.anchor.set(0.5);
      subtitle.x = app.screen.width / 2;
      subtitle.y = 150;
      app.stage.addChild(subtitle);

      // Keyboard controls
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      app.ticker.add(() => {
        if (keys.has("w") || keys.has("arrowup")) player.y -= PLAYER_SPEED;
        if (keys.has("s") || keys.has("arrowdown")) player.y += PLAYER_SPEED;
        if (keys.has("a") || keys.has("arrowleft")) player.x -= PLAYER_SPEED;
        if (keys.has("d") || keys.has("arrowright")) player.x += PLAYER_SPEED;

        // Keep player in bounds
        player.x = Math.max(
          PLAYER_HALF_SIZE,
          Math.min(app.screen.width - PLAYER_HALF_SIZE, player.x)
        );
        player.y = Math.max(
          PLAYER_HALF_SIZE,
          Math.min(app.screen.height - PLAYER_HALF_SIZE, player.y)
        );
      });

      // Handle resize
      handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        title.x = app.screen.width / 2;
        subtitle.x = app.screen.width / 2;
      };
      window.addEventListener("resize", handleResize);
    };

    initPixi();

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }

      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  // WebSocket connection with proper cleanup
  const connectWebSocket = useCallback(() => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnectionStatus("connecting");

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.info("[WS] Connected");
      setConnectionStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.info("[WS] Message:", message);

        if (message.type === "system:message") {
          setServerMessage(message.content);
        }
      } catch (error) {
        console.error("[WS] Parse error:", error);
      }
    };

    ws.onclose = () => {
      console.info("[WS] Disconnected");
      setConnectionStatus("disconnected");

      // Schedule reconnect
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, WS_RECONNECT_DELAY_MS);
    };

    ws.onerror = (error) => {
      console.error("[WS] Error:", error);
    };
  }, []);

  useEffect(() => {
    connectWebSocket();

    // Cleanup
    return () => {
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

  return (
    <div className="game-container">
      <div ref={canvasRef} className="game-canvas" />

      <div className="hud">
        <div className={`connection-status ${connectionStatus}`}>
          {connectionStatus === "connected" && "Connected"}
          {connectionStatus === "connecting" && "Connecting..."}
          {connectionStatus === "disconnected" && "Disconnected"}
        </div>

        {serverMessage && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0, 0, 0, 0.7)",
              padding: "10px 20px",
              borderRadius: 8,
              color: COLORS.success,
              fontSize: 14,
            }}
          >
            {serverMessage}
          </div>
        )}
      </div>
    </div>
  );
}
