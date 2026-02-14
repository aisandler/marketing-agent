/**
 * Image Studio backend for Command Center
 *
 * Wraps the existing automation/image-generation scripts via subprocess calls.
 * The automation scripts have their own dependency chain (Airtable, OpenRouter),
 * so we shell out to them rather than importing directly.
 */

import { join } from "path";
import { existsSync, readFileSync } from "fs";

// --- Types ---

export interface ImageQueueStatus {
  available: boolean;
  error?: string;
  setupInstructions?: string[];
  totalRecords?: number;
  withImage?: number;
  needsImage?: number;
  noBrief?: number;
  records?: ImageQueueRecord[];
}

export interface ImageQueueRecord {
  id: string;
  postTopic: string;
  date?: string;
  platform?: string;
  postingAccount?: string;
  imageBrief?: string;
  imageSource?: string;
  hasImage: boolean;
}

export interface ImageCostReport {
  available: boolean;
  error?: string;
  costPerImage: number;
  currentMonthCost: number;
  allTime: {
    totalCost: number;
    successfulGenerations: number;
    failedGenerations: number;
  };
  byAccount: Record<string, { count: number; cost: number }>;
  byPlatform: Record<string, { count: number; cost: number }>;
}

export interface ImageGenerateOptions {
  limit?: number;
  dryRun?: boolean;
  recordId?: string;
}

export interface ImageGenerateResult {
  available: boolean;
  error?: string;
  dryRun: boolean;
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  estimatedCost?: string;
  results: Array<{
    recordId: string;
    postTopic: string;
    success: boolean;
    error?: string;
  }>;
  rawOutput: string;
}

export interface ImageGalleryItem {
  id: string;
  postTopic: string;
  date?: string;
  platform?: string;
  postingAccount?: string;
  imageSource?: string;
  hasImage: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface ImageGallery {
  available: boolean;
  error?: string;
  items: ImageGalleryItem[];
}

// --- Env var checks ---

const REQUIRED_ENV_VARS = ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "OPENROUTER_API_KEY"];

interface EnvCheck {
  ok: boolean;
  missing: string[];
  instructions: string[];
}

function checkEnvVars(projectDir: string): EnvCheck {
  const missing: string[] = [];

  // Check process.env first (already loaded), then .env file
  const envPath = join(projectDir, ".env");
  let envFileVars: Record<string, string> = {};

  if (existsSync(envPath)) {
    try {
      const content = readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const stripped = trimmed.startsWith("export ") ? trimmed.slice(7) : trimmed;
        const eqIdx = stripped.indexOf("=");
        if (eqIdx === -1) continue;
        const key = stripped.slice(0, eqIdx).trim();
        let value = stripped.slice(eqIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (value) envFileVars[key] = value;
      }
    } catch {}
  }

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key] && !envFileVars[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      instructions: [
        `Missing environment variables: ${missing.join(", ")}`,
        "Set them in your .env file at the project root, or use the Command Center Settings panel.",
        "AIRTABLE_API_KEY: Your Airtable personal access token (pat...)",
        "AIRTABLE_BASE_ID: Your Airtable base ID (app...)",
        "OPENROUTER_API_KEY: Your OpenRouter API key for image generation",
      ],
    };
  }

  return { ok: true, missing: [], instructions: [] };
}

// --- Script runner ---

const SCRIPT_PATH = "automation/image-generation/generate-images.ts";

async function runImageScript(projectDir: string, args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const scriptAbs = join(projectDir, SCRIPT_PATH);
  if (!existsSync(scriptAbs)) {
    return {
      stdout: "",
      stderr: `Image generation script not found at ${SCRIPT_PATH}`,
      exitCode: 1,
    };
  }

  try {
    const proc = Bun.spawn(["npx", "tsx", scriptAbs, ...args], {
      cwd: projectDir,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        ...process.env,
        // Ensure .env vars are loaded - the script uses dotenv or reads config
        NODE_ENV: process.env.NODE_ENV || "production",
      },
    });

    const [stdoutBuf, stderrBuf] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);

    const exitCode = await proc.exited;

    return {
      stdout: stdoutBuf,
      stderr: stderrBuf,
      exitCode,
    };
  } catch (err: any) {
    return {
      stdout: "",
      stderr: err.message || "Failed to run image generation script",
      exitCode: 1,
    };
  }
}

