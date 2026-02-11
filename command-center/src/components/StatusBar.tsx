import React from "react";
import { Box, Text } from "ink";
import { theme } from "../utils/colors";

interface StatusBarProps {
  isOnboarded: boolean;
  intelFresh: boolean;
  activeAgentCount: number;
  sessionId: string | null;
  wsConnected: boolean;
}

export function StatusBar({ isOnboarded, intelFresh, activeAgentCount, sessionId, wsConnected }: StatusBarProps) {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <Box
      borderStyle="single"
      borderColor={theme.accent}
      borderBottom={true}
      borderTop={false}
      borderLeft={false}
      borderRight={false}
      paddingX={1}
      justifyContent="space-between"
    >
      <Box gap={1}>
        <Text bold color={theme.accent}>
          MARKETING COMMAND CENTER
        </Text>
      </Box>
      <Box gap={2}>
        <Text>
          <Text color={isOnboarded ? theme.success : theme.error}>
            {isOnboarded ? "●" : "○"}
          </Text>{" "}
          <Text color={theme.dim}>Onboarded</Text>
        </Text>
        <Text>
          <Text color={intelFresh ? theme.success : theme.warning}>
            {intelFresh ? "●" : "◐"}
          </Text>{" "}
          <Text color={theme.dim}>Intel</Text>
        </Text>
        <Text>
          <Text color={activeAgentCount > 0 ? theme.success : theme.dim}>
            {activeAgentCount}
          </Text>{" "}
          <Text color={theme.dim}>Active</Text>
        </Text>
        <Text>
          <Text color={wsConnected ? theme.success : theme.error}>
            {wsConnected ? "●" : "○"}
          </Text>{" "}
          <Text color={theme.dim}>WS</Text>
        </Text>
      </Box>
      <Box gap={1}>
        <Text color={theme.dim}>
          {sessionId ? `Session: ${sessionId.slice(0, 8)}` : "No session"}
        </Text>
        <Text color={theme.dim}>{time}</Text>
      </Box>
    </Box>
  );
}
