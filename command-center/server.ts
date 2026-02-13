import { join, resolve, relative } from "path";
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { loadAgents, groupAgentsIntoTeams } from "./agents.ts";
import { getIntelStatus, getContextFiles, isOnboarded } from "./intel.ts";
import { SessionManager } from "./sessions.ts";
import type { ClientMessage, ServerMessage, FileEntry } from "./protocol.ts";

// Prevent SDK "ProcessTransport not ready" from crashing the server
process.on("uncaughtException", (err) => {
  console.error("[uncaught]", err.message);
});
process.on("unhandledRejection", (err: any) => {
  console.error("[unhandled]", err?.message || err);
});

const PORT = 3457;
const PROJECT_DIR = join(import.meta.dir, "..");

// Load agent metadata at startup
const agents = loadAgents(PROJECT_DIR);
const agentMap = new Map(agents.map((a) => [a.name, a]));

// WebSocket clients
const wsClients = new Set<any>();

function broadcast(msg: ServerMessage) {
  const data = JSON.stringify(msg);
  for (const ws of wsClients) {
    try {
      ws.send(data);
    } catch {
      wsClients.delete(ws);
    }
  }
}

// Session manager
const sessionManager = new SessionManager(PROJECT_DIR, broadcast);

function handleClientMessage(ws: any, msg: ClientMessage) {
  switch (msg.type) {
    case "start_session": {
      const agent = agentMap.get(msg.agentName);
      if (!agent) {
        ws.send(JSON.stringify({ type: "error", message: `Unknown agent: ${msg.agentName}` }));
        return;
      }
      sessionManager.startSession(agent, msg.prompt).catch((err) => {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      });
      break;
    }

    case "user_message":
      sessionManager.sendMessage(msg.sessionId, msg.message);
      break;

    case "permission_response":
      sessionManager.resolvePermission(
        msg.sessionId,
        msg.requestId,
        msg.allow,
        msg.updatedInput,
      );
      break;

    case "interrupt_session":
      sessionManager.interruptSession(msg.sessionId);
      break;

    case "sync":
      ws.send(
        JSON.stringify({
          type: "sync_state",
          sessions: sessionManager.getSessions(),
          agents: agents.map((a) => ({
            name: a.name,
            displayName: a.displayName,
            shortTag: a.shortTag,
            color: a.color,
            description: a.description,
            hotkey: a.hotkey,
            isOrchestrator: a.isOrchestrator,
          })),
          teams: groupAgentsIntoTeams(agents),
          intel: {
            intel: getIntelStatus(PROJECT_DIR),
            contextFiles: getContextFiles(PROJECT_DIR),
            isOnboarded: isOnboarded(PROJECT_DIR),
          },
        }),
      );
      break;
  }
}

// --- File Browser ---

const ALLOWED_ROOTS = [
  "client-context",
  "content",
  "config",
  "docs/reference",
  "docs/intelligence",
  ".claude/agents",
];

const BLOCKED_PATTERNS = [".env", "node_modules", ".git", ".DS_Store", "credentials", "secret"];

function isPathAllowed(reqPath: string): boolean {
  const abs = resolve(PROJECT_DIR, reqPath);
  const rel = relative(PROJECT_DIR, abs);
  if (rel.startsWith("..") || rel.includes("..")) return false;
  if (BLOCKED_PATTERNS.some((p) => rel.includes(p))) return false;
  return ALLOWED_ROOTS.some((root) => rel.startsWith(root));
}

function listDir(dirPath: string): FileEntry[] {
  const abs = resolve(PROJECT_DIR, dirPath);
  try {
    const entries = readdirSync(abs, { withFileTypes: true });
    return entries
      .filter((e) => !BLOCKED_PATTERNS.some((p) => e.name.includes(p)))
      .map((e) => {
        const entryPath = join(dirPath, e.name);
        let size: number | undefined;
        let modified: number | undefined;
        try {
          const s = statSync(join(abs, e.name));
          size = s.size;
          modified = s.mtimeMs;
        } catch {}
        return {
          name: e.name,
          path: entryPath,
          type: e.isDirectory() ? "directory" as const : "file" as const,
          size,
          modified,
        };
      })
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  } catch {
    return [];
  }
}

function listTree(rootPath: string, maxDepth: number): FileEntry[] {
  const results: FileEntry[] = [];
  function walk(dir: string, depth: number) {
    if (depth > maxDepth) return;
    const entries = listDir(dir);
    for (const entry of entries) {
      results.push(entry);
      if (entry.type === "directory") walk(entry.path, depth + 1);
    }
  }
  walk(rootPath, 0);
  return results;
}

