import React from "react";
import { Box, Text } from "ink";
import type { AgentMeta } from "../utils/agents";
import type { AgentStatus } from "../types";
import { getAgentColor, theme } from "../utils/colors";

interface AgentRowProps {
  agent: AgentMeta;
  status?: AgentStatus;
  isSelected: boolean;
  indent: number;
  treePrefix: string;
  maxWidth: number;
}

export function AgentRow({ agent, status, isSelected, indent, treePrefix, maxWidth }: AgentRowProps) {
  const agentColor = getAgentColor(agent.color);
  const statusChar = status?.status === "active" ? "●" : "○";
  const statusColor = status?.status === "active" ? theme.success : theme.dim;

  const selector = isSelected ? "▸" : " ";
  const hotkey = `[${agent.hotkey}]`;
  const indentStr = " ".repeat(indent * 2);

  // Calculate available space for name
  // Format: "▸ ├─ [b] Name           ●"
  const prefixLen = 1 + 1 + indent * 2 + treePrefix.length + hotkey.length + 1 + 2; // selector + space + indent + tree + hotkey + space + status padding
  const nameMaxLen = Math.max(8, maxWidth - prefixLen);
  const displayName = agent.displayName.length > nameMaxLen
    ? agent.displayName.slice(0, nameMaxLen - 2) + ".."
    : agent.displayName.padEnd(nameMaxLen);

  return (
    <Box>
      <Text color={isSelected ? theme.accent : theme.dim}>{selector}</Text>
      <Text color={theme.dim}>{indentStr}{treePrefix}</Text>
      <Text color={agentColor}>{hotkey}</Text>
      <Text> </Text>
      <Text color={isSelected ? theme.fg : theme.dim}>{displayName}</Text>
      <Text> </Text>
      <Text color={statusColor}>{statusChar}</Text>
    </Box>
  );
}
