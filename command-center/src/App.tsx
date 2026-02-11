import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, useInput, useApp, useStdout } from "ink";
import { theme } from "./utils/colors";
import { loadAgents, type AgentMeta } from "./utils/agents";
import { getProjectDir, isOnboarded, fileExists } from "./utils/config";
import { StatusBar } from "./components/StatusBar";
import { AgentPanel } from "./panels/AgentPanel";
import { ActivityStream } from "./panels/ActivityStream";
import { ContextPanel } from "./panels/ContextPanel";
import { CommandBar } from "./panels/CommandBar";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAgentStatus } from "./hooks/useAgentStatus";
import { useAgentEvents } from "./hooks/useAgentEvents";
import { useAgentFilter } from "./hooks/useAgentFilter";
import { useIntelStatus } from "./hooks/useIntelStatus";
import type { EventRow, PanelFocus, ProcessInfo } from "./types";
import { join } from "path";
import { spawn, spawnSync } from "child_process";

const PROJECT_DIR = getProjectDir();
const API_URL = "http://localhost:3457";

// Context file definitions
const CONTEXT_FILES = [
  { key: "1", label: "brand.json", rel: "config/brand.json" },
  { key: "2", label: "voice-guide.md", rel: "client-context/brand/voice-and-tone-guide.md" },
  { key: "3", label: "content-bank.md", rel: "content/social/content-bank.md" },
  { key: "4", label: "competitive.md", rel: "client-context/competitors/differentiation-strategy.md" },
  { key: "5", label: "partners.json", rel: "config/partners.json" },
  { key: "6", label: "airtable.json", rel: "config/airtable.json" },
  { key: "7", label: "business/", rel: "client-context/business" },
  { key: "8", label: "keywords/", rel: "client-context/keywords" },
  { key: "9", label: "ledger.md", rel: "docs/intelligence/internal/context-intelligence-ledger.md" },
];

