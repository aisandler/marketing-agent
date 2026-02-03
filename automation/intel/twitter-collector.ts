#!/usr/bin/env npx tsx
/**
 * Twitter/X Intelligence Collector
 *
 * Collects industry themes and trending topics from your Twitter follow list.
 * Sources follow list from Airtable and analyzes for content opportunities.
 *
 * Usage:
 *   npx tsx automation/intel/twitter-collector.ts                  # Collect all categories
 *   npx tsx automation/intel/twitter-collector.ts --category key   # Collect one category
 *   npx tsx automation/intel/twitter-collector.ts --dry-run        # Preview without saving
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Output paths
const OUTPUT_DIR = join(__dirname, '../../docs/intelligence/twitter')
const THEMES_FILE = join(OUTPUT_DIR, 'industry-themes.json')
const TRENDS_FILE = join(OUTPUT_DIR, 'topic-trends.md')

// Airtable configuration for follow list
// Set via environment variables or .env file
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || ''
const FOLLOW_LIST_TABLE_ID = process.env.AIRTABLE_TWITTER_FOLLOW_TABLE_ID || ''

// Category configuration - customize for your industry
const CATEGORIES: Record<string, { name: string; description: string }> = {
  'industry': {
    name: 'Industry Voices',
    description: 'Thought leaders and market commentary in your space',
  },
  'competitors': {
    name: 'Competitor Accounts',
    description: 'Direct competitor social presence and content themes',
  },
  'market': {
    name: 'Market News',
    description: 'Industry news, trends, and market developments',
  },
}

interface TwitterTheme {
  id: string
  theme: string
  category: string
  mentions: number
  sentiment: 'positive' | 'neutral' | 'negative'
  relevance: 'high' | 'medium' | 'low'
  firstSeen: string
  lastSeen: string
  sampleTweets: string[]
}

interface TwitterAccount {
  handle: string
  name: string
  category: string
  followerCount?: number
  bio?: string
}

interface IndustryThemesData {
  metadata: {
    lastCollected: string | null
    collectionMethod: string
    followListSource: string
    version: string
  }
  categories: Record<
    string,
    {
      name: string
      accounts: TwitterAccount[]
      themes: TwitterTheme[]
    }
  >
  trendingTopics: TwitterTheme[]
  themeSchema: object
}

// CLI arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const CATEGORY_FLAG = args.find(a => a.startsWith('--category='))?.split('=')[1] ||
  (args.includes('--category') ? args[args.indexOf('--category') + 1] : null)

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

/**
 * Load existing themes data
 */
function loadThemesData(): IndustryThemesData {
  if (!existsSync(THEMES_FILE)) {
    return {
      metadata: {
        lastCollected: null,
        collectionMethod: 'chrome-mcp',
        followListSource: FOLLOW_LIST_TABLE_ID ? `airtable:${FOLLOW_LIST_TABLE_ID}` : 'manual',
        version: '1.0.0',
      },
      categories: {},
      trendingTopics: [],
      themeSchema: {},
    }
  }

  try {
    return JSON.parse(readFileSync(THEMES_FILE, 'utf-8'))
  } catch {
    console.log('Warning: Could not parse existing themes file, starting fresh')
    return {
      metadata: {
        lastCollected: null,
        collectionMethod: 'chrome-mcp',
        followListSource: FOLLOW_LIST_TABLE_ID ? `airtable:${FOLLOW_LIST_TABLE_ID}` : 'manual',
        version: '1.0.0',
      },
      categories: {},
      trendingTopics: [],
      themeSchema: {},
    }
  }
}

/**
 * Save themes data
 */
function saveThemesData(data: IndustryThemesData): void {
  ensureOutputDir()
  data.metadata.lastCollected = new Date().toISOString()
  writeFileSync(THEMES_FILE, JSON.stringify(data, null, 2))
  console.log(`Saved to ${THEMES_FILE}`)
}

/**
 * Fetch follow list from Airtable
 * Requires AIRTABLE_API_KEY environment variable
 */
