import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export interface AgentMeta {
  name: string;
  displayName: string;
  shortTag: string;
  color: string;
  description: string;
  filePath: string;
  hotkey: string;
  isOrchestrator: boolean;
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (key && val && !key.startsWith(" ") && !key.startsWith("-")) {
        result[key] = val;
      }
    }
  }
  return result;
}

function makeShortTag(name: string): string {
  const first = name.split("-")[0];
  if (first.length <= 3) return first.toUpperCase();
  return first.charAt(0).toUpperCase() + first.slice(1, 7);
}

function makeDisplayName(name: string): string {
  return name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function loadAgents(projectDir: string): AgentMeta[] {
  const agentsDir = join(projectDir, ".claude", "agents");
  const files = readdirSync(agentsDir).filter((f) => f.endsWith(".md"));

  const specialists: AgentMeta[] = [];
  let hotkeyChar = "b".charCodeAt(0);

  for (const file of files.sort()) {
    const filePath = join(agentsDir, file);
    const content = readFileSync(filePath, "utf-8");
    const fm = parseFrontmatter(content);
    const name = fm.name || file.replace(".md", "");

    specialists.push({
      name,
      displayName: makeDisplayName(name),
      shortTag: makeShortTag(name),
      color: fm.color || "",
      description: fm.description || "",
      filePath,
      hotkey: String.fromCharCode(hotkeyChar),
      isOrchestrator: false,
    });
    hotkeyChar++;
  }

  const orchestrators: AgentMeta[] = [
    {
      name: "cmo",
      displayName: "CMO",
      shortTag: "CMO",
      color: "purple",
      description: "Strategic marketing co-pilot",
      filePath: join(projectDir, ".claude", "commands", "cmo.md"),
      hotkey: "C",
      isOrchestrator: true,
    },
    {
      name: "analyst",
      displayName: "Analyst",
      shortTag: "Anlyst",
      color: "cyan",
      description: "Marketing intelligence & optimization",
      filePath: join(projectDir, ".claude", "commands", "analyst.md"),
      hotkey: "A",
      isOrchestrator: true,
    },
  ];

  return [...orchestrators, ...specialists];
}
