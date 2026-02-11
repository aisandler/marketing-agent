import { insertEvent, getRecentEvents, type EventRow } from "./db";

const PORT = 3457;
const wsClients = new Set<any>();

function broadcast(event: EventRow) {
  const msg = JSON.stringify(event);
  for (const ws of wsClients) {
    try {
      ws.send(msg);
    } catch {
      wsClients.delete(ws);
    }
  }
}

const server = Bun.serve({
  port: PORT,

  fetch(req, server) {
    const url = new URL(req.url);

    // WebSocket upgrade
    if (url.pathname === "/events/stream") {
      if (server.upgrade(req)) return undefined;
      return new Response("WebSocket upgrade failed", { status: 500 });
    }

    // POST /events — receive hook event
    if (req.method === "POST" && url.pathname === "/events") {
      return (async () => {
        try {
          const body = await req.json();
          const row = insertEvent(body);
          broadcast(row);
          return Response.json({ ok: true, id: row.id });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 400 });
        }
      })();
    }

    // GET /events — recent events
    if (req.method === "GET" && url.pathname === "/events") {
      const limit = parseInt(url.searchParams.get("limit") ?? "200");
      const events = getRecentEvents(limit).reverse(); // chronological order
      return Response.json(events);
    }

    // GET /health
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        port: PORT,
        clients: wsClients.size,
        uptime: process.uptime(),
      });
    }

    return new Response("Not found", { status: 404 });
  },

  websocket: {
    open(ws) {
      wsClients.add(ws);
    },
    close(ws) {
      wsClients.delete(ws);
    },
    message() {
      // Clients don't send messages to server
    },
  },
});

console.log(`Event server running on http://localhost:${PORT}`);
console.log(`WebSocket: ws://localhost:${PORT}/events/stream`);

export { server };