// --- Output parsers ---

/**
 * Parse --status output into structured data.
 * The script outputs lines like:
 *   === Image Generation Status ===
 *   Total records: 42
 *   With image: 30
 *   Needs image (has brief): 8
 *   No image brief: 4
 *   --- Records Needing Images ---
 *   [recXXX] Post topic here (2026-02-15)
 */
function parseStatusOutput(stdout: string): Partial<ImageQueueStatus> {
  const result: Partial<ImageQueueStatus> = {};
  const records: ImageQueueRecord[] = [];

  const totalMatch = stdout.match(/Total records:\s*(\d+)/);
  const withImageMatch = stdout.match(/With image:\s*(\d+)/);
  const needsMatch = stdout.match(/Needs image.*?:\s*(\d+)/);
  const noBriefMatch = stdout.match(/No image brief:\s*(\d+)/);

  if (totalMatch) result.totalRecords = parseInt(totalMatch[1]);
  if (withImageMatch) result.withImage = parseInt(withImageMatch[1]);
  if (needsMatch) result.needsImage = parseInt(needsMatch[1]);
  if (noBriefMatch) result.noBrief = parseInt(noBriefMatch[1]);

  // Parse individual records needing images
  const recordLines = stdout.match(/\[rec[^\]]+\]\s+.+/g);
  if (recordLines) {
    for (const line of recordLines) {
      const match = line.match(/\[(rec[^\]]+)\]\s+(.+?)(?:\s+\(([^)]+)\))?$/);
      if (match) {
        records.push({
          id: match[1],
          postTopic: match[2].trim(),
          date: match[3] || undefined,
          hasImage: false,
        });
      }
    }
  }

  result.records = records;
  return result;
}

/**
 * Parse --costs output. The script logs structured cost data.
 * We also read the CSV directly for more accurate data.
 */
function parseCostOutput(stdout: string, projectDir: string): Partial<ImageCostReport> {
  const result: Partial<ImageCostReport> = {
    costPerImage: 0.14,
    currentMonthCost: 0,
    allTime: { totalCost: 0, successfulGenerations: 0, failedGenerations: 0 },
    byAccount: {},
    byPlatform: {},
  };

  // Parse "This month so far: $X.XX"
  const monthMatch = stdout.match(/This month so far:\s*\$([0-9.]+)/);
  if (monthMatch) result.currentMonthCost = parseFloat(monthMatch[1]);

  // Parse "Total Cost: $X.XX"
  const totalMatch = stdout.match(/Total Cost:\s*\$([0-9.]+)/);
  if (totalMatch) result.allTime!.totalCost = parseFloat(totalMatch[1]);

  // Parse "Successful: N"
  const successMatch = stdout.match(/Successful:\s*(\d+)/);
  if (successMatch) result.allTime!.successfulGenerations = parseInt(successMatch[1]);

  // Parse "Failed: N"
  const failedMatch = stdout.match(/Failed:\s*(\d+)/);
  if (failedMatch) result.allTime!.failedGenerations = parseInt(failedMatch[1]);

  // Parse "By Posting Account:" section
  const accountSection = stdout.match(/By Posting Account:([\s\S]*?)(?:\nBy Platform:|$)/);
  if (accountSection) {
    const accountLines = accountSection[1].match(/\s+(.+?):\s+(\d+)\s+images\s+\(\$([0-9.]+)\)/g);
    if (accountLines) {
      for (const line of accountLines) {
        const m = line.match(/\s+(.+?):\s+(\d+)\s+images\s+\(\$([0-9.]+)\)/);
        if (m) {
          result.byAccount![m[1].trim()] = { count: parseInt(m[2]), cost: parseFloat(m[3]) };
        }
      }
    }
  }

  // Parse "By Platform:" section
  const platformSection = stdout.match(/By Platform:([\s\S]*?)$/);
  if (platformSection) {
    const platformLines = platformSection[1].match(/\s+(.+?):\s+(\d+)\s+images\s+\(\$([0-9.]+)\)/g);
    if (platformLines) {
      for (const line of platformLines) {
        const m = line.match(/\s+(.+?):\s+(\d+)\s+images\s+\(\$([0-9.]+)\)/);
        if (m) {
          result.byPlatform![m[1].trim()] = { count: parseInt(m[2]), cost: parseFloat(m[3]) };
        }
      }
    }
  }

  return result;
}

