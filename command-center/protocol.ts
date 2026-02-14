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
    }
  | {
      type: "image_queue_sync";
    }
  | {
      type: "image_generate";
      recordId?: string;
      limit?: number;
      dryRun?: boolean;
    }
  | {
      type: "context_action";
      action: "collect_intel" | "run_onboard" | "generate_images";
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
      type: "subagent_start";
      sessionId: string;
      agentId: string;
      agentType: string;
      parentToolUseId: string;
      taskName: string;
      taskDescription: string;
    }
  | {
      type: "subagent_stop";
      sessionId: string;
      agentId: string;
      transcriptPath?: string;
    }
  | {
      type: "subagent_text_delta";
      sessionId: string;
      agentId: string;
      text: string;
    }
  | {
      type: "subagent_tool_progress";
      sessionId: string;
      agentId: string;
      toolName: string;
      toolId: string;
      elapsedSeconds: number;
    }
  | {
      type: "subagent_assistant_message";
      sessionId: string;
      agentId: string;
      content: ContentBlock[];
    }
  | {
      type: "subagent_tool_result";
      sessionId: string;
      agentId: string;
      toolId: string;
      content: unknown;
    }
  | {
      type: "image_queue_status";
      pending: number;
      processing: number;
      completed: number;
      failed: number;
      totalCost: number;
      records: any[];
    }
  | {
      type: "image_generation_progress";
      recordId: string;
      status: string;
      postTopic?: string;
      imageUrl?: string;
      error?: string;
    }
  | {
      type: "context_health";
      score: number;
      items: ContextHealthItem[];
      actions: ContextAction[];
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

// --- Context Health Types ---

export interface ContextHealthItem {
  key: string;
  label: string;
  category: "config" | "intel" | "content";
  status: "ok" | "missing" | "stale" | "old";
  path: string;
  daysAgo?: number;
  fixAction?: string;
}

export interface ContextAction {
  label: string;
  description: string;
  agentName: string;
  prompt: string;
}
