import { join, resolve, relative } from "path";
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync, copyFileSync, unlinkSync } from "fs";
import { loadAgents, groupAgentsIntoTeams } from "./agents.ts";
import { getIntelStatus, getContextFiles, isOnboarded, getContextHealth } from "./intel.ts";
import { getImageQueue, getImageCosts, generateImages } from "./images.ts";
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

    case "image_queue_sync": {
      getImageQueue(PROJECT_DIR).then((status) => {
        ws.send(
          JSON.stringify({
            type: "image_queue_status",
            pending: status.needsImage || 0,
            processing: 0,
            completed: status.withImage || 0,
            failed: 0,
            totalCost: 0,
            records: status.records || [],
          }),
        );
      }).catch((err) => {
        ws.send(JSON.stringify({ type: "error", message: `Image queue sync failed: ${err.message}` }));
      });
      break;
    }

    case "image_generate": {
      const genOptions = {
        limit: msg.limit,
        dryRun: msg.dryRun,
        recordId: msg.recordId,
      };

      // Broadcast that generation is starting
      broadcast({
        type: "image_generation_progress",
        recordId: msg.recordId || "batch",
        status: genOptions.dryRun ? "dry_run_started" : "generation_started",
      });

      generateImages(PROJECT_DIR, genOptions).then((result) => {
        // Broadcast individual record results
        for (const r of result.results) {
          broadcast({
            type: "image_generation_progress",
            recordId: r.recordId,
            status: r.success ? "completed" : "failed",
            postTopic: r.postTopic,
            error: r.error,
          });
        }

        // Send final summary as queue status update
        getImageQueue(PROJECT_DIR).then((status) => {
          broadcast({
            type: "image_queue_status",
            pending: status.needsImage || 0,
            processing: 0,
            completed: status.withImage || 0,
            failed: result.failed,
            totalCost: result.successful * 0.14,
            records: status.records || [],
          });
        }).catch(() => {
          // Still send what we have from the generation result
          broadcast({
            type: "image_queue_status",
            pending: 0,
            processing: 0,
            completed: result.successful,
            failed: result.failed,
            totalCost: result.successful * 0.14,
            records: [],
          });
        });
      }).catch((err) => {
        broadcast({
          type: "image_generation_progress",
          recordId: msg.recordId || "batch",
          status: "failed",
          error: err.message,
        });
      });
      break;
    }
  }
}

// --- File Browser ---

const ALLOWED_ROOTS = [
  "client-context",
  "content",
  "config",
  "docs/reference",
  "docs/intelligence",
  "docs/strategic-planning",
  ".claude/agents",
  ".claude/commands",
  ".claude/skills",
];

// MIME types for static file serving
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

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

  if (action === "search") {
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    if (!q || q.length < 2) {
      return Response.json({ error: "Query too short (min 2 chars)" }, { status: 400 });
    }
    const results: { name: string; path: string; type: string }[] = [];
    function searchDir(dir: string, relPath: string) {
      try {
        const entries = readdirSync(resolve(PROJECT_DIR, dir), { withFileTypes: true });
        for (const e of entries) {
          if (e.name.startsWith(".")) continue;
          if (e.name === "node_modules") continue;
          const rel = relPath ? relPath + "/" + e.name : dir + "/" + e.name;
          if (e.name.toLowerCase().includes(q)) {
            results.push({ name: e.name, path: rel, type: e.isDirectory() ? "directory" : "file" });
            if (results.length >= 50) return;
          }
          if (e.isDirectory() && results.length < 50) {
            searchDir(dir + "/" + e.name, rel);
          }
        }
      } catch {}
    }
    for (const root of ALLOWED_ROOTS) {
      if (results.length >= 50) break;
      searchDir(root, "");
    }
    return Response.json(results);
  }

  if (action === "delete" && req.method === "DELETE") {
    try {
      const body = await req.json() as { path: string };
      if (!body.path || !isPathAllowed(body.path)) {
        return Response.json({ error: "Path not allowed" }, { status: 403 });
      }
      const abs = resolve(PROJECT_DIR, body.path);
      if (!existsSync(abs)) {
        return Response.json({ error: "File not found" }, { status: 404 });
      }
      // Create backup before delete
      const backupDir = "/tmp/cc-backups";
      if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });
      const ts = Date.now().toString(36);
      const backupName = body.path.replace(/\//g, "__") + "." + ts + ".bak";
      copyFileSync(abs, join(backupDir, backupName));
      unlinkSync(abs);
      return Response.json({ ok: true, path: body.path });
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }

  return Response.json({ error: "Unknown file action" }, { status: 404 });
}

// --- Environment Variables ---

const ENV_WHITELIST = [
  "AIRTABLE_API_KEY",
  "AIRTABLE_BASE_ID",
  "AIRTABLE_CONTENT_CALENDAR_TABLE_ID",
  "AIRTABLE_TWITTER_FOLLOW_TABLE_ID",
  "OPENROUTER_API_KEY",
  "OPENROUTER_MODEL",
  "PARTNER_PORTAL_URL",
  "IMAGE_FEEDBACK_API_KEY",
  "CLOUDINARY_URL",
];