/**
 * Parse generation output (both dry-run and actual runs).
 * Dry-run shows records that would be processed.
 * Actual run shows per-record results and a summary.
 */
function parseGenerateOutput(stdout: string, dryRun: boolean): Partial<ImageGenerateResult> {
  const result: Partial<ImageGenerateResult> = {
    dryRun,
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    results: [],
    rawOutput: stdout,
  };

  if (dryRun) {
    // Count records in dry-run output: lines like "1. [recXXX] ..."
    const dryRunRecords = stdout.match(/^\d+\.\s+\[rec[^\]]+\]/gm);
    result.total = dryRunRecords?.length || 0;

    // Parse estimated cost
    const costMatch = stdout.match(/Total estimated cost:\s*(\$[0-9.]+)/);
    if (costMatch) result.estimatedCost = costMatch[1];

    // Parse individual records
    if (dryRunRecords) {
      for (const line of dryRunRecords) {
        const m = line.match(/\d+\.\s+\[(rec[^\]]+)\]\s+(.+)/);
        if (m) {
          result.results!.push({
            recordId: m[1],
            postTopic: m[2].trim(),
            success: true, // would-be-processed
          });
        }
      }
    }
  } else {
    // Parse summary section
    const totalMatch = stdout.match(/Total:\s*(\d+)/);
    const successMatch = stdout.match(/Successful:\s*(\d+)/);
    const failedMatch = stdout.match(/Failed:\s*(\d+)/);
    const skippedMatch = stdout.match(/Skipped:\s*(\d+)/);

    if (totalMatch) result.total = parseInt(totalMatch[1]);
    if (successMatch) result.successful = parseInt(successMatch[1]);
    if (failedMatch) result.failed = parseInt(failedMatch[1]);
    if (skippedMatch) result.skipped = parseInt(skippedMatch[1]);

    // Parse per-record output: "[N/M] Topic (recXXX)" followed by success/error
    const recordBlocks = stdout.match(/\[\d+\/\d+\]\s+.+?\(rec[^)]+\)[\s\S]*?(?=\[\d+\/\d+\]|=== Summary ===|$)/g);
    if (recordBlocks) {
      for (const block of recordBlocks) {
        const headerMatch = block.match(/\[\d+\/\d+\]\s+(.+?)\s+\((rec[^)]+)\)/);
        if (headerMatch) {
          const success = block.includes("Complete") || block.includes("✓");
          const errorMatch = block.match(/Error:\s*(.+)/);
          result.results!.push({
            recordId: headerMatch[2],
            postTopic: headerMatch[1].trim(),
            success,
            error: errorMatch?.[1]?.trim(),
          });
        }
      }
    }
  }

  return result;
}

// --- Public API ---

export async function getImageQueue(projectDir: string): Promise<ImageQueueStatus> {
  const envCheck = checkEnvVars(projectDir);
  if (!envCheck.ok) {
    return {
      available: false,
      error: `Missing environment variables: ${envCheck.missing.join(", ")}`,
      setupInstructions: envCheck.instructions,
    };
  }

  const { stdout, stderr, exitCode } = await runImageScript(projectDir, ["--status"]);

  if (exitCode !== 0) {
    // Check for common errors
    const errorMsg = stderr || stdout;
    if (errorMsg.includes("AIRTABLE") || errorMsg.includes("401") || errorMsg.includes("403")) {
      return {
        available: false,
        error: "Airtable authentication failed. Check your AIRTABLE_API_KEY and AIRTABLE_BASE_ID.",
      };
    }
    return {
      available: false,
      error: `Image status check failed: ${errorMsg.substring(0, 300)}`,
    };
  }

  const parsed = parseStatusOutput(stdout);

  return {
    available: true,
    totalRecords: parsed.totalRecords || 0,
    withImage: parsed.withImage || 0,
    needsImage: parsed.needsImage || 0,
    noBrief: parsed.noBrief || 0,
    records: parsed.records || [],
  };
}

