import { useState, useEffect, useCallback, useRef } from "react";
import type { EventRow } from "../types";

const WS_URL = "ws://localhost:3457/events/stream";
const RECONNECT_BASE = 1000;
const RECONNECT_MAX = 10000;

export function useWebSocket(onEvent: (event: EventRow) => void) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    let active = true;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      if (!active) return;

      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!active) return;
          setConnected(true);
          retriesRef.current = 0;
        };

        ws.onclose = () => {
          if (!active) return;
          setConnected(false);
          wsRef.current = null;
          // Exponential backoff
          const delay = Math.min(
            RECONNECT_BASE * Math.pow(2, retriesRef.current),
            RECONNECT_MAX
          );
          retriesRef.current++;
          reconnectTimer = setTimeout(connect, delay);
        };

        ws.onerror = () => {
          // onclose will fire after this
        };

        ws.onmessage = (msg) => {
          try {
            const event: EventRow = JSON.parse(msg.data);
            onEventRef.current(event);
          } catch {}
        };
      } catch {
        const delay = Math.min(
          RECONNECT_BASE * Math.pow(2, retriesRef.current),
          RECONNECT_MAX
        );
        retriesRef.current++;
        reconnectTimer = setTimeout(connect, delay);
      }
    }

    connect();

    return () => {
      active = false;
      wsRef.current?.close();
      clearTimeout(reconnectTimer);
    };
  }, []);

  return { connected };
}
