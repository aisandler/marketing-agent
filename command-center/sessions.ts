import { query } from "@anthropic-ai/claude-agent-sdk";
import type { Options } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "fs";
import type { AgentMeta } from "./agents.ts";
import type { ServerMessage, SessionInfo, SessionStatus } from "./protocol.ts";

type SendFn = (msg: ServerMessage) => void;

interface PendingPermission {
  resolve: (result: { allow: boolean; updatedInput?: Record<string, unknown> }) => void;
  requestId: string;
}

interface ManagedSession {
  id: string;
  sdkSessionId: string | null;
  agent: AgentMeta;
  agentContent: string;
  status: SessionStatus;
  cost: number;
  turns: number;
  startedAt: number;
  pendingPermission: PendingPermission | null;
  abortController: AbortController;
  lastProgressAt: number;
}

export class SessionManager {
  private sessions = new Map<string, ManagedSession>();
  private send: SendFn;
  private projectDir: string;

  constructor(projectDir: string, send: SendFn) {
    this.projectDir = projectDir;
    this.send = send;
  }

  getSessions(): SessionInfo[] {
    return Array.from(this.sessions.values()).map((s) => ({
      id: s.id,
      agentName: s.agent.name,
      agentDisplayName: s.agent.displayName,
      agentColor: s.agent.color,
      status: s.status,
      cost: s.cost,
      turns: s.turns,
      startedAt: s.startedAt,
    }));
  }

  async startSession(agent: AgentMeta, initialPrompt: string): Promise<string> {
    const sessionId = `${agent.name}-${Date.now().toString(36)}`;
    const abortController = new AbortController();

    // Read agent file content for system prompt
    let agentContent = "";
    try {
      agentContent = readFileSync(agent.filePath, "utf-8");
    } catch {
      // Agent file might not exist for some agents
    }

    const session: ManagedSession = {
      id: sessionId,
      sdkSessionId: null,
      agent,
      agentContent,
      status: "starting",
      cost: 0,
      turns: 0,
      startedAt: Date.now(),
      pendingPermission: null,
      abortController,
      lastProgressAt: 0,
    };

    this.sessions.set(sessionId, session);
    this.send({
      type: "session_status",
      sessionId,
      agentName: agent.name,
      status: "starting",
    });

    // Run first turn (don't await — runs in background)
    this.runTurn(sessionId, initialPrompt);

    return sessionId;
  }

  /**
   * Run a single turn: send one message, stream all responses until result.
   * For the first turn, this creates a new session.
   * For follow-up turns, this resumes the existing session by sdkSessionId.
   */
  private async runTurn(sessionId: string, message: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const self = this;

    // Build SDK options
    // Note: executable must be a full path because bun may not be on PATH.
    const options: Options = {
      abortController: session.abortController,
      cwd: this.projectDir,
      executable: process.execPath as "bun",
      settingSources: ["user", "project"],
      systemPrompt: {
        type: "preset",
        preset: "claude_code",
        append: session.agentContent,
      },
      tools: { type: "preset", preset: "claude_code" },
      permissionMode: "acceptEdits",
      includePartialMessages: true,
      stderr: (data: string) => {
        if (data.includes("error") || data.includes("Error") || data.includes("ENOENT")) {
          console.error(`[session:${sessionId}] stderr:`, data.substring(0, 500));
        }
      },
      canUseTool: (toolName, input, { signal }) =>
        self.handlePermission(sessionId, toolName, input, signal),
    };

    // Resume if we have a previous session ID
    if (session.sdkSessionId) {
      options.resume = session.sdkSessionId;
    }

    try {
      console.log(`[session:${sessionId}] Starting turn (agent: ${session.agent.name}, resume: ${session.sdkSessionId || "new"})`);

      const q = query({ prompt: message, options });
      session.status = "running";
      this.send({
        type: "session_status",
        sessionId,
        agentName: session.agent.name,
        status: "running",
      });

      for await (const msg of q) {
        // Capture SDK session ID from init message
        if (msg.type === "system" && (msg as any).subtype === "init") {
          session.sdkSessionId = (msg as any).session_id || null;
          continue;
        }

        // Streaming text deltas
        if (msg.type === "stream_event") {
          const event = (msg as any).event;
          if (event?.type === "content_block_delta" && event.delta?.type === "text_delta") {
            this.send({
              type: "text_delta",
              sessionId,
              text: event.delta.text,
            });
          }
          continue;
        }

        // Tool progress — throttle to 1 msg/second/session
        if (msg.type === "tool_progress") {
          const now = Date.now();
          if (now - session.lastProgressAt >= 1000) {
            session.lastProgressAt = now;
            this.send({
              type: "tool_progress",
              sessionId,
              toolName: (msg as any).tool_name || "",
              toolId: (msg as any).tool_id || "",
              elapsedSeconds: (msg as any).elapsed_seconds || 0,
            });
          }
          continue;
        }

        // Complete assistant message (text + tool_use blocks)
        if (msg.type === "assistant") {
          const content = (msg as any).message?.content || [];
          const mapped = content.map((block: any) => {
            if (block.type === "text") {
              return { type: "text", text: block.text };
            }
            if (block.type === "tool_use") {
              return {
                type: "tool_use",
                id: block.id,
                name: block.name,
                input: block.input,
              };
            }
            return block;
          });
          this.send({ type: "assistant_message", sessionId, content: mapped });
          continue;
        }

        // Tool results (come back as user messages)
        if (msg.type === "user") {
          const content = (msg as any).message?.content || [];
          const blocks = Array.isArray(content) ? content : [];
          for (const block of blocks) {
            if (block.type === "tool_result") {
              this.send({
                type: "tool_result",
                sessionId,
                toolId: block.tool_use_id,
                content: block.content,
              });
            }
          }
          continue;
        }

        // Turn result — update stats, mark session as idle (waiting for next message)
        if (msg.type === "result") {
          const result = msg as any;
          session.cost = result.total_cost_usd || 0;
          session.turns = result.num_turns || 0;
          this.send({
            type: "session_result",
            sessionId,
            cost: session.cost,
            turns: session.turns,
            durationMs: result.duration_ms || Date.now() - session.startedAt,
            result: result.result || "",
            isError: result.is_error || false,
          });
        }
      }

      // Turn finished — session is idle, waiting for next user message
      session.status = "idle";
      this.send({
        type: "session_status",
        sessionId,
        agentName: session.agent.name,
        status: "idle",
      });
      console.log(`[session:${sessionId}] Turn complete, session idle (sdkSessionId: ${session.sdkSessionId})`);
    } catch (err: any) {
      if (err.name === "AbortError") {
        session.status = "completed";
        this.send({
          type: "session_status",
          sessionId,
          agentName: session.agent.name,
          status: "completed",
        });
        return;
      }

      console.error(`[session:${sessionId}] Error:`, err.message || err);
      session.status = "error";
      this.send({
        type: "error",
        sessionId,
        message: err.message || "Session error",
      });
      this.send({
        type: "session_status",
        sessionId,
        agentName: session.agent.name,
        status: "error",
      });
    }
  }

