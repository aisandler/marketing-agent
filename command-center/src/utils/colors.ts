export const theme = {
  bg: "black",
  fg: "#e0e0e0",
  dim: "#666666",
  accent: "#7c6bff",
  success: "#4ade80",
  warning: "#fbbf24",
  error: "#ef4444",
  info: "#22d3ee",

  agentColors: {
    blue: "#3b82f6",
    green: "#22c55e",
    purple: "#a855f7",
    pink: "#ec4899",
    red: "#ef4444",
    cyan: "#06b6d4",
    orange: "#f97316",
    amber: "#f59e0b",
  } as Record<string, string>,

  border: "#333333",
  borderActive: "#7c6bff",
};

export function getAgentColor(color?: string): string {
  if (!color) return theme.dim;
  return theme.agentColors[color] ?? theme.dim;
}
