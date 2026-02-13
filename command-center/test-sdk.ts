import { query } from "@anthropic-ai/claude-agent-sdk";
import type { Options } from "@anthropic-ai/claude-agent-sdk";
import { join } from "path";

const PROJECT_DIR = join(import.meta.dir, "..");

console.log("=== SDK Test Suite ===");
console.log("process.execPath:", process.execPath);
console.log("PROJECT_DIR:", PROJECT_DIR);
console.log("");

let passed = 0;
let failed = 0;

// Test 1: Simple string prompt with full executable path
console.log("--- Test 1: String prompt with executable: process.execPath ---");
{
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 15000);
  try {
    const q = query({
      prompt: "Say hello in one sentence. Do not use any tools.",
      options: {
        abortController: ac,
        cwd: PROJECT_DIR,
        executable: process.execPath as "bun",
        permissionMode: "default",
        maxTurns: 1,
      },
    });
    let gotResult = false;
    for await (const msg of q) {
      if ((msg as any).type === "result") gotResult = true;
    }
    if (gotResult) { console.log("PASSED"); passed++; }
    else { console.log("FAILED: no result message"); failed++; }
  } catch (err: any) {
    console.log("FAILED:", err.message); failed++;
  } finally { clearTimeout(timer); }
}

// Test 2: Multi-turn async generator with canUseTool (matches sessions.ts pattern)
console.log("\n--- Test 2: Async generator + canUseTool + settingSources ---");
{
  const ac = new AbortController();
  const timer = setTimeout(() => { ac.abort(); }, 20000);
  async function* gen() {
    yield {
      type: "user" as const,
      message: { role: "user" as const, content: "Say hello in one sentence. Do not use any tools." },
    };
    while (!ac.signal.aborted) {
      await new Promise<void>((r) => {
        ac.signal.addEventListener("abort", () => r(), { once: true });
        setTimeout(r, 500);
      });
    }
  }
  try {
    const q = query({
      prompt: gen(),
      options: {
        abortController: ac,
        cwd: PROJECT_DIR,
        executable: process.execPath as "bun",
        settingSources: ["user", "project"],
        systemPrompt: { type: "preset", preset: "claude_code", append: "You are helpful." },
        tools: { type: "preset", preset: "claude_code" },
        permissionMode: "acceptEdits",
        includePartialMessages: true,
        canUseTool: async (toolName, input) => {
          return { behavior: "allow" as const, updatedInput: input };
        },
      },
    });
    let gotResult = false;
    for await (const msg of q) {
      const m = msg as any;
      if (m.type === "result") {
        gotResult = true;
        ac.abort();
        break;
      }
    }
    if (gotResult) { console.log("PASSED"); passed++; }
    else { console.log("FAILED: no result message"); failed++; }
  } catch (err: any) {
    if (err.name === "AbortError") { console.log("PASSED (aborted after result)"); passed++; }
    else { console.log("FAILED:", err.message); failed++; }
  } finally { clearTimeout(timer); }
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
