import type { EventRow } from "../db";

export type { EventRow };

export type PanelFocus = "agents" | "activity" | "context" | "command";

export interface AgentStatus {
  agentId: string;
  agentType: string;
  status: "active" | "idle" | "spawning";
  startedAt: string;
  parentSessionId?: string;
  toolCounts: Record<string, number>;
  totalTools: number;
}

export interface ProcessInfo {
  pid: number;
  agentType: string;
  task: string;
  startedAt: Date;
  proc: any; // Bun subprocess
}
