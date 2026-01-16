import { useEffect, useRef, useState } from "react";
import { Application, Graphics, Text, TextStyle } from "pixi.js";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [serverMessage, setServerMessage] = useState<string>("");

  // Initialize PixiJS
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const initPixi = async () => {
      const app = new Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1a1a2e,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      canvasRef.current?.appendChild(app.canvas);
      appRef.current = app;

      // Draw a test sprite (placeholder player)
      const player = new Graphics();
      player.fill(0xe94560);
      player.rect(-16, -16, 32, 32);
      player.fill();
      player.x = app.screen.width / 2;
      player.y = app.screen.height / 2;
      app.stage.addChild(player);

      // Add title text
      const style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 48,
        fontWeight: "bold",
        fill: "#ffffff",
        dropShadow: {
          color: "#000000",
          blur: 4,
          distance: 2,
        },
      });
      const title = new Text({ text: "PERONIO MMORPG", style });
      title.anchor.set(0.5);
      title.x = app.screen.width / 2;
      title.y = 100;
      app.stage.addChild(title);

      // Add subtitle
      const subtitleStyle = new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fill: "#a0a0a0",
      });
      const subtitle = new Text({ text: "Press WASD to move (coming soon)", style: subtitleStyle });
      subtitle.anchor.set(0.5);
      subtitle.x = app.screen.width / 2;
      subtitle.y = 150;
      app.stage.addChild(subtitle);

      // Simple keyboard controls for the placeholder
      const keys = new Set<string>();
      const speed = 5;

      window.addEventListener("keydown", (e) => keys.add(e.key.toLowerCase()));
      window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

      app.ticker.add(() => {
        if (keys.has("w") || keys.has("arrowup")) player.y -= speed;
        if (keys.has("s") || keys.has("arrowdown")) player.y += speed;
        if (keys.has("a") || keys.has("arrowleft")) player.x -= speed;
        if (keys.has("d") || keys.has("arrowright")) player.x += speed;

        // Keep player in bounds
        player.x = Math.max(16, Math.min(app.screen.width - 16, player.x));
        player.y = Math.max(16, Math.min(app.screen.height - 16, player.y));
      });

      // Handle resize
      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        title.x = app.screen.width / 2;
        subtitle.x = app.screen.width / 2;
      };
      window.addEventListener("resize", handleResize);
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      setConnectionStatus("connecting");

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] Connected");
        setConnectionStatus("connected");
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("[WS] Message:", message);

          if (message.type === "system:message") {
            setServerMessage(message.content);
          }
        } catch (error) {
          console.error("[WS] Parse error:", error);
        }
      };

      ws.onclose = () => {
        console.log("[WS] Disconnected");
        setConnectionStatus("disconnected");

        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("[WS] Error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

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
              color: "#4ade80",
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