export function App() {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const termWidth = stdout?.columns || 120;
  const termHeight = stdout?.rows || 40;

  // Agent roster (loaded once at startup)
  const [agents] = useState<AgentMeta[]>(() => loadAgents(PROJECT_DIR));

  // Event stream
  const [events, setEvents] = useState<EventRow[]>([]);

  // Agent status tracking (Phase 3)
  const { statuses: agentStatuses, processEvent: processAgentEvent, activeCount } = useAgentStatus();
  const { addEvent: addAgentEvent, getEventsForType } = useAgentEvents();
  const { filterAgent, toggleFilter, clearFilter } = useAgentFilter();

  // Intel status
  const { items: intelItems, ledgerCount, refresh: refreshIntel } = useIntelStatus(PROJECT_DIR);

  // Process tracking
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  // UI state
  const [focus, setFocus] = useState<PanelFocus>("agents");
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState<{ agent: AgentMeta } | null>(null);
  const [taskInputValue, setTaskInputValue] = useState("");
  const [showProcessList, setShowProcessList] = useState(false);
  const [processSelectIndex, setProcessSelectIndex] = useState(0);

  // Computed
  const contextFiles = CONTEXT_FILES.map((cf) => ({
    ...cf,
    path: join(PROJECT_DIR, cf.rel),
    exists: fileExists(join(PROJECT_DIR, cf.rel)),
  }));
  const onboarded = isOnboarded(PROJECT_DIR);
  const intelFresh = intelItems.some((i) => i.daysAgo !== null && i.daysAgo <= 7);

  // Panel widths
  const leftWidth = Math.max(22, Math.floor(termWidth * 0.22));
  const rightWidth = Math.max(26, Math.floor(termWidth * 0.28));

  // Handle incoming event (from WebSocket or initial load)
  const handleEvent = useCallback((event: EventRow) => {
    setEvents((prev) => {
      const next = [...prev, event];
      return next.length > 200 ? next.slice(-200) : next;
    });
    processAgentEvent(event);
    addAgentEvent(event);

    if (event.hook_event_name === "SessionStart" && event.session_id) {
      setSessionId(event.session_id);
    }
    // Auto-scroll to bottom on new events
    setScrollOffset(0);
  }, [processAgentEvent, addAgentEvent]);

  // WebSocket connection
  const { connected: wsConnected } = useWebSocket(handleEvent);

  // Load initial events from API
  useEffect(() => {
    fetch(`${API_URL}/events?limit=200`)
      .then((r) => r.json())
      .then((data: EventRow[]) => {
        setEvents(data);
        for (const e of data) {
          processAgentEvent(e);
          addAgentEvent(e);
        }
        // Set session from most recent SessionStart
        const lastStart = [...data].reverse().find((e) => e.hook_event_name === "SessionStart");
        if (lastStart?.session_id) setSessionId(lastStart.session_id);
      })
      .catch(() => {});
  }, []);

  // Open context file in editor
  const openFile = useCallback((path: string) => {
    const editor = process.env.EDITOR || "less";
    spawn(editor, [path], { stdio: "inherit" });
  }, []);

  // Launch an interactive agent (suspends TUI, gives it the terminal)
  const launchInteractive = useCallback((cmd: string, args: string[]) => {
    // Suspend Ink's raw mode so the child process gets the real TTY
    if (process.stdin.isTTY && (process.stdin as any).setRawMode) {
      try { (process.stdin as any).setRawMode(false); } catch {}
    }
    process.stdout.write("\x1B[2J\x1B[H"); // clear screen
    spawnSync(cmd, args, { stdio: "inherit", cwd: PROJECT_DIR });
    // Restore screen for Ink
    process.stdout.write("\x1B[2J\x1B[H");
    if (process.stdin.isTTY && (process.stdin as any).setRawMode) {
      try { (process.stdin as any).setRawMode(true); } catch {}
    }
    // Refresh intel after agent runs (it may have created files)
    refreshIntel();
  }, [refreshIntel]);

  // Launch agent — interactive (gets full terminal)
  const launchAgent = useCallback((agent: AgentMeta, task: string) => {
    const args = ["--agent", agent.filePath, "--prompt", task];
    launchInteractive("claude", args);
  }, [launchInteractive]);

  // Handle command submission
  const handleCommand = useCallback(
    (input: string) => {
      if (input.startsWith("/cmo")) {
        const task = input.slice(4).trim() || "Begin strategic planning session";
        const cmo = agents.find((a) => a.name === "cmo");
        if (cmo) launchAgent(cmo, task);
      } else if (input.startsWith("/analyst")) {
        const task = input.slice(8).trim() || "Begin analysis session";
        const analyst = agents.find((a) => a.name === "analyst");
        if (analyst) launchAgent(analyst, task);
      } else if (input.startsWith("/onboard")) {
        launchInteractive("claude", ["--agent", join(PROJECT_DIR, ".claude/commands/onboard.md")]);
      } else if (input.startsWith("/images")) {
        const subCmd = input.slice(7).trim();
        const args = subCmd === "generate"
          ? ["--limit", "5"]
          : ["--status"];
        launchInteractive("npx", ["tsx", join(PROJECT_DIR, "automation/image-generation/generate-images.ts"), ...args]);
      } else if (input.startsWith("/intel")) {
        launchInteractive("npx", ["tsx", join(PROJECT_DIR, "automation/intel/synthesize.ts")]);
      } else if (input.startsWith("/report")) {
        launchInteractive("claude", ["--agent", join(PROJECT_DIR, ".claude/commands/report.md")]);
      } else if (input.startsWith("/transcript")) {
        launchInteractive("claude", ["--agent", join(PROJECT_DIR, ".claude/commands/transcript.md")]);
      } else {
        // Generic prompt — launch interactive Claude session
        launchInteractive("claude", ["--prompt", input]);
      }
    },
    [agents, launchAgent, launchInteractive]
  );

  // Kill a process by index
  const killProcess = useCallback((idx: number) => {
    const proc = processes[idx];
    if (proc) {
      try {
        process.kill(proc.pid, "SIGTERM");
      } catch {}
      setProcesses((prev) => prev.filter((_, i) => i !== idx));
    }
    setShowProcessList(false);
    setProcessSelectIndex(0);
  }, [processes]);

  // Keyboard input
  useInput((input, key) => {
    // Process list mode
    if (showProcessList) {
      if (key.escape) {
        setShowProcessList(false);
        return;
      }
      if (key.upArrow) {
        setProcessSelectIndex((prev) => Math.max(0, prev - 1));
        return;
      }
      if (key.downArrow) {
        setProcessSelectIndex((prev) => Math.min(processes.length - 1, prev + 1));
        return;
      }
      if (key.return || input === "k") {
        killProcess(processSelectIndex);
        return;
      }
      return;
    }

    // If in task input mode, don't process global keys (except Escape)
    if (taskInput) {
      if (key.escape) {
        setTaskInput(null);
        setTaskInputValue("");
        return;
      }
      if (key.return && taskInputValue.trim()) {
        launchAgent(taskInput.agent, taskInputValue.trim());
        setTaskInput(null);
        setTaskInputValue("");
        return;
      }
      if (key.backspace || key.delete) {
        setTaskInputValue((prev) => prev.slice(0, -1));
        return;
      }
      if (input && !key.ctrl && !key.meta) {
        setTaskInputValue((prev) => prev + input);
        return;
      }
      return;
    }

    // Global shortcuts
    if (input === "q" && focus !== "command") {
      exit();
      return;
    }
    if (input === "?" && focus !== "command") {
      setShowHelp((prev) => !prev);
      return;
    }
    if (key.tab) {
      const order: PanelFocus[] = ["agents", "activity", "context", "command"];
      const idx = order.indexOf(focus);
      setFocus(order[(idx + 1) % order.length]);
      return;
    }
    if (input === "/" && focus !== "command") {
      setFocus("command");
      return;
    }
    if (input === "f" && focus !== "command") {
      const selected = agents[selectedAgentIndex];
      if (selected) toggleFilter(selected.name);
      return;
    }
    if (key.escape) {
      if (focus === "command") {
        setFocus("agents");
      } else if (filterAgent) {
        clearFilter();
      }
      return;
    }

    // Ctrl+K: show process list
    if (input === "k" && key.ctrl) {
      if (processes.length > 0) {
        setShowProcessList(true);
        setProcessSelectIndex(0);
      }
      return;
    }

    // Ctrl+R: refresh intel
    if (input === "r" && key.ctrl) {
      refreshIntel();
      return;
    }

    // Ctrl+L: clear activity stream
    if (input === "l" && key.ctrl) {
      setEvents([]);
      setScrollOffset(0);
      return;
    }

    // Panel-specific input
    if (focus === "agents") {
      if (key.upArrow) {
        setSelectedAgentIndex((prev) => Math.max(0, prev - 1));
        return;
      }
      if (key.downArrow) {
        setSelectedAgentIndex((prev) => Math.min(agents.length - 1, prev + 1));
        return;
      }
      // Hotkey launching — show task prompt
      const agent = agents.find(
        (a) => a.hotkey.toLowerCase() === input.toLowerCase()
      );
      if (agent) {
        setTaskInput({ agent });
        setTaskInputValue("");
        return;
      }
    }

    if (focus === "activity") {
      if (key.upArrow) {
        setScrollOffset((prev) => Math.min(events.length - 1, prev + 1));
        return;
      }
      if (key.downArrow) {
        setScrollOffset((prev) => Math.max(0, prev - 1));
        return;
      }
    }

    if (focus === "context") {
      const idx = parseInt(input) - 1;
      if (idx >= 0 && idx < contextFiles.length) {
        openFile(contextFiles[idx].path);
        return;
      }
    }
  });

  // Help overlay
  if (showHelp) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text bold color={theme.accent}>KEYBOARD SHORTCUTS</Text>
        <Text> </Text>
        <Text bold color={theme.fg}>GLOBAL</Text>
        <Text color={theme.dim}>  q           Quit TUI</Text>
        <Text color={theme.dim}>  ?           Toggle help</Text>
        <Text color={theme.dim}>  Tab         Cycle panel focus</Text>
        <Text color={theme.dim}>  f           Toggle agent filter</Text>
        <Text color={theme.dim}>  /           Focus command bar</Text>
        <Text color={theme.dim}>  Ctrl+K      List/kill active processes</Text>
        <Text color={theme.dim}>  Ctrl+R      Refresh intel status</Text>
        <Text color={theme.dim}>  Ctrl+L      Clear activity stream</Text>
        <Text color={theme.dim}>  Escape      Clear filter / unfocus</Text>
        <Text> </Text>
        <Text bold color={theme.fg}>AGENT PANEL</Text>
        <Text color={theme.dim}>  Up/Down     Select agent</Text>
        <Text color={theme.dim}>  C           Launch CMO</Text>
        <Text color={theme.dim}>  A           Launch Analyst</Text>
        <Text color={theme.dim}>  b-p         Launch specialist</Text>
        <Text> </Text>
        <Text bold color={theme.fg}>ACTIVITY STREAM</Text>
        <Text color={theme.dim}>  Up/Down     Scroll events</Text>
        <Text> </Text>
        <Text bold color={theme.fg}>CONTEXT PANEL</Text>
        <Text color={theme.dim}>  1-9         Open file in $EDITOR</Text>
        <Text> </Text>
        <Text color={theme.dim}>Press ? to close</Text>
      </Box>
    );
  }

  // Terminal too small warning
  if (termWidth < 100 || termHeight < 24) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={theme.warning}>
          Terminal too small ({termWidth}x{termHeight}). Need at least 100x24.
        </Text>
        <Text color={theme.dim}>Resize your terminal and restart.</Text>
      </Box>
    );
  }

  // Process list overlay (Ctrl+K)
  if (showProcessList) {
    return (
      <Box flexDirection="column" height={termHeight}>
        <StatusBar
          isOnboarded={onboarded}
          intelFresh={intelFresh}
          activeAgentCount={activeCount}
          sessionId={sessionId}
          wsConnected={wsConnected}
        />
        <Box flexGrow={1} justifyContent="center" alignItems="center">
          <Box flexDirection="column" borderStyle="round" borderColor={theme.warning} paddingX={2} paddingY={1} width={60}>
            <Text bold color={theme.warning}>
              Active Processes ({processes.length})
            </Text>
            <Text color={theme.dim}>Select and press Enter or K to kill</Text>
            <Box marginTop={1} flexDirection="column">
              {processes.map((p, i) => (
                <Box key={p.pid}>
                  <Text color={i === processSelectIndex ? theme.accent : theme.dim}>
                    {i === processSelectIndex ? "▸ " : "  "}
                  </Text>
                  <Text color={theme.fg}>
                    PID {p.pid} — {p.agentType}
                  </Text>
                  <Text color={theme.dim}>
                    {" "}({Math.floor((Date.now() - p.startedAt.getTime()) / 1000)}s)
                  </Text>
                </Box>
              ))}
              {processes.length === 0 && (
                <Text color={theme.dim}>No active processes</Text>
              )}
            </Box>
            <Box marginTop={1}>
              <Text color={theme.dim}>Escape to close</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Task input overlay
  if (taskInput) {
    return (
      <Box flexDirection="column" height={termHeight}>
        <StatusBar
          isOnboarded={onboarded}
          intelFresh={intelFresh}
          activeAgentCount={activeCount}
          sessionId={sessionId}
          wsConnected={wsConnected}
        />
        <Box flexGrow={1} justifyContent="center" alignItems="center">
          <Box flexDirection="column" borderStyle="round" borderColor={theme.accent} paddingX={2} paddingY={1}>
            <Text bold color={theme.accent}>
              Launch {taskInput.agent.displayName}
            </Text>
            <Text color={theme.dim}>Enter task description:</Text>
            <Box marginTop={1}>
              <Text color={theme.accent}>{">"} </Text>
              <Text>{taskInputValue}</Text>
              <Text color={theme.dim}>█</Text>
            </Box>
            <Box marginTop={1}>
              <Text color={theme.dim}>Enter to launch · Escape to cancel</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height={termHeight}>
      {/* Status Bar */}
      <StatusBar
        isOnboarded={onboarded}
        intelFresh={intelFresh}
        activeAgentCount={activeCount}
        sessionId={sessionId}
        wsConnected={wsConnected}
      />

      {/* Main 3-panel layout */}
      <Box flexGrow={1}>
        <AgentPanel
          agents={agents}
          agentStatuses={agentStatuses}
          selectedIndex={selectedAgentIndex}
          focus={focus}
          width={leftWidth}
        />
        <ActivityStream
          events={events}
          agents={agents}
          agentActiveCount={activeCount}
          filterAgent={filterAgent}
          focus={focus}
          scrollOffset={scrollOffset}
          maxHeight={termHeight - 6}
          isOnboarded={onboarded}
        />
        <ContextPanel
          contextFiles={contextFiles}
          intelItems={intelItems}
          ledgerCount={ledgerCount}
          focus={focus}
          width={rightWidth}
        />
      </Box>

      {/* Command Bar */}
      <CommandBar
        focus={focus}
        onSubmit={handleCommand}
        onFocus={() => setFocus("command")}
        showHelp={showHelp}
      />
    </Box>
  );
}