function maskValue(val: string): string {
  if (!val) return "";
  if (val.length <= 4) return "\u2022".repeat(val.length);
  return "\u2022".repeat(val.length - 4) + val.slice(-4);
}

interface EnvLine {
  raw: string;
  key?: string;
  value?: string;
}

function parseEnvFile(content: string): EnvLine[] {
  return content.split("\n").map((raw) => {
    const trimmed = raw.trim();
    // Skip comments and blank lines
    if (!trimmed || trimmed.startsWith("#")) return { raw };
    // Strip optional `export ` prefix
    const line = trimmed.startsWith("export ") ? trimmed.slice(7) : trimmed;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) return { raw };
    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Strip inline comment (only for unquoted values)
    const commentIdx = value.indexOf(" #");
    if (commentIdx !== -1) value = value.slice(0, commentIdx).trim();
    return { raw, key, value };
  });
}

function handleGetEnv(): Response {
  const envPath = join(PROJECT_DIR, ".env");
  const entries: Record<string, { masked: string; isSet: boolean }> = {};

  // Initialize all whitelisted keys as not set
  for (const k of ENV_WHITELIST) {
    entries[k] = { masked: "", isSet: false };
  }

  try {
    const content = readFileSync(envPath, "utf-8");
    const lines = parseEnvFile(content);
    for (const line of lines) {
      if (line.key && ENV_WHITELIST.includes(line.key) && line.value) {
        entries[line.key] = { masked: maskValue(line.value), isSet: true };
      }
    }
  } catch {
    // .env doesn't exist yet — all keys show as not set
  }

  return Response.json({ keys: entries });
}

async function handlePutEnv(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { key: string; value: string };
    if (!body.key || !ENV_WHITELIST.includes(body.key)) {
      return Response.json({ error: "Key not in whitelist" }, { status: 400 });
    }

    const envPath = join(PROJECT_DIR, ".env");
    let content = "";
    try {
      content = readFileSync(envPath, "utf-8");
    } catch {
      // File doesn't exist yet — start fresh
    }

    const lines = content.split("\n");
    let found = false;
    const newLines = lines.map((line) => {
      const trimmed = line.trim();
      const stripped = trimmed.startsWith("export ") ? trimmed.slice(7) : trimmed;
      const eqIdx = stripped.indexOf("=");
      if (eqIdx === -1) return line;
      const key = stripped.slice(0, eqIdx).trim();
      if (key === body.key) {
        found = true;
        // Remove the key if value is empty
        if (!body.value) return null;
        return `${body.key}=${body.value}`;
      }
      return line;
    }).filter((l): l is string => l !== null);

    // If key wasn't found and value is non-empty, append it
    if (!found && body.value) {
      newLines.push(`${body.key}=${body.value}`);
    }

    writeFileSync(envPath, newLines.join("\n"), "utf-8");
    return Response.json({ ok: true, key: body.key });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// --- Server ---

const server = Bun.serve({
  port: PORT,

  async fetch(req, server) {
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

    // API: context health
    if (url.pathname === "/api/context/health") {
      return Response.json(getContextHealth(PROJECT_DIR));
    }

    // --- Environment Variables API ---
    if (url.pathname === "/api/env" && req.method === "GET") {
      return handleGetEnv();
    }
    if (url.pathname === "/api/env" && req.method === "PUT") {
      return handlePutEnv(req);
    }
    if (url.pathname === "/api/auth/status") {
      return Response.json({
        method: "OAuth",
        description: "Command Center uses your existing Claude Code CLI authentication via OAuth.",
        hint: "Run `claude login` in your terminal if you need to re-authenticate.",
        authenticated: true,
      });
    }

    // --- Image Studio API ---

    if (url.pathname === "/api/images/status") {
      const status = await getImageQueue(PROJECT_DIR);
      return Response.json(status);
    }

    if (url.pathname === "/api/images/costs") {
      const costs = await getImageCosts(PROJECT_DIR);
      return Response.json(costs);
    }

    if (url.pathname === "/api/images/generate" && req.method === "POST") {
      try {
        const body = (await req.json()) as { limit?: number; dryRun?: boolean; recordId?: string };
        const result = await generateImages(PROJECT_DIR, {
          limit: body.limit,
          dryRun: body.dryRun,
          recordId: body.recordId,
        });
        return Response.json(result);
      } catch (err: any) {
        return Response.json({ error: err.message, available: false }, { status: 500 });
      }
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

    // Static: serve UI files from ui/ directory
    if (url.pathname === "/" || url.pathname === "/index.html") {
      try {
        const html = readFileSync(join(import.meta.dir, "ui", "index.html"), "utf-8");
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      } catch {
        return new Response("UI not found. Ensure ui/index.html exists.", { status: 404 });
      }
    }

    // Serve static assets (styles/, modules/, etc.)
    if (url.pathname.startsWith("/styles/") || url.pathname.startsWith("/modules/")) {
      const safePath = url.pathname.replace(/\.\./g, "");
      const filePath = join(import.meta.dir, "ui", safePath);
      try {
        const content = readFileSync(filePath);
        const ext = safePath.substring(safePath.lastIndexOf("."));
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        return new Response(content, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Not found", { status: 404 });
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
