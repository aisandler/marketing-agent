import { insertEvent, getRecentEvents, type EventRow } from "./db";
import { loadAgents } from "./agents";
import { getIntelStatus, getContextFiles, isOnboarded } from "./intel";
import { join } from "path";
import { readFileSync } from "fs";
import { spawn } from "child_process";

const PORT = 3457;
const PROJECT_DIR = join(import.meta.dir, "..");
const wsClients = new Set<any>();

// Load agent metadata once at startup
const agents = loadAgents(PROJECT_DIR);

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

// Track launched processes
const activeProcesses = new Map<number, { pid: number; agentType: string; task: string; startedAt: string }>();

const server = Bun.serve({
  port: PORT,

  fetch(req, server) {
    const url = new URL(req.url);

    // WebSocket upgrade
    if (url.pathname === "/events/stream") {
      if (server.upgrade(req)) return undefined;
      return new Response("WebSocket upgrade failed", { status: 500 });
    }

    // --- API Routes ---

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
      const events = getRecentEvents(limit).reverse();
      return Response.json(events);
    }

    // GET /api/agents — agent roster metadata
    if (url.pathname === "/api/agents") {
      return Response.json(agents);
    }

    // GET /api/intel — intelligence freshness + context files
    if (url.pathname === "/api/intel") {
      return Response.json({
        intel: getIntelStatus(PROJECT_DIR),
        contextFiles: getContextFiles(PROJECT_DIR),
        isOnboarded: isOnboarded(PROJECT_DIR),
      });
    }

    // POST /api/launch — launch an agent
    if (req.method === "POST" && url.pathname === "/api/launch") {
      return (async () => {
        try {
          const { agentFile, task } = await req.json() as { agentFile: string; task: string };
          const proc = spawn("claude", ["--agent", agentFile, "--prompt", task], {
            cwd: PROJECT_DIR,
            stdio: "ignore",
            detached: true,
          });
          proc.unref();

          const info = {
            pid: proc.pid!,
            agentType: agentFile.split("/").pop()?.replace(".md", "") || "unknown",
            task,
            startedAt: new Date().toISOString(),
          };
          activeProcesses.set(proc.pid!, info);

          proc.on("exit", () => {
            activeProcesses.delete(proc.pid!);
          });

          return Response.json({ ok: true, pid: proc.pid });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      })();
    }

    // GET /api/processes — active launched processes
    if (url.pathname === "/api/processes") {
      return Response.json([...activeProcesses.values()]);
    }

    // POST /api/kill — kill a process
    if (req.method === "POST" && url.pathname === "/api/kill") {
      return (async () => {
        try {
          const { pid } = await req.json() as { pid: number };
          process.kill(pid, "SIGTERM");
          activeProcesses.delete(pid);
          return Response.json({ ok: true });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      })();
    }

    // GET /health
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        port: PORT,
        clients: wsClients.size,
        uptime: process.uptime(),
        agents: agents.length,
        processes: activeProcesses.size,
      });
    }

    // --- Static Files ---

    // Serve index.html at root
    if (url.pathname === "/" || url.pathname === "/index.html") {
      try {
        const html = readFileSync(join(import.meta.dir, "ui", "index.html"), "utf-8");
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      } catch {
        return new Response("UI not found", { status: 404 });
      }
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
    message() {},
  },
});

console.log(`\n  Marketing Command Center`);
console.log(`  ────────────────────────`);
console.log(`  Dashboard:  http://localhost:${PORT}`);
console.log(`  WebSocket:  ws://localhost:${PORT}/events/stream`);
console.log(`  API:        http://localhost:${PORT}/api/agents`);
console.log(`  Health:     http://localhost:${PORT}/health\n`);

export { server };