  sendMessage(sessionId: string, message: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Start a new turn by resuming the session
    if (session.status === "idle" || session.status === "error") {
      this.runTurn(sessionId, message);
    } else {
      console.log(`[session:${sessionId}] Message queued (session busy: ${session.status})`);
      // Session is mid-turn, can't send yet — in future could queue
    }
  }

  private async handlePermission(
    sessionId: string,
    toolName: string,
    input: Record<string, unknown>,
    _signal: AbortSignal,
  ): Promise<{ behavior: "allow"; updatedInput: Record<string, unknown> } | { behavior: "deny"; message: string }> {
    const session = this.sessions.get(sessionId);
    if (!session) return { behavior: "deny", message: "Session not found" };

    // AskUserQuestion always goes to browser
    if (toolName === "AskUserQuestion") {
      return this.forwardPermission(session, sessionId, toolName, input);
    }

    // Forward dangerous Bash commands to browser for approval
    if (toolName === "Bash") {
      const cmd = String(input.command || "");
      const dangerous = /\brm\s+-rf\b|\brm\s+.*--force\b|--hard|reset\s+--hard|drop\s+|truncate\s+|kill\s+-9|shutdown|--no-verify/i;
      if (dangerous.test(cmd)) {
        return this.forwardPermission(session, sessionId, toolName, input);
      }
    }

    // Auto-approve everything else (acceptEdits mode handles the rest)
    return { behavior: "allow", updatedInput: input };
  }

  private async forwardPermission(
    session: ManagedSession,
    sessionId: string,
    toolName: string,
    input: Record<string, unknown>,
  ): Promise<{ behavior: "allow"; updatedInput: Record<string, unknown> } | { behavior: "deny"; message: string }> {
    const requestId = `perm-${Date.now().toString(36)}`;

    this.send({
      type: "permission_request",
      sessionId,
      requestId,
      toolName,
      input,
    });

    session.status = "waiting_permission";
    this.send({
      type: "session_status",
      sessionId,
      agentName: session.agent.name,
      status: "waiting_permission",
    });

    // Wait for browser response
    const response = await new Promise<{
      allow: boolean;
      updatedInput?: Record<string, unknown>;
    }>((resolve) => {
      session.pendingPermission = { resolve, requestId };
    });

    session.status = "running";
    this.send({
      type: "session_status",
      sessionId,
      agentName: session.agent.name,
      status: "running",
    });

    if (response.allow) {
      return {
        behavior: "allow",
        updatedInput: response.updatedInput || input,
      };
    }

    return { behavior: "deny", message: "User denied this action" };
  }

  resolvePermission(
    sessionId: string,
    requestId: string,
    allow: boolean,
    updatedInput?: Record<string, unknown>,
  ) {
    const session = this.sessions.get(sessionId);
    if (!session?.pendingPermission) return;
    if (session.pendingPermission.requestId !== requestId) return;

    const { resolve } = session.pendingPermission;
    session.pendingPermission = null;
    resolve({ allow, updatedInput });
  }

  interruptSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.abortController.abort();
    session.status = "completed";
    this.send({
      type: "session_status",
      sessionId,
      agentName: session.agent.name,
      status: "completed",
    });
  }
}
