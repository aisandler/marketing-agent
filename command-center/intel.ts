import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { join } from "path";
import type { ContextHealthItem, ContextAction } from "./protocol";

interface IntelItem {
  label: string;
  daysAgo: number | null;
  displayLabel: string;
  status: "fresh" | "stale" | "old" | "never";
}

interface ContextFile {
  key: string;
  label: string;
  path: string;
  exists: boolean;
}

function fileFreshness(path: string): { daysAgo: number | null; label: string } {
  if (!existsSync(path)) return { daysAgo: null, label: "Never" };
  try {
    const content = readFileSync(path, "utf-8");
    const match = content.match(/\*\*Last Updated:\*\*\s*(\d{4}-\d{2}-\d{2})/);
    if (match) {
      const updated = new Date(match[1]);
      const daysAgo = Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24));
      return { daysAgo, label: `${daysAgo}d ago` };
    }
    const stat = statSync(path);
    const daysAgo = Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24));
    return { daysAgo, label: `${daysAgo}d ago` };
  } catch {
    return { daysAgo: null, label: "Unknown" };
  }
}

function freshStatus(daysAgo: number | null): "fresh" | "stale" | "old" | "never" {
  if (daysAgo === null) return "never";
  if (daysAgo <= 7) return "fresh";
  if (daysAgo <= 30) return "stale";
  return "old";
}

