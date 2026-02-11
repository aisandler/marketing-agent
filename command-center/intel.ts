import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { join } from "path";

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