async function fetchFollowList(): Promise<TwitterAccount[]> {
  const apiKey = process.env.AIRTABLE_API_KEY

  if (!apiKey) {
    console.log('Warning: AIRTABLE_API_KEY not set, using placeholder accounts')
    return []
  }

  if (!AIRTABLE_BASE_ID || !FOLLOW_LIST_TABLE_ID) {
    console.log('Warning: AIRTABLE_BASE_ID or AIRTABLE_TWITTER_FOLLOW_TABLE_ID not set')
    return []
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${FOLLOW_LIST_TABLE_ID}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      console.log(`Airtable API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    const accounts: TwitterAccount[] = []

    for (const record of data.records || []) {
      const fields = record.fields
      if (fields['Handle']) {
        accounts.push({
          handle: fields['Handle'],
          name: fields['Name'] || fields['Handle'],
          category: fields['Category'] || 'uncategorized',
          followerCount: fields['Followers'],
          bio: fields['Bio'],
        })
      }
    }

    return accounts
  } catch (error) {
    console.log(`Error fetching follow list: ${error}`)
    return []
  }
}

/**
 * Collect themes from Twitter/X for a category
 * NOTE: This is a placeholder for Chrome MCP integration
 */
async function collectCategoryThemes(
  categoryKey: string,
  config: { name: string; description: string },
  accounts: TwitterAccount[]
): Promise<TwitterTheme[]> {
  console.log(`\nCollecting from ${config.name}...`)
  console.log(`  Description: ${config.description}`)
  console.log(`  Accounts: ${accounts.length}`)

  // TODO: Integrate with Chrome MCP for actual browser automation
  // For now, this creates a placeholder structure for manual collection

  console.log('  NOTE: Chrome MCP integration required for automated collection')
  console.log('  Placeholder structure created - populate manually or implement Chrome MCP')

  // Return empty array - actual themes would be collected via Chrome MCP
  return []
}

/**
 * Generate topic trends markdown report
 */
function generateTrendsReport(data: IndustryThemesData): string {
  const allThemes: TwitterTheme[] = []
  for (const category of Object.values(data.categories)) {
    allThemes.push(...category.themes)
  }

  // Add trending topics
  allThemes.push(...data.trendingTopics)

  if (allThemes.length === 0) {
    return `# Twitter/X Topic Trends

*Last Updated: ${new Date().toISOString()}*

## Overview

No themes collected yet. Run collection with Chrome MCP to populate data.

---

## Categories Configured

${Object.entries(CATEGORIES)
  .map(([key, config]) => `### ${config.name}\n${config.description}`)
  .join('\n\n')}

---

*Run \`/intel collect --twitter\` with Chrome MCP to begin data collection*
`
  }

  // Sort by mentions
  const sortedThemes = [...allThemes].sort((a, b) => b.mentions - a.mentions)
  const topThemes = sortedThemes.slice(0, 10)

  // Group by sentiment
  const positive = allThemes.filter(t => t.sentiment === 'positive')
  const negative = allThemes.filter(t => t.sentiment === 'negative')
  const neutral = allThemes.filter(t => t.sentiment === 'neutral')

  // Group by relevance
  const highRelevance = allThemes.filter(t => t.relevance === 'high')

  return `# Twitter/X Topic Trends

*Last Updated: ${new Date().toISOString()}*

## Overview

Analysis of ${allThemes.length} themes from ${Object.keys(data.categories).length} categories.

---

## Current Trending Topics

### This Week (Top 10)
| Topic | Category | Mentions | Sentiment | Relevance |
|-------|----------|----------|-----------|-----------|
${topThemes.map(t => `| ${t.theme} | ${t.category} | ${t.mentions} | ${t.sentiment} | ${t.relevance} |`).join('\n')}

---

## Category Breakdown

${Object.entries(data.categories)
  .map(([key, category]) => {
    const categoryThemes = category.themes.slice(0, 5)
    return `### ${category.name}
**Accounts monitored**: ${category.accounts.length}
**Themes detected**: ${category.themes.length}

**Top themes**:
${categoryThemes.length > 0 ? categoryThemes.map(t => `- ${t.theme} (${t.mentions} mentions)`).join('\n') : '- No themes detected yet'}
`
  })
  .join('\n')}

---

## Sentiment Analysis

- **Positive themes**: ${positive.length}
- **Neutral themes**: ${neutral.length}
- **Negative themes**: ${negative.length}

---

## High Relevance Topics

${highRelevance.length > 0 ? highRelevance.map(t => `- **${t.theme}** (${t.category})`).join('\n') : '- No high-relevance topics identified yet'}

---

## Content Opportunities

### Topics to Cover
${highRelevance.filter(t => t.sentiment !== 'negative').slice(0, 5).map(t => `- ${t.theme}`).join('\n') || '- To be identified after data collection'}

### Topics Gaining Momentum
*Requires time-series data - collect again next week to identify trends*

### Topics to Avoid (Overplayed)
*To be identified after sufficient data collection*

---

## Hashtag Analysis

*Requires hashtag extraction during collection*

---

## Recommendations for Content

### Timely Content Ideas
${highRelevance.slice(0, 3).map(t => `- Post about: ${t.theme}`).join('\n') || '- To be identified after data collection'}

### Visual Content Themes
*To be identified after data collection and visual analysis*

---

*Data collected via Chrome MCP browser automation*
`
}

/**
 * Main collection function
 */
async function main(): Promise<void> {
  console.log('=== Twitter/X Intelligence Collector ===\n')

  if (DRY_RUN) {
    console.log('[DRY RUN MODE - no files will be saved]\n')
  }

  // Load existing data
  const data = loadThemesData()

  // Fetch follow list from Airtable
  console.log('Fetching follow list from Airtable...')
  const followList = await fetchFollowList()
  console.log(`  Found ${followList.length} accounts`)

  // Group accounts by category
  const accountsByCategory: Record<string, TwitterAccount[]> = {}
  for (const account of followList) {
    const category = account.category.toLowerCase().replace(/\s+/g, '-')
    if (!accountsByCategory[category]) {
      accountsByCategory[category] = []
    }
    accountsByCategory[category].push(account)
  }

  // Determine which categories to collect
  const categoriesToCollect = CATEGORY_FLAG
    ? { [CATEGORY_FLAG]: CATEGORIES[CATEGORY_FLAG] }
    : CATEGORIES

  if (CATEGORY_FLAG && !CATEGORIES[CATEGORY_FLAG]) {
    console.log(`Unknown category: ${CATEGORY_FLAG}`)
    console.log(`Available: ${Object.keys(CATEGORIES).join(', ')}`)
    process.exit(1)
  }

  // Collect from each category
  for (const [key, config] of Object.entries(categoriesToCollect)) {
    const accounts = accountsByCategory[key] || []
    const themes = await collectCategoryThemes(key, config, accounts)

    if (!data.categories[key]) {
      data.categories[key] = {
        name: config.name,
        accounts: [],
        themes: [],
      }
    }

    // Update accounts list
    data.categories[key].accounts = accounts

    // Merge new themes (update existing or add new)
    const existingIds = new Set(data.categories[key].themes.map(t => t.id))
    const newThemes = themes.filter(t => !existingIds.has(t.id))

    // Update existing themes
    for (const theme of themes) {
      if (existingIds.has(theme.id)) {
        const existing = data.categories[key].themes.find(t => t.id === theme.id)
        if (existing) {
          existing.mentions = theme.mentions
          existing.lastSeen = theme.lastSeen
          existing.sentiment = theme.sentiment
        }
      }
    }

    if (newThemes.length > 0) {
      data.categories[key].themes = [...data.categories[key].themes, ...newThemes]
      console.log(`  Added ${newThemes.length} new themes`)
    } else {
      console.log('  No new themes to add')
    }
  }

  if (!DRY_RUN) {
    // Save themes data
    saveThemesData(data)

    // Generate trends report
    const trends = generateTrendsReport(data)
    writeFileSync(TRENDS_FILE, trends)
    console.log(`Generated ${TRENDS_FILE}`)
  } else {
    console.log('\n[DRY RUN] Would save:')
    console.log(`  - ${THEMES_FILE}`)
    console.log(`  - ${TRENDS_FILE}`)
  }

  // Summary
  const totalThemes = Object.values(data.categories).reduce((sum, c) => sum + c.themes.length, 0)
  const totalAccounts = Object.values(data.categories).reduce((sum, c) => sum + c.accounts.length, 0)

  console.log('\n=== Collection Summary ===')
  console.log(`Categories: ${Object.keys(data.categories).length}`)
  console.log(`Accounts: ${totalAccounts}`)
  console.log(`Themes: ${totalThemes}`)
  console.log(`Last collected: ${data.metadata.lastCollected || 'Never'}`)

  if (totalThemes === 0) {
    console.log('\nNote: No themes collected. To enable automated collection:')
    console.log('1. Ensure Chrome MCP extension is installed')
    console.log('2. Configure browser automation for Twitter/X')
    console.log('3. Set AIRTABLE_API_KEY and AIRTABLE_TWITTER_FOLLOW_TABLE_ID for follow list')
    console.log('4. Re-run this script')
  }
}

// Run
main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
