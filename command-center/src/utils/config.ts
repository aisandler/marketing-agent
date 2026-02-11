import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { join } from "path";

export function getProjectDir(): string {
  // Walk up from command-center/src/utils/ to project root
  // import.meta.dir = .../command-center/src/utils
  return join(import.meta.dir, "..", "..", "..");
}

export function readJsonSafe(path: string): Record<string, unknown> | null {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function fileFreshness(path: string): { exists: boolean; daysAgo: number | null; label: string } {
  if (!existsSync(path)) {
    return { exists: false, daysAgo: null, label: "Never" };
  }
  try {
    const content = readFileSync(path, "utf-8");
    // Parse **Last Updated:** YYYY-MM-DD pattern
    const match = content.match(/\*\*Last Updated:\*\*\s*(\d{4}-\d{2}-\d{2})/);
    if (match) {
      const updated = new Date(match[1]);
      const now = new Date();
      const daysAgo = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
      return { exists: true, daysAgo, label: `${daysAgo}d ago` };
    }
    // Fallback: use file mtime
    const stat = statSync(path);
    const daysAgo = Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24));
    return { exists: true, daysAgo, label: `${daysAgo}d ago` };
  } catch {
    return { exists: true, daysAgo: null, label: "Unknown" };
  }
}

export function countLedgerSessions(path: string): number {
  try {
    if (!existsSync(path)) return 0;
    const content = readFileSync(path, "utf-8");
    return (content.match(/### Session:/g) || []).length;
  } catch {
    return 0;
  }
}

export function isOnboarded(projectDir: string): boolean {
  const brandDir = join(projectDir, "client-context", "brand");
  return existsSync(brandDir) && readdirSync(brandDir).length > 0;
}

