/**
 * Feedback Client - Fetches live rejection themes from Partner Portal
 *
 * This module fetches partner feedback to dynamically adjust image generation.
 * Themes from rejections are automatically added as negative prompts.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Portal API URL - configurable via environment variable
const PORTAL_URL = process.env.PARTNER_PORTAL_URL || 'http://localhost:3000'
const API_KEY = process.env.IMAGE_FEEDBACK_API_KEY || ''

// Local cache to avoid hitting API on every generation
const CACHE_FILE = join(__dirname, 'feedback-cache.json')
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export interface FeedbackTheme {
  theme: string
  count: number
  weight: number
}

export interface FeedbackData {
  stats: {
    approvals: number
    rejections: number
    approvalRate: number
    totalFeedback: number
  }
  themes: FeedbackTheme[]
  negativePrompts: string[]
  recentReasons: string[]
  generatedAt: string
  fetchedAt: string
}

interface CachedFeedback {
  data: FeedbackData
  cachedAt: number
}

/**
 * Load cached feedback if still fresh
 */
function loadCache(): FeedbackData | null {
  if (!existsSync(CACHE_FILE)) return null

  try {
    const cached: CachedFeedback = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
    const age = Date.now() - cached.cachedAt

    if (age < CACHE_TTL_MS) {
      return cached.data
    }
  } catch {
    // Cache corrupted or invalid, ignore
  }

  return null
}

/**
 * Save feedback to cache
 */
function saveCache(data: FeedbackData): void {
  const cached: CachedFeedback = {
    data,
    cachedAt: Date.now(),
  }
  writeFileSync(CACHE_FILE, JSON.stringify(cached, null, 2))
}

/**
 * Fetch live feedback from Partner Portal API
 */
export async function fetchLiveFeedback(): Promise<FeedbackData | null> {
  // Check cache first
  const cached = loadCache()
  if (cached) {
    console.log('  [Feedback] Using cached feedback data')
    return cached
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (API_KEY) {
      headers['Authorization'] = `Bearer ${API_KEY}`
    }

    console.log('  [Feedback] Fetching live feedback from portal...')
    const response = await fetch(`${PORTAL_URL}/api/image-feedback`, {
      headers,
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      console.log(`  [Feedback] API returned ${response.status}, using static rules only`)
      return null
    }

    const data = await response.json()
    const feedback: FeedbackData = {
      ...data,
      fetchedAt: new Date().toISOString(),
    }

    // Cache the result
    saveCache(feedback)

    console.log(`  [Feedback] Loaded ${feedback.themes.length} themes (${feedback.stats.approvalRate}% approval rate)`)
    return feedback
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(`  [Feedback] Could not fetch: ${message} - using static rules only`)
    return null
  }
}

/**
 * Get negative prompts derived from feedback
 * Falls back to empty array if feedback unavailable
 */
export async function getFeedbackNegativePrompts(): Promise<string[]> {
  const feedback = await fetchLiveFeedback()
  return feedback?.negativePrompts || []
}

/**
 * Get full feedback summary for logging
 */
export async function getFeedbackSummary(): Promise<{
  available: boolean
  approvalRate: number
  themesApplied: string[]
}> {
  const feedback = await fetchLiveFeedback()

  if (!feedback) {
    return {
      available: false,
      approvalRate: 0,
      themesApplied: [],
    }
  }

  return {
    available: true,
    approvalRate: feedback.stats.approvalRate,
    themesApplied: feedback.negativePrompts,
  }
}

/**
 * Clear the feedback cache (useful for testing)
 */
export function clearFeedbackCache(): void {
  if (existsSync(CACHE_FILE)) {
    writeFileSync(CACHE_FILE, '')
  }
}
