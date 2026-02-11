import React from "react";
import { Box, Text } from "ink";
import type { EventRow } from "../types";
import { theme } from "../utils/colors";

interface EventCardProps {
  event: EventRow;
  agentColor: string;
  agentTag: string;
  indentLevel: number;
  dimTag: boolean;
}

function getEventBadge(hookName: string | null): { symbol: string; label: string; color: string } {
  switch (hookName) {
    case "SubagentStart":
      return { symbol: "▶", label: "SPAWN", color: theme.success };
    case "SubagentStop":
      return { symbol: "■", label: "STOP", color: theme.dim };
    case "PreToolUse":
      return { symbol: "→", label: "TOOL", color: theme.warning };
    case "PostToolUse":
      return { symbol: "✓", label: "DONE", color: theme.info };
    case "PostToolUseFailure":
      return { symbol: "✗", label: "FAIL", color: theme.error };
    case "Stop":
      return { symbol: "◼", label: "END", color: theme.dim };
    case "SessionStart":
      return { symbol: "●", label: "START", color: theme.success };
    case "SessionEnd":
      return { symbol: "○", label: "END", color: theme.dim };
    default:
      return { symbol: "·", label: hookName || "?", color: theme.dim };
  }
}

function getToolSummary(event: EventRow): string {
  try {
    const payload = event.payload ? JSON.parse(event.payload) : {};
    const toolInput = payload.tool_input || payload.input || {};
    const toolName = event.tool_name || payload.tool_name || "";

    switch (toolName) {
      case "Bash":
        return truncate(toolInput.command || "", 40);
      case "Read":
        return shortPath(toolInput.file_path || "");
      case "Write":
      case "Edit":
        return shortPath(toolInput.file_path || "");
      case "Glob":
        return toolInput.pattern || "";
      case "Grep":
        return toolInput.pattern || "";
      case "WebFetch":
        return extractDomain(toolInput.url || "");
      case "WebSearch":
        return truncate(toolInput.query || "", 40);
      case "Task":
        return truncate(toolInput.description || "", 40);
      default:
        return toolName;
    }
  } catch {
    return event.tool_name || "";
  }
}

function getAgentTypeSummary(event: EventRow): string {
  try {
    const payload = event.payload ? JSON.parse(event.payload) : {};
    return payload.agent_type || payload.subagent_type || event.agent_type || "";
  } catch {
    return event.agent_type || "";
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 2) + ".." : s;
}

function shortPath(p: string): string {
  const parts = p.split("/");
  return parts.length > 2 ? parts.slice(-2).join("/") : p;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.slice(0, 30);
  }
}

function formatTime(ts: string | null): string {
  if (!ts) return "??:??:??";
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "??:??:??";
  }
}

export function EventCard({ event, agentColor, agentTag, indentLevel, dimTag }: EventCardProps) {
  const badge = getEventBadge(event.hook_event_name);
  const indent = "  ".repeat(indentLevel);

  const isToolEvent = ["PreToolUse", "PostToolUse", "PostToolUseFailure"].includes(event.hook_event_name || "");
  const isAgentEvent = ["SubagentStart", "SubagentStop"].includes(event.hook_event_name || "");

  const contextLine = isToolEvent
    ? `${event.tool_name || ""} ${getToolSummary(event)}`
    : isAgentEvent
      ? getAgentTypeSummary(event)
      : "";

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={agentColor}>▎</Text>
        <Text color={theme.dim}>{indent}</Text>
        <Text color={dimTag ? theme.dim : agentColor}>[{agentTag.padEnd(6)}]</Text>
        <Text> </Text>
        <Text color={theme.dim}>{formatTime(event.received_at)}</Text>
        <Text> </Text>
        <Text color={badge.color}>
          {badge.symbol} {badge.label}
        </Text>
      </Box>
      {contextLine ? (
        <Box>
          <Text color={agentColor}>▎</Text>
          <Text color={theme.dim}>{indent}{"         "}</Text>
          <Text color={theme.dim}>{truncate(contextLine, 50)}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
