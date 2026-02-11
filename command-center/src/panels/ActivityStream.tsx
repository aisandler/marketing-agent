import React from "react";
import { Box, Text } from "ink";
import type { EventRow, PanelFocus } from "../types";
import { EventCard } from "../components/EventCard";
import { theme, getAgentColor } from "../utils/colors";
import type { AgentMeta } from "../utils/agents";

interface ActivityStreamProps {
  events: EventRow[];
  agents: AgentMeta[];
  agentActiveCount: number;
  filterAgent: string | null;
  focus: PanelFocus;
  scrollOffset: number;
  maxHeight: number;
  isOnboarded: boolean;
}

function getAgentMeta(
  agents: AgentMeta[],
  agentType: string | null
): { color: string; tag: string } {
  if (!agentType) return { color: theme.dim, tag: "???" };
  const agent = agents.find(
    (a) => a.name === agentType || a.shortTag.toLowerCase() === agentType.toLowerCase()
  );
  if (agent) {
    return { color: getAgentColor(agent.color), tag: agent.shortTag };
  }
  // Generate tag from agent type
  const first = agentType.split("-")[0];
  const tag = first.length <= 3 ? first.toUpperCase() : first.charAt(0).toUpperCase() + first.slice(1, 7);
  return { color: theme.dim, tag };
}

function getIndentLevel(event: EventRow, events: EventRow[]): number {
  // Simple indent: if event has parent_session_id, indent 1 level
  // If parent also has parent, indent 2 (recursive)
  if (!event.parent_session_id) return 0;

  let level = 1;
  let currentParent = event.parent_session_id;
  const visited = new Set<string>();

  while (currentParent && level < 3) {
    if (visited.has(currentParent)) break;
    visited.add(currentParent);

    const parentEvent = events.find(
      (e) =>
        e.agent_id === currentParent &&
        e.hook_event_name === "SubagentStart"
    );
    if (parentEvent?.parent_session_id) {
      level++;
      currentParent = parentEvent.parent_session_id;
    } else {
      break;
    }
  }

  return level;
}

export function ActivityStream({
  events,
  agents,
  agentActiveCount,
  filterAgent,
  focus,
  scrollOffset,
  maxHeight,
  isOnboarded,
}: ActivityStreamProps) {
  const isFocused = focus === "activity";
  const dimTags = agentActiveCount <= 1;

  // Apply filter
  const filtered = filterAgent
    ? events.filter((e) => e.agent_type === filterAgent || e.agent_id === filterAgent)
    : events;

  // Apply scroll — show the last maxHeight events, offset by scrollOffset
  const visibleCount = Math.max(1, maxHeight - 3); // leave room for header
  const end = filtered.length - scrollOffset;
  const start = Math.max(0, end - visibleCount);
  const visible = filtered.slice(start, end > 0 ? end : filtered.length);

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderStyle="single"
      borderColor={isFocused ? theme.borderActive : theme.border}
    >
      <Box paddingX={1} justifyContent="space-between">
        <Box gap={1}>
          <Text bold color={isFocused ? theme.accent : theme.fg}>
            ACTIVITY STREAM
          </Text>
          {filterAgent && (
            <Text color={theme.warning}>◈ {filterAgent}</Text>
          )}
        </Box>
        <Text color={theme.dim}>
          {filtered.length} events
        </Text>
      </Box>

      <Box paddingX={1} flexDirection="column" flexGrow={1}>
        {!isOnboarded && events.length === 0 ? (
          <Box flexDirection="column" marginTop={1} paddingX={1}>
            <Text bold color={theme.warning}>Brand not configured</Text>
            <Text color={theme.dim}> </Text>
            <Text color={theme.fg}>Run <Text color={theme.accent} bold>/onboard</Text> to set up your brand</Text>
            <Text color={theme.fg}>architecture, voice guide, and competitive</Text>
            <Text color={theme.fg}>analysis. Type <Text color={theme.info}>/</Text> then <Text color={theme.info}>onboard</Text> in the command bar.</Text>
            <Text color={theme.dim}> </Text>
            <Text color={theme.dim}>Or launch any agent directly with hotkeys.</Text>
          </Box>
        ) : visible.length === 0 ? (
          <Box justifyContent="center" marginTop={1}>
            <Text color={theme.dim}>
              {events.length === 0
                ? "Waiting for events..."
                : "No events match filter"}
            </Text>
          </Box>
        ) : (
          visible.map((event) => {
            const meta = getAgentMeta(agents, event.agent_type);
            const indent = getIndentLevel(event, events);
            return (
              <EventCard
                key={event.id}
                event={event}
                agentColor={meta.color}
                agentTag={meta.tag}
                indentLevel={indent}
                dimTag={dimTags}
              />
            );
          })
        )}
      </Box>

      {scrollOffset > 0 && (
        <Box paddingX={1}>
          <Text color={theme.dim}>
            ↑ {scrollOffset} more below · Press End to resume auto-scroll
          </Text>
        </Box>
      )}
    </Box>
  );
}
