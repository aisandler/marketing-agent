#!/usr/bin/env bun
import React from "react";
import { render } from "ink";
import { App } from "./src/App";
import { spawn } from "child_process";
import { join } from "path";

const PROJECT_DIR = join(import.meta.dir, "..");

// Check if event server is already running
async function isServerRunning(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:3457/health");
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  // Start event server if not already running
  const running = await isServerRunning();
  let serverProc: ReturnType<typeof Bun.spawn> | null = null;

  if (!running) {
    console.log("Starting event server...");
    serverProc = Bun.spawn(["bun", "run", join(import.meta.dir, "server.ts")], {
      stdout: "ignore",
      stderr: "ignore",
      stdin: "ignore",
    });

    // Wait for server to be ready
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 200));
      if (await isServerRunning()) break;
    }
  }

  // Clear screen and render TUI
  process.stdout.write("\x1B[2J\x1B[H");

  const { waitUntilExit } = render(<App />, {
    exitOnCtrlC: true,
  });

  await waitUntilExit();

  // Note: we intentionally leave the server running so hooks keep working
  console.log("Command center closed. Event server still running on :3457.");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