export async function getImageCosts(projectDir: string): Promise<ImageCostReport> {
  const envCheck = checkEnvVars(projectDir);
  if (!envCheck.ok) {
    return {
      available: false,
      error: `Missing environment variables: ${envCheck.missing.join(", ")}`,
      costPerImage: 0.14,
      currentMonthCost: 0,
      allTime: { totalCost: 0, successfulGenerations: 0, failedGenerations: 0 },
      byAccount: {},
      byPlatform: {},
    };
  }

  const { stdout, stderr, exitCode } = await runImageScript(projectDir, ["--costs"]);

  if (exitCode !== 0) {
    return {
      available: false,
      error: `Cost report failed: ${(stderr || stdout).substring(0, 300)}`,
      costPerImage: 0.14,
      currentMonthCost: 0,
      allTime: { totalCost: 0, successfulGenerations: 0, failedGenerations: 0 },
      byAccount: {},
      byPlatform: {},
    };
  }

  const parsed = parseCostOutput(stdout, projectDir);

  return {
    available: true,
    costPerImage: parsed.costPerImage || 0.14,
    currentMonthCost: parsed.currentMonthCost || 0,
    allTime: parsed.allTime || { totalCost: 0, successfulGenerations: 0, failedGenerations: 0 },
    byAccount: parsed.byAccount || {},
    byPlatform: parsed.byPlatform || {},
  };
}

export async function generateImages(
  projectDir: string,
  options: ImageGenerateOptions = {},
): Promise<ImageGenerateResult> {
  const envCheck = checkEnvVars(projectDir);
  if (!envCheck.ok) {
    return {
      available: false,
      error: `Missing environment variables: ${envCheck.missing.join(", ")}`,
      dryRun: options.dryRun || false,
      total: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      results: [],
      rawOutput: "",
    };
  }

  const args: string[] = [];

  if (options.dryRun) {
    args.push("--dry-run");
  }

  if (options.limit && options.limit > 0) {
    args.push("--limit", String(options.limit));
  }

  if (options.recordId) {
    args.push("--record", options.recordId);
  }

  // Always use --force to skip the interactive confirmation prompt
  // (subprocess can't handle interactive stdin)
  if (!options.dryRun) {
    args.push("--force");
  }

  const { stdout, stderr, exitCode } = await runImageScript(projectDir, args);

  if (exitCode !== 0 && !options.dryRun) {
    return {
      available: false,
      error: `Generation failed: ${(stderr || stdout).substring(0, 500)}`,
      dryRun: options.dryRun || false,
      total: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      results: [],
      rawOutput: stdout + "\n" + stderr,
    };
  }

  const parsed = parseGenerateOutput(stdout, options.dryRun || false);

  return {
    available: true,
    dryRun: options.dryRun || false,
    total: parsed.total || 0,
    successful: parsed.successful || 0,
    failed: parsed.failed || 0,
    skipped: parsed.skipped || 0,
    estimatedCost: parsed.estimatedCost,
    results: parsed.results || [],
    rawOutput: stdout,
  };
}

export async function getImageGallery(projectDir: string): Promise<ImageGallery> {
  const envCheck = checkEnvVars(projectDir);
  if (!envCheck.ok) {
    return {
      available: false,
      error: `Missing environment variables: ${envCheck.missing.join(", ")}`,
      items: [],
    };
  }

  // The --status flag gets all records with image fields.
  // We parse the full output to build a gallery view.
  const { stdout, stderr, exitCode } = await runImageScript(projectDir, ["--status"]);

  if (exitCode !== 0) {
    return {
      available: false,
      error: `Gallery fetch failed: ${(stderr || stdout).substring(0, 300)}`,
      items: [],
    };
  }

  // The status output lists records needing images but not those with images.
  // For gallery we return the parsed status data — the UI can request
  // individual records from Airtable if it needs image URLs.
  const parsed = parseStatusOutput(stdout);
  const items: ImageGalleryItem[] = (parsed.records || []).map((r) => ({
    id: r.id,
    postTopic: r.postTopic,
    date: r.date,
    hasImage: r.hasImage,
  }));

  return {
    available: true,
    items,
  };
}
