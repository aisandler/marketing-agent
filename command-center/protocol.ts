// WebSocket message type definitions for Command Center
// Browser <-> Server communication protocol

// --- Session Info ---

export type SessionStatus =
  | "starting"
  | "running"
  | "waiting_permission"
  | "idle"
  | "completed"
  | "error";

// --- File Browser Types ---

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  modified?: number;
}

export interface FileContent {
  path: string;
  content: string;
  size: number;
}

export interface SessionInfo {
  id: string;
  agentName: string;
  agentDisplayName: string;
  agentColor: string;
  status: SessionStatus;
  cost: number;
  turns: number;
  startedAt: number;
}

// --- Browser -> Server ---

export type ClientMessage =
  | {
      type: "start_session";
      agentName: string;
      prompt: string;
    }
  | {
      type: "user_message";
      sessionId: string;
      message: string;
    }
  | {
      type: "permission_response";
      sessionId: string;
      requestId: string;
      allow: boolean;
      updatedInput?: Record<string, unknown>;
    }
  | {
      type: "interrupt_session";
      sessionId: string;
    }
  | {
      type: "sync";
    };

// --- Server -> Browser ---

export type ServerMessage =
  | {
      type: "text_delta";
      sessionId: string;
      text: string;
    }
  | {
      type: "assistant_message";
      sessionId: string;
      content: ContentBlock[];
    }
  | {
      type: "tool_result";
      sessionId: string;
      toolId: string;
      content: unknown;
    }
  | {
      type: "permission_request";
      sessionId: string;
      requestId: string;
      toolName: string;
      input: Record<string, unknown>;
    }
  | {
      type: "session_result";
      sessionId: string;
      cost: number;
      turns: number;
      durationMs: number;
      result: string;
      isError: boolean;
    }
  | {
      type: "session_status";
      sessionId: string;
      agentName: string;
      status: SessionStatus;
    }
  | {
      type: "sync_state";
      sessions: SessionInfo[];
      agents: AgentInfo[];
      intel: IntelPayload;
    }
  | {
      type: "tool_progress";
      sessionId: string;
      toolName: string;
      toolId: string;
      elapsedSeconds: number;
    }
  | {
      type: "error";
      sessionId?: string;
      message: string;
    };

// --- Shared content types ---

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> };

export interface AgentInfo {
  name: string;
  displayName: string;
  shortTag: string;
  color: string;
  description: string;
  hotkey: string;
  isOrchestrator: boolean;
}

export interface IntelPayload {
  intel: {
    items: Array<{
      label: string;
      daysAgo: number | null;
      displayLabel: string;
      status: "fresh" | "stale" | "old" | "never";
    }>;
    ledgerCount: number;
  };
  contextFiles: Array<{
    key: string;
    label: string;
    path: string;
    exists: boolean;
  }>;
  isOnboarded: boolean;
}
