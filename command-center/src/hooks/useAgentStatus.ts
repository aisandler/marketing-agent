import { useState, useCallback } from "react";
import type { EventRow, AgentStatus } from "../types";

export function useAgentStatus() {
  const [statuses, setStatuses] = useState<Map<string, AgentStatus>>(new Map());

  const processEvent = useCallback((event: EventRow) => {
    const hookName = event.hook_event_name;
    const agentId = event.agent_id;

    if (hookName === "SubagentStart" && agentId) {
      setStatuses((prev) => {
        const next = new Map(prev);
        next.set(agentId, {
          agentId,
          agentType: event.agent_type || "unknown",
          status: "active",
          startedAt: event.received_at || new Date().toISOString(),
          parentSessionId: event.parent_session_id || undefined,
          toolCounts: {},
          totalTools: 0,
        });
        return next;
      });
    } else if (hookName === "SubagentStop" && agentId) {
      setStatuses((prev) => {
        const next = new Map(prev);
        const existing = next.get(agentId);
        if (existing) {
          next.set(agentId, { ...existing, status: "idle" });
        }
        return next;
      });
    } else if (
      (hookName === "PostToolUse" || hookName === "PostToolUseFailure") &&
      agentId &&
      event.tool_name
    ) {
      setStatuses((prev) => {
        const next = new Map(prev);
        const existing = next.get(agentId);
        if (existing) {
          const counts = { ...existing.toolCounts };
          counts[event.tool_name!] = (counts[event.tool_name!] || 0) + 1;
          next.set(agentId, {
            ...existing,
            toolCounts: counts,
            totalTools: existing.totalTools + 1,
          });
        }
        return next;
      });
    }
  }, []);

  const activeCount = [...statuses.values()].filter(
    (s) => s.status === "active"
  ).length;

  return { statuses, processEvent, activeCount };
}
