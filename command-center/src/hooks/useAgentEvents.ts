import { useState, useCallback } from "react";
import type { EventRow } from "../types";

const MAX_PER_AGENT = 100;

export function useAgentEvents() {
  const [agentEventMap, setAgentEventMap] = useState<Map<string, EventRow[]>>(new Map());

  const addEvent = useCallback((event: EventRow) => {
    const agentId = event.agent_id;
    if (!agentId) return;

    setAgentEventMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(agentId) || [];
      const updated = [...existing, event];
      next.set(
        agentId,
        updated.length > MAX_PER_AGENT
          ? updated.slice(-MAX_PER_AGENT)
          : updated
      );
      return next;
    });
  }, []);

  const getEventsForAgent = useCallback(
    (agentId: string): EventRow[] => {
      return agentEventMap.get(agentId) || [];
    },
    [agentEventMap]
  );

  const getEventsForType = useCallback(
    (agentType: string): EventRow[] => {
      const result: EventRow[] = [];
      for (const [, events] of agentEventMap) {
        for (const e of events) {
          if (e.agent_type === agentType) result.push(e);
        }
      }
      return result.sort((a, b) => a.id - b.id);
    },
    [agentEventMap]
  );

  return { addEvent, getEventsForAgent, getEventsForType };
}
