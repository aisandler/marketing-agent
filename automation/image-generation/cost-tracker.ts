/**
 * Cost Tracking for Image Generation
 *
 * Logs all generations to a CSV file for cost monitoring
 * File: automation/image-generation/generation-log.csv
 */

import { existsSync, appendFileSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { GENERATION_RULES, formatCost } from './rules'

const LOG_FILE = join(__dirname, 'generation-log.csv')

export interface GenerationLogEntry {
  timestamp: string
  recordId: string
  postTopic: string
  postingAccount: string
  platform: string
  costUsd: number
  success: boolean
  error?: string
  feedbackApplied?: string[] // Themes from live feedback that were applied
}

/**
 * Initialize log file with headers if it doesn't exist
 */
function ensureLogFile(): void {
  if (!existsSync(LOG_FILE)) {
    const headers = 'timestamp,record_id,post_topic,posting_account,platform,cost_usd,success,error,feedback_applied\n'
    writeFileSync(LOG_FILE, headers)
  }
}

/**
 * Log a generation attempt
 */
export function logGeneration(entry: GenerationLogEntry): void {
  ensureLogFile()

  const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) + '...[truncated]' : str

  // Format feedback themes as pipe-separated list
  const feedbackStr = entry.feedbackApplied?.length
    ? entry.feedbackApplied.join('|')
    : ''

  const row = [
    entry.timestamp,
    entry.recordId,
    escapeCsv(truncate(entry.postTopic, 200)),
    escapeCsv(entry.postingAccount),
    entry.platform,
    entry.costUsd.toFixed(2),
    entry.success ? 'true' : 'false',
    escapeCsv(truncate(entry.error || '', 500)),
    escapeCsv(feedbackStr),
  ].join(',') + '\n'

  appendFileSync(LOG_FILE, row)
}

/**
 * Get cost summary for a date range
 */
export function getCostSummary(options?: {
  startDate?: string  // YYYY-MM-DD
  endDate?: string    // YYYY-MM-DD
}): {
  totalCost: number
  successfulGenerations: number
  failedGenerations: number
  byAccount: Record<string, { count: number; cost: number }>
  byPlatform: Record<string, { count: number; cost: number }>
} {
  ensureLogFile()

  const content = readFileSync(LOG_FILE, 'utf-8')
  const lines = content.trim().split('\n').slice(1) // Skip header

  const summary = {
    totalCost: 0,
    successfulGenerations: 0,
    failedGenerations: 0,
    byAccount: {} as Record<string, { count: number; cost: number }>,
    byPlatform: {} as Record<string, { count: number; cost: number }>,
  }

  for (const line of lines) {
    if (!line.trim()) continue

    // Parse CSV (simple parser - assumes no commas in quoted fields)
    const match = line.match(/^([^,]+),([^,]+),"([^"]*)","([^"]*)",([^,]+),([^,]+),(true|false),(.*)$/)
    if (!match) continue

    const [, timestamp, , , account, platform, costStr, successStr] = match
    const cost = parseFloat(costStr)
    const success = successStr === 'true'

    // Filter by date range if specified
    if (options?.startDate && timestamp < options.startDate) continue
    if (options?.endDate && timestamp > options.endDate) continue

    if (success) {
      summary.successfulGenerations++
      summary.totalCost += cost

      // By account
      if (!summary.byAccount[account]) {
        summary.byAccount[account] = { count: 0, cost: 0 }
      }
      summary.byAccount[account].count++
      summary.byAccount[account].cost += cost

      // By platform
      if (!summary.byPlatform[platform]) {
        summary.byPlatform[platform] = { count: 0, cost: 0 }
      }
      summary.byPlatform[platform].count++
      summary.byPlatform[platform].cost += cost
    } else {
      summary.failedGenerations++
    }
  }

  return summary
}

/**
 * Print cost report to console
 */
export function printCostReport(options?: { startDate?: string; endDate?: string }): void {
  const summary = getCostSummary(options)

  console.log('\n=== Image Generation Cost Report ===\n')

  if (options?.startDate || options?.endDate) {
    console.log(`Period: ${options.startDate || 'start'} to ${options.endDate || 'now'}`)
  } else {
    console.log('Period: All time')
  }

  console.log(`\nTotal Cost: ${formatCost(summary.totalCost)}`)
  console.log(`Successful: ${summary.successfulGenerations}`)
  console.log(`Failed: ${summary.failedGenerations}`)
  console.log(`Cost per image: ${formatCost(GENERATION_RULES.costPerImage)}`)

  if (Object.keys(summary.byAccount).length > 0) {
    console.log('\nBy Posting Account:')
    for (const [account, data] of Object.entries(summary.byAccount)) {
      console.log(`  ${account}: ${data.count} images (${formatCost(data.cost)})`)
    }
  }

  if (Object.keys(summary.byPlatform).length > 0) {
    console.log('\nBy Platform:')
    for (const [platform, data] of Object.entries(summary.byPlatform)) {
      console.log(`  ${platform}: ${data.count} images (${formatCost(data.cost)})`)
    }
  }

  console.log('')
}

/**
 * Get current month's cost
 */
export function getCurrentMonthCost(): number {
  const now = new Date()
  const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const summary = getCostSummary({ startDate })
  return summary.totalCost
}
