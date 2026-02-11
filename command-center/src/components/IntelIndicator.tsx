import React from "react";
import { Text } from "ink";
import { theme } from "../utils/colors";

interface IntelIndicatorProps {
  label: string;
  daysAgo: number | null;
  displayLabel: string;
}

export function IntelIndicator({ label, daysAgo, displayLabel }: IntelIndicatorProps) {
  let dot: string;
  let dotColor: string;

  if (daysAgo === null) {
    dot = "○";
    dotColor = theme.error;
  } else if (daysAgo <= 7) {
    dot = "●";
    dotColor = theme.success;
  } else if (daysAgo <= 30) {
    dot = "◐";
    dotColor = theme.warning;
  } else {
    dot = "○";
    dotColor = theme.error;
  }

  return (
    <Text>
      <Text color={theme.fg}>{label.padEnd(14)}</Text>
      <Text color={theme.dim}>{displayLabel.padEnd(10)}</Text>
      <Text color={dotColor}>{dot}</Text>
    </Text>
  );
}