export function getIntelStatus(projectDir: string): { items: IntelItem[]; ledgerCount: number } {
  const paths = [
    { label: "Competitive", path: join(projectDir, "docs/intelligence/internal/competitive-intelligence-tracking.md") },
    { label: "Performance", path: join(projectDir, "docs/intelligence/internal/performance-analysis-history.md") },
    { label: "Seasonal", path: join(projectDir, "docs/intelligence/internal/seasonal-patterns.md") },
  ];

  const items: IntelItem[] = paths.map((item) => {
    const f = fileFreshness(item.path);
    return { label: item.label, daysAgo: f.daysAgo, displayLabel: f.label, status: freshStatus(f.daysAgo) };
  });

  // Website report
  try {
    const statePath = join(projectDir, ".website-report-state.json");
    if (existsSync(statePath)) {
      const state = JSON.parse(readFileSync(statePath, "utf-8"));
      if (state.lastRunDate) {
        const d = new Date(state.lastRunDate);
        const daysAgo = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
        items.push({ label: "Website", daysAgo, displayLabel: `${daysAgo}d ago`, status: freshStatus(daysAgo) });
      } else {
        items.push({ label: "Website", daysAgo: null, displayLabel: "Never", status: "never" });
      }
    } else {
      items.push({ label: "Website", daysAgo: null, displayLabel: "Never", status: "never" });
    }
  } catch {
    items.push({ label: "Website", daysAgo: null, displayLabel: "Never", status: "never" });
  }

  // Ledger count
  let ledgerCount = 0;
  try {
    const ledgerPath = join(projectDir, "docs/intelligence/internal/context-intelligence-ledger.md");
    if (existsSync(ledgerPath)) {
      const content = readFileSync(ledgerPath, "utf-8");
      ledgerCount = (content.match(/### Session:/g) || []).length;
    }
  } catch {}

  return { items, ledgerCount };
}

export function getContextFiles(projectDir: string): ContextFile[] {
  const entries = [
    { key: "1", label: "brand.json", rel: "config/brand.json" },
    { key: "2", label: "voice-and-tone-guide.md", rel: "client-context/brand/voice-and-tone-guide.md" },
    { key: "3", label: "content-bank.md", rel: "content/social/content-bank.md" },
    { key: "4", label: "differentiation-strategy.md", rel: "client-context/competitors/differentiation-strategy.md" },
    { key: "5", label: "partners.json", rel: "config/partners.json" },
    { key: "6", label: "airtable.json", rel: "config/airtable.json" },
    { key: "7", label: "business/", rel: "client-context/business" },
    { key: "8", label: "keywords/", rel: "client-context/keywords" },
    { key: "9", label: "session-ledger.md", rel: "docs/intelligence/internal/context-intelligence-ledger.md" },
  ];
  return entries.map((e) => ({
    key: e.key,
    label: e.label,
    path: e.rel,
    exists: existsSync(join(projectDir, e.rel)),
  }));
}

export function isOnboarded(projectDir: string): boolean {
  const brandDir = join(projectDir, "client-context", "brand");
  return existsSync(brandDir) && readdirSync(brandDir).length > 0;
}

// --- Context Health ---

interface HealthEntry {
  key: string;
  label: string;
  category: "config" | "intel" | "content";
  rel: string;
  points: number;
  fixAction?: string;
}

const HEALTH_ENTRIES: HealthEntry[] = [
  // Config files — 10 pts each (50 total)
  { key: "brand_json", label: "Brand Config", category: "config", rel: "config/brand.json", points: 10, fixAction: "Run /onboard to configure brand" },
  { key: "partners_json", label: "Partners Config", category: "config", rel: "config/partners.json", points: 10, fixAction: "Run /onboard to configure partners" },
  { key: "airtable_json", label: "Airtable Config", category: "config", rel: "config/airtable.json", points: 10, fixAction: "Run /onboard to configure Airtable" },
  { key: "voice_guide", label: "Voice & Tone Guide", category: "config", rel: "client-context/brand/voice-and-tone-guide.md", points: 10, fixAction: "Run /onboard to generate voice guide" },
  { key: "differentiation", label: "Differentiation Strategy", category: "config", rel: "client-context/competitors/differentiation-strategy.md", points: 10, fixAction: "Run /onboard to generate competitive strategy" },

  // Intel files — 8 pts each (32 total)
  { key: "competitive_intel", label: "Competitive Intelligence", category: "intel", rel: "docs/intelligence/internal/competitive-intelligence-tracking.md", points: 8, fixAction: "Run /intel to collect competitive intelligence" },
  { key: "performance_intel", label: "Performance Analysis", category: "intel", rel: "docs/intelligence/internal/performance-analysis-history.md", points: 8, fixAction: "Run /analyst to analyze performance" },
  { key: "seasonal_intel", label: "Seasonal Patterns", category: "intel", rel: "docs/intelligence/internal/seasonal-patterns.md", points: 8, fixAction: "Run /analyst to identify seasonal patterns" },
  { key: "website_intel", label: "Website Report", category: "intel", rel: ".website-report-state.json", points: 8, fixAction: "Run /report to generate website report" },

  // Content files — 6 pts each (18 total)
  { key: "content_bank", label: "Content Bank", category: "content", rel: "content/social/content-bank.md", points: 6, fixAction: "Create initial content bank with /cmo" },
  { key: "business_dir", label: "Business Profile", category: "content", rel: "client-context/business", points: 6, fixAction: "Run /onboard to set up business profile" },
  { key: "keywords_dir", label: "Keywords Research", category: "content", rel: "client-context/keywords", points: 6, fixAction: "Run /analyst to conduct keyword research" },
];

function healthStatus(entry: HealthEntry, projectDir: string): { status: "ok" | "missing" | "stale" | "old"; daysAgo?: number } {
  const fullPath = join(projectDir, entry.rel);

  // For the website report, check the state file's lastRunDate
  if (entry.key === "website_intel") {
    try {
      if (!existsSync(fullPath)) return { status: "missing" };
      const state = JSON.parse(readFileSync(fullPath, "utf-8"));
      if (!state.lastRunDate) return { status: "missing" };
      const d = new Date(state.lastRunDate);
      const daysAgo = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo <= 7) return { status: "ok", daysAgo };
      if (daysAgo <= 30) return { status: "stale", daysAgo };
      return { status: "old", daysAgo };
    } catch {
      return { status: "missing" };
    }
  }

  // For directories, check existence and non-emptiness
  if (entry.rel.endsWith("/") || entry.key === "business_dir" || entry.key === "keywords_dir") {
    try {
      if (!existsSync(fullPath)) return { status: "missing" };
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        const files = readdirSync(fullPath);
        return files.length > 0 ? { status: "ok" } : { status: "missing" };
      }
      return { status: "ok" };
    } catch {
      return { status: "missing" };
    }
  }

  // For regular files, check existence and freshness
  if (!existsSync(fullPath)) return { status: "missing" };

  // Config files don't go stale — they're either present or missing
  if (entry.category === "config") return { status: "ok" };

  // Intel and content files can go stale
  const f = fileFreshness(fullPath);
  if (f.daysAgo === null) return { status: "missing" };
  if (f.daysAgo <= 7) return { status: "ok", daysAgo: f.daysAgo };
  if (f.daysAgo <= 30) return { status: "stale", daysAgo: f.daysAgo };
  return { status: "old", daysAgo: f.daysAgo };
}

