import { useState, useCallback } from "react";
import { join } from "path";
import { fileFreshness, countLedgerSessions, fileExists } from "../utils/config";
import { readFileSync } from "fs";

interface IntelItem {
  label: string;
  daysAgo: number | null;
  displayLabel: string;
}

export function useIntelStatus(projectDir: string) {
  const loadIntel = useCallback((): { items: IntelItem[]; ledgerCount: number } => {
    const paths = [
      { label: "Competitive", path: join(projectDir, "docs/intelligence/internal/competitive-intelligence-tracking.md") },
      { label: "Performance", path: join(projectDir, "docs/intelligence/internal/performance-analysis-history.md") },
      { label: "Seasonal", path: join(projectDir, "docs/intelligence/internal/seasonal-patterns.md") },
    ];

    const items = paths.map((item) => {
      const f = fileFreshness(item.path);
      return { label: item.label, daysAgo: f.daysAgo, displayLabel: f.label };
    });

    // Website report
    try {
      const statePath = join(projectDir, ".website-report-state.json");
      if (fileExists(statePath)) {
        const state = JSON.parse(readFileSync(statePath, "utf-8"));
        if (state.lastRunDate) {
          const d = new Date(state.lastRunDate);
          const daysAgo = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
          items.push({ label: "Website", daysAgo, displayLabel: `${daysAgo}d ago` });
        } else {
          items.push({ label: "Website", daysAgo: null, displayLabel: "Never" });
        }
      } else {
        items.push({ label: "Website", daysAgo: null, displayLabel: "Never" });
      }
    } catch {
      items.push({ label: "Website", daysAgo: null, displayLabel: "Never" });
    }

    const ledgerCount = countLedgerSessions(
      join(projectDir, "docs/intelligence/internal/context-intelligence-ledger.md")
    );

    return { items, ledgerCount };
  }, [projectDir]);

  const [data, setData] = useState(() => loadIntel());

  const refresh = useCallback(() => {
    setData(loadIntel());
  }, [loadIntel]);

  return { ...data, refresh };
}