async function handleFileRequest(url: URL, req: Request): Promise<Response> {
  const action = url.pathname.replace("/api/files/", "");

  if (action === "list") {
    const p = url.searchParams.get("path") || "";
    if (!isPathAllowed(p) && p !== "") {
      return Response.json({ error: "Path not allowed" }, { status: 403 });
    }
    // If empty path, return allowed roots
    if (!p) {
      return Response.json(
        ALLOWED_ROOTS.map((r) => ({
          name: r,
          path: r,
          type: "directory" as const,
        })),
      );
    }
    return Response.json(listDir(p));
  }

  if (action === "tree") {
    const root = url.searchParams.get("root") || "";
    const depth = parseInt(url.searchParams.get("depth") || "3");
    if (!isPathAllowed(root) && root !== "") {
      return Response.json({ error: "Path not allowed" }, { status: 403 });
    }
    if (!root) {
      return Response.json(
        ALLOWED_ROOTS.map((r) => ({
          name: r,
          path: r,
          type: "directory" as const,
        })),
      );
    }
    return Response.json(listTree(root, Math.min(depth, 5)));
  }

  if (action === "read") {
    const p = url.searchParams.get("path") || "";
    if (!p || !isPathAllowed(p)) {
      return Response.json({ error: "Path not allowed" }, { status: 403 });
    }
    const abs = resolve(PROJECT_DIR, p);
    try {
      const s = statSync(abs);
      if (s.size > 500 * 1024) {
        return Response.json({ error: "File too large (max 500KB)" }, { status: 413 });
      }
      const content = readFileSync(abs, "utf-8");
      return Response.json({ path: p, content, size: s.size });
    } catch {
      return Response.json({ error: "File not found" }, { status: 404 });
    }
  }

  if (action === "write" && req.method === "PUT") {
    try {
      const body = await req.json() as { path: string; content: string };
      if (!body.path || !isPathAllowed(body.path)) {
        return Response.json({ error: "Path not allowed" }, { status: 403 });
      }
      const abs = resolve(PROJECT_DIR, body.path);

      // Create backup
      const backupDir = "/tmp/cc-backups";
      if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });
      try {
        const ts = Date.now().toString(36);
        const backupName = body.path.replace(/\//g, "__") + "." + ts + ".bak";
        copyFileSync(abs, join(backupDir, backupName));
      } catch {} // File might not exist yet

      // Write file
      const dir = abs.substring(0, abs.lastIndexOf("/"));
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(abs, body.content, "utf-8");
      return Response.json({ ok: true, path: body.path, size: body.content.length });
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }

  return Response.json({ error: "Unknown file action" }, { status: 404 });
}

// --- Server ---

const server = Bun.serve({
  port: PORT,

  fetch(req, server) {
    const url = new URL(req.url);

    // WebSocket upgrade
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) return undefined;
      return new Response("WebSocket upgrade failed", { status: 500 });
    }

    // API: agent roster
    if (url.pathname === "/api/agents") {
      return Response.json(agents);
    }

    // API: intel status
    if (url.pathname === "/api/intel") {
      return Response.json({
        intel: getIntelStatus(PROJECT_DIR),
        contextFiles: getContextFiles(PROJECT_DIR),
        isOnboarded: isOnboarded(PROJECT_DIR),
      });
    }

    // API: active sessions
    if (url.pathname === "/api/sessions") {
      return Response.json(sessionManager.getSessions());
    }

    // --- File Browser API ---
    if (url.pathname.startsWith("/api/files/")) {
      return handleFileRequest(url, req);
    }

    // Health check
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        port: PORT,
        clients: wsClients.size,
        sessions: sessionManager.getSessions().length,
        uptime: process.uptime(),
        agents: agents.length,
      });
    }

    // Static: serve UI
    if (url.pathname === "/" || url.pathname === "/index.html") {
      try {
        const html = readFileSync(join(import.meta.dir, "ui", "index.html"), "utf-8");
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      } catch {
        return new Response("UI not found. Ensure ui/index.html exists.", { status: 404 });
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
    message(ws, raw) {
      try {
        const msg: ClientMessage = JSON.parse(String(raw));
        handleClientMessage(ws, msg);
      } catch (err: any) {
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    },
  },
});

console.log(`\n  Command Center`);
console.log(`  ──────────────`);
console.log(`  Dashboard:  http://localhost:${PORT}`);
console.log(`  WebSocket:  ws://localhost:${PORT}/ws`);
console.log(`  Health:     http://localhost:${PORT}/health\n`);

export { server };