export function getContextHealth(projectDir: string): { score: number; items: ContextHealthItem[]; actions: ContextAction[] } {
  const items: ContextHealthItem[] = [];
  let earnedPoints = 0;
  const maxPoints = 100; // 50 config + 32 intel + 18 content

  // Also check paid media profile (bonus context, doesn't affect score)
  const paidMediaPath = "client-context/business/paid-media-profile.md";
  const paidMediaExists = existsSync(join(projectDir, paidMediaPath));

  for (const entry of HEALTH_ENTRIES) {
    const h = healthStatus(entry, projectDir);

    // Score calculation
    if (h.status === "ok") {
      earnedPoints += entry.points;
    } else if (h.status === "stale") {
      earnedPoints += entry.points * 0.5;
    }
    // missing and old = 0 points

    items.push({
      key: entry.key,
      label: entry.label,
      category: entry.category,
      status: h.status,
      path: entry.rel,
      daysAgo: h.daysAgo,
      fixAction: h.status !== "ok" ? entry.fixAction : undefined,
    });
  }

  // Add paid media profile as informational item (no score impact)
  items.push({
    key: "paid_media_profile",
    label: "Paid Media Profile",
    category: "config",
    status: paidMediaExists ? "ok" : "missing",
    path: paidMediaPath,
    fixAction: paidMediaExists ? undefined : "Run /onboard to configure paid media profile",
  });

  // Generate actions from items that need attention
  const actions: ContextAction[] = [];
  const missingConfig = items.filter((i) => i.category === "config" && i.status === "missing");
  const staleIntel = items.filter((i) => i.category === "intel" && (i.status === "stale" || i.status === "old" || i.status === "missing"));
  const missingContent = items.filter((i) => i.category === "content" && i.status === "missing");

  if (missingConfig.length > 0) {
    actions.push({
      label: "Configure Brand",
      description: `${missingConfig.length} brand configuration file${missingConfig.length > 1 ? "s" : ""} missing`,
      agentName: "cmo",
      prompt: "Run /onboard to configure brand architecture",
    });
  }

  if (staleIntel.length > 0) {
    const staleCount = items.filter((i) => i.category === "intel" && i.status === "stale").length;
    const oldCount = items.filter((i) => i.category === "intel" && i.status === "old").length;
    const missingIntelCount = items.filter((i) => i.category === "intel" && i.status === "missing").length;
    const parts: string[] = [];
    if (missingIntelCount > 0) parts.push(`${missingIntelCount} missing`);
    if (staleCount > 0) parts.push(`${staleCount} stale`);
    if (oldCount > 0) parts.push(`${oldCount} outdated`);
    actions.push({
      label: "Refresh Intelligence",
      description: `Intelligence data needs attention: ${parts.join(", ")}`,
      agentName: "analyst",
      prompt: "Run /intel to refresh social media intelligence and /report for website analysis",
    });
  }

  if (missingContent.length > 0) {
    actions.push({
      label: "Build Content Foundation",
      description: `${missingContent.length} content resource${missingContent.length > 1 ? "s" : ""} missing`,
      agentName: "cmo",
      prompt: "Create initial content bank and keyword research foundation",
    });
  }

  const score = Math.min(100, Math.round((earnedPoints / maxPoints) * 100));

  return { score, items, actions };
}

// --- Ledger Insights (for Mission Control) ---

