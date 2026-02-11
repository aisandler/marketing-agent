import React from "react";
import { Box, Text } from "ink";
import type { AgentMeta } from "../utils/agents";
import type { AgentStatus, PanelFocus } from "../types";
import { AgentRow } from "../components/AgentRow";
import { theme } from "../utils/colors";

interface AgentPanelProps {
  agents: AgentMeta[];
  agentStatuses: Map<string, AgentStatus>;
  selectedIndex: number;
  focus: PanelFocus;
  width: number;
}

interface TreeEntry {
  agent: AgentMeta;
  indent: number;
  treePrefix: string;
}

function buildTreeEntries(
  agents: AgentMeta[],
  statuses: Map<string, AgentStatus>
): TreeEntry[] {
  const orchestrators = agents.filter((a) => a.isOrchestrator);
  const specialists = agents.filter((a) => !a.isOrchestrator);

  // Build parent->children map from statuses
  const childrenOf = new Map<string, string[]>(); // agentType -> child agentTypes
  for (const [, s] of statuses) {
    if (s.parentSessionId) {
      // Find parent agent type from the parent session
      for (const [, ps] of statuses) {
        if (ps.agentId === s.parentSessionId) {
          const children = childrenOf.get(ps.agentType) || [];
          children.push(s.agentType);
          childrenOf.set(ps.agentType, children);
          break;
        }
      }
    }
  }

  const entries: TreeEntry[] = [];

  // Orchestrators first
  for (const orch of orchestrators) {
    entries.push({ agent: orch, indent: 0, treePrefix: "" });

    // Find active children spawned by this orchestrator
    const children = childrenOf.get(orch.name) || [];
    for (let i = 0; i < children.length; i++) {
      const childAgent = specialists.find((s) => s.name === children[i]);
      if (childAgent) {
        const isLast = i === children.length - 1;
        entries.push({
          agent: childAgent,
          indent: 1,
          treePrefix: isLast ? "└─ " : "├─ ",
        });
      }
    }
  }

  // Separator
  entries.push({ agent: null as any, indent: -1, treePrefix: "separator" });

  // Remaining specialists (not shown as children above)
  const childTypes = new Set([...childrenOf.values()].flat());
  for (const spec of specialists) {
    // Always show in the full list, but mark if already in tree
    entries.push({ agent: spec, indent: 0, treePrefix: "" });
  }

  return entries;
}

export function AgentPanel({ agents, agentStatuses, selectedIndex, focus, width }: AgentPanelProps) {
  const isFocused = focus === "agents";
  const entries = buildTreeEntries(agents, agentStatuses);

  // Map selectedIndex to the actual agent entries (skip separators)
  const agentEntries = entries.filter((e) => e.indent !== -1);
  let flatIndex = 0;

  // Find status by agent name
  function getStatus(agentName: string): AgentStatus | undefined {
    for (const [, s] of agentStatuses) {
      if (s.agentType === agentName) return s;
    }
    return undefined;
  }

  // Selected agent detail
  const selectedAgent = agentEntries[selectedIndex];
  const selectedStatus = selectedAgent ? getStatus(selectedAgent.agent.name) : undefined;

  return (
    <Box
      flexDirection="column"
      width={width}
      borderStyle="single"
      borderColor={isFocused ? theme.borderActive : theme.border}
    >
      <Box paddingX={1}>
        <Text bold color={isFocused ? theme.accent : theme.fg}>
          AGENTS
        </Text>
      </Box>

      <Box paddingX={1} flexDirection="column">
        {entries.map((entry, i) => {
          if (entry.indent === -1) {
            return (
              <Box key={`sep-${i}`} flexDirection="column">
                <Text color={theme.dim}>{"─".repeat(width - 4)}</Text>
                <Text color={theme.dim} dimColor>SPECIALISTS</Text>
              </Box>
            );
          }
          const agentIdx = agentEntries.indexOf(entry);
          return (
            <AgentRow
              key={entry.agent.name + "-" + i}
              agent={entry.agent}
              status={getStatus(entry.agent.name)}
              isSelected={isFocused && agentIdx === selectedIndex}
              indent={entry.indent}
              treePrefix={entry.treePrefix}
              maxWidth={width - 4}
            />
          );
        })}
      </Box>

      {/* Agent detail view when selected and active */}
      {isFocused && selectedStatus && selectedStatus.status === "active" && (
        <Box paddingX={1} flexDirection="column" marginTop={1}>
          <Text color={theme.dim}>{"─".repeat(width - 4)}</Text>
          <Text bold color={theme.fg}>
            {selectedAgent.agent.displayName}{" "}
            <Text color={theme.success}>● ACTIVE</Text>
          </Text>
          <Text color={theme.dim}>
            Running:{" "}
            {formatDuration(new Date(selectedStatus.startedAt))}
          </Text>
          <Text color={theme.dim}>
            Tools: {selectedStatus.totalTools} calls
            {selectedStatus.totalTools > 0
              ? ` (${Object.entries(selectedStatus.toolCounts)
                  .map(([k, v]) => `${v}${k[0]}`)
                  .join(" ")})`
              : ""}
          </Text>
          {selectedStatus.parentSessionId && (
            <Text color={theme.dim}>
              Parent: {selectedStatus.parentSessionId.slice(0, 8)}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

function formatDuration(start: Date): string {
  const ms = Date.now() - start.getTime();
  const secs = Math.floor(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return `${mins}m ${remSecs}s`;
}
