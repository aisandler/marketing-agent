import { useState, useCallback } from "react";

export function useAgentFilter() {
  const [filterAgent, setFilterAgent] = useState<string | null>(null);

  const toggleFilter = useCallback((agentName: string) => {
    setFilterAgent((prev) => (prev === agentName ? null : agentName));
  }, []);

  const clearFilter = useCallback(() => {
    setFilterAgent(null);
  }, []);

  return { filterAgent, toggleFilter, clearFilter };
}
