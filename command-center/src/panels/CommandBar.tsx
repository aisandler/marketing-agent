import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { theme } from "../utils/colors";
import type { PanelFocus } from "../types";

interface CommandBarProps {
  focus: PanelFocus;
  onSubmit: (input: string) => void;
  onFocus: () => void;
  showHelp: boolean;
}

const QUICK_ACTIONS = ["/cmo", "/analyst", "/onboard", "/images", "/intel", "/report", "/transcript"];

export function CommandBar({ focus, onSubmit, onFocus, showHelp }: CommandBarProps) {
  const [value, setValue] = useState("");
  const isFocused = focus === "command";

  const handleSubmit = (input: string) => {
    if (input.trim()) {
      onSubmit(input.trim());
      setValue("");
    }
  };

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={isFocused ? theme.borderActive : theme.border}
      borderTop={true}
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
      paddingX={1}
    >
      <Box>
        <Text color={theme.accent}>{">"} </Text>
        {isFocused ? (
          <TextInput
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder="Type a command..."
          />
        ) : (
          <Text color={theme.dim}>
            {value || "Press / to focus command bar"}
          </Text>
        )}
        <Box flexGrow={1} />
        <Text color={theme.dim}>[?] help</Text>
      </Box>
      <Box gap={2}>
        {QUICK_ACTIONS.map((action) => (
          <Text key={action} color={theme.dim}>
            {action}
          </Text>
        ))}
      </Box>
    </Box>
  );
}