export function getLedgerInsights(projectDir: string): {
  agentRecency: { agent: string; daysAgo: number | null }[];
  recommendations: { text: string; date: string; agent: string }[];
} {
  const ledgerPath = join(projectDir, "docs/intelligence/internal/context-intelligence-ledger.md");
  const trackedAgents = ["CMO", "Analyst", "Intel", "Report"];
  const lastSeen: Record<string, Date | null> = {};
  for (const a of trackedAgents) lastSeen[a] = null;
  const recommendations: { text: string; date: string; agent: string }[] = [];

  if (!existsSync(ledgerPath)) {
    return {
      agentRecency: trackedAgents.map((a) => ({ agent: a, daysAgo: null })),
      recommendations,
    };
  }

  try {
    const content = readFileSync(ledgerPath, "utf-8");
    const sessions = content.split(/^### Session:/m).slice(1);

    for (const session of sessions) {
      const dateMatch = session.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : null;
      if (!date) continue;
      const sessionDate = new Date(date);

      const lower = session.toLowerCase();
      let agent = "CMO";
      if (lower.includes("analyst") || lower.includes("/analyst")) agent = "Analyst";
      else if (lower.includes("/intel") || lower.includes("intelligence collection")) agent = "Intel";
      else if (lower.includes("/report") || lower.includes("website report")) agent = "Report";
      else if (lower.includes("/cmo") || lower.includes("cmo")) agent = "CMO";

      if (trackedAgents.includes(agent)) {
        if (!lastSeen[agent] || sessionDate > lastSeen[agent]!) {
          lastSeen[agent] = sessionDate;
        }
      }

      const lines = session.split("\n");
      for (const line of lines) {
        const recMatch = line.match(/(?:Recommendation|Next step|Action item|TODO):\s*(.+)/i);
        if (recMatch) {
          recommendations.push({ text: recMatch[1].trim(), date, agent });
        }
      }
    }
  } catch {
    // Failed to parse — return empty
  }

  return {
    agentRecency: trackedAgents.map((a) => ({
      agent: a,
      daysAgo: lastSeen[a] ? Math.floor((Date.now() - lastSeen[a]!.getTime()) / (1000 * 60 * 60 * 24)) : null,
    })),
    recommendations: recommendations.slice(-10).reverse(),
  };
}

// --- Feedback Loop Data (for Learned tab) ---

interface FeedbackEntry {
  text: string;
  date: string;
  source: string;
  type: "pattern" | "insight" | "competitive" | "seasonal";
}

export function getFeedbackLoop(projectDir: string): {
  patterns: FeedbackEntry[];
  hasData: boolean;
  sources: { name: string; updated: string; entryCount: number }[];
} {
  const patterns: FeedbackEntry[] = [];
  const sources: { name: string; updated: string; entryCount: number }[] = [];

  const files = [
    { name: "Performance", path: join(projectDir, "docs/intelligence/internal/performance-analysis-history.md"), type: "pattern" as const },
    { name: "Seasonal", path: join(projectDir, "docs/intelligence/internal/seasonal-patterns.md"), type: "seasonal" as const },
    { name: "Competitive", path: join(projectDir, "docs/intelligence/internal/competitive-intelligence-tracking.md"), type: "competitive" as const },
  ];

  for (const file of files) {
    if (!existsSync(file.path)) {
      sources.push({ name: file.name, updated: "Never", entryCount: 0 });
      continue;
    }

    try {
      const content = readFileSync(file.path, "utf-8");

      // Get last updated date
      const updMatch = content.match(/\*\*Last Updated:\*\*\s*([\w\d\s-]+)/);
      const updated = updMatch ? updMatch[1].trim() : "Never";

      // Split on entry markers (### or --- followed by content)
      const afterMarker = content.split("<!-- APPEND NEW ENTRIES BELOW THIS LINE -->")[1] || "";
      const entries = afterMarker.split(/^###\s+/m).filter(e => e.trim().length > 20);

      sources.push({ name: file.name, updated, entryCount: entries.length });

      for (const entry of entries.slice(-15)) {
        // Extract date from entry
        const dateMatch = entry.match(/(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? dateMatch[1] : "";

        // Extract meaningful lines (skip headers, blank lines, metadata)
        const lines = entry.split("\n")
          .map(l => l.trim())
          .filter(l => l.length > 15 && !l.startsWith("#") && !l.startsWith("**Last") && !l.startsWith("---") && !l.startsWith("<!--"));

        for (const line of lines.slice(0, 3)) {
          // Clean markdown formatting
          const clean = line.replace(/^\s*[-*]\s*/, "").replace(/\*\*/g, "").trim();
          if (clean.length > 15) {
            patterns.push({ text: clean, date, source: file.name, type: file.type });
          }
        }
      }
    } catch {
      sources.push({ name: file.name, updated: "Error", entryCount: 0 });
    }
  }

  // Sort patterns by date descending
  patterns.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return {
    patterns: patterns.slice(0, 20),
    hasData: patterns.length > 0,
    sources,
  };
}
