import { Database } from "bun:sqlite";
import { join } from "path";

const DB_PATH = join(import.meta.dir, "events.db");

let db: Database;

export function getDb(): Database {
  if (!db) {
    db = new Database(DB_PATH, { create: true });
    db.exec("PRAGMA journal_mode=WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        hook_event_name TEXT,
        tool_name TEXT,
        agent_type TEXT,
        agent_id TEXT,
        parent_session_id TEXT,
        payload JSON,
        received_at TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_session ON events(session_id);
      CREATE INDEX IF NOT EXISTS idx_event ON events(hook_event_name);
      CREATE INDEX IF NOT EXISTS idx_agent ON events(agent_id);
    `);
  }
  return db;
}

export interface EventRow {
  id: number;
  session_id: string | null;
  hook_event_name: string | null;
  tool_name: string | null;
  agent_type: string | null;
  agent_id: string | null;
  parent_session_id: string | null;
  payload: string | null;
  received_at: string | null;
  created_at: string;
}

export function insertEvent(event: Record<string, unknown>): EventRow {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO events (session_id, hook_event_name, tool_name, agent_type, agent_id, parent_session_id, payload, received_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const hookName = (event.hook_event_name ?? event.event ?? null) as string | null;
  const toolName = (event.tool_name ?? (event as any).tool?.name ?? null) as string | null;
  const agentType = (event.agent_type ?? null) as string | null;
  const agentId = (event.agent_id ?? event.session_id ?? null) as string | null;
  const parentSessionId = (event.parent_session_id ?? null) as string | null;
  const sessionId = (event.session_id ?? null) as string | null;
  const receivedAt = (event.received_at ?? new Date().toISOString()) as string;

  const result = stmt.run(
    sessionId,
    hookName,
    toolName,
    agentType,
    agentId,
    parentSessionId,
    JSON.stringify(event),
    receivedAt
  );

  return {
    id: Number(result.lastInsertRowid),
    session_id: sessionId,
    hook_event_name: hookName,
    tool_name: toolName,
    agent_type: agentType,
    agent_id: agentId,
    parent_session_id: parentSessionId,
    payload: JSON.stringify(event),
    received_at: receivedAt,
    created_at: new Date().toISOString(),
  };
}

export function getRecentEvents(limit = 200): EventRow[] {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM events ORDER BY id DESC LIMIT ?
  `).all(limit) as EventRow[];
}

export function getEventsByAgent(agentId: string, limit = 100): EventRow[] {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM events WHERE agent_id = ? ORDER BY id DESC LIMIT ?
  `).all(agentId, limit) as EventRow[];
}

export function clearEvents(): void {
  const db = getDb();
  db.exec("DELETE FROM events");
}
