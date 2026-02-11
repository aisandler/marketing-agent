import React from "react";
import { Box, Text } from "ink";
import { theme } from "../utils/colors";
import { IntelIndicator } from "../components/IntelIndicator";
import type { PanelFocus } from "../types";

interface IntelItem {
  label: string;
  daysAgo: number | null;
  displayLabel: string;
}

interface ContextFile {
  key: string;
  label: string;
  exists: boolean;
}

interface ContextPanelProps {
  contextFiles: ContextFile[];
  intelItems: IntelItem[];
  ledgerCount: number;
  focus: PanelFocus;
  width: number;
}

export function ContextPanel({
  contextFiles,
  intelItems,
  ledgerCount,
  focus,
  width,
}: ContextPanelProps) {
  const isFocused = focus === "context";

  return (
    <Box
      flexDirection="column"
      width={width}
      borderStyle="single"
      borderColor={isFocused ? theme.borderActive : theme.border}
    >
      <Box paddingX={1}>
        <Text bold color={isFocused ? theme.accent : theme.fg}>
          CONTEXT & INTEL
        </Text>
      </Box>

      <Box paddingX={1} flexDirection="column">
        <Text color={theme.dim} dimColor>
          CONTEXT FILES
        </Text>
        {contextFiles.map((cf, i) => (
          <Text key={cf.key}>
            <Text color={isFocused ? theme.info : theme.dim}>[{cf.key}]</Text>
            <Text> </Text>
            <Text color={cf.exists ? theme.fg : theme.dim}>
              {cf.label}
            </Text>
            {!cf.exists && <Text color={theme.dim}> ✗</Text>}
          </Text>
        ))}
      </Box>

      <Box paddingX={1} flexDirection="column" marginTop={1}>
        <Text color={theme.dim} dimColor>
          INTELLIGENCE STATUS
        </Text>
        {intelItems.map((item, i) => (
          <IntelIndicator
            key={i}
            label={item.label}
            daysAgo={item.daysAgo}
            displayLabel={item.displayLabel}
          />
        ))}
        <Text>
          <Text color={theme.fg}>{"Ledger".padEnd(14)}</Text>
          <Text color={theme.dim}>{`${ledgerCount} sessions`.padEnd(10)}</Text>
          <Text color={ledgerCount > 0 ? theme.success : theme.dim}>
            {ledgerCount > 0 ? "●" : "○"}
          </Text>
        </Text>
      </Box>
    </Box>
  );
}
