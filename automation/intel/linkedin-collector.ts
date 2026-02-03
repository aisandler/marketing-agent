#!/usr/bin/env npx tsx
/**
 * LinkedIn Intelligence Collector
 *
 * Collects competitor post data from LinkedIn company pages using Chrome MCP.
 * Analyzes engagement patterns and visual styles to inform image generation.
 *
 * Usage:
 *   npx tsx automation/intel/linkedin-collector.ts                    # Collect all competitors
 *   npx tsx automation/intel/linkedin-collector.ts --competitor key   # Collect one competitor
 *   npx tsx automation/intel/linkedin-collector.ts --dry-run          # Preview without saving
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

// Output paths
const OUTPUT_DIR = join(__dirname, '../../docs/intelligence/linkedin')
const POSTS_FILE = join(OUTPUT_DIR, 'competitor-posts.json')
const PATTERNS_FILE = join(OUTPUT_DIR, 'engagement-patterns.md')
const TRENDS_FILE = join(OUTPUT_DIR, 'visual-trends.md')

// Competitor configuration
// Configure competitors in client-context/competitors/ or edit this object directly
const COMPETITORS: Record<string, { name: string; linkedinUrl: string; focus: string }> = {
  // Example competitor entries - customize for your industry:
  // 'competitor-1': {
  //   name: 'Competitor One',
  //   linkedinUrl: 'https://www.linkedin.com/company/competitor-one',
  //   focus: 'Market leader patterns',
  // },
  // 'competitor-2': {
  //   name: 'Competitor Two',
  //   linkedinUrl: 'https://www.linkedin.com/company/competitor-two',
  //   focus: 'Boutique approach',
  // },
}

// Try to load competitors from config file
function loadCompetitorsFromConfig(): void {
  const configPath = join(__dirname, '../../client-context/competitors/competitor-list.json')
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'))
      if (config.competitors) {
        for (const [key, value] of Object.entries(config.competitors)) {
          COMPETITORS[key] = value as { name: string; linkedinUrl: string; focus: string }
        }
      }
    } catch (error) {
      console.log('Warning: Could not load competitors from config')
    }
  }
}

interface LinkedInPost {
  id: string
  competitor: string
  date: string
  content: string
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  hasImage: boolean
  imageDescription: string | null
  postType: 'article' | 'update' | 'poll' | 'video' | 'document'
  topics: string[]
}

interface CompetitorPostData {
  metadata: {
    lastCollected: string | null
    collectionMethod: string
    version: string
  }
  competitors: Record<
    string,
    {
      name: string
      linkedinUrl: string
      posts: LinkedInPost[]
    }
  >
  postSchema: object
}

// CLI arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const COMPETITOR_FLAG = args.find(a => a.startsWith('--competitor='))?.split('=')[1] ||
  (args.includes('--competitor') ? args[args.indexOf('--competitor') + 1] : null)

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

/**
 * Load existing posts data
 */
function loadPostsData(): CompetitorPostData {
  if (!existsSync(POSTS_FILE)) {
    return {
      metadata: {
        lastCollected: null,
        collectionMethod: 'chrome-mcp',
        version: '1.0.0',
      },
      competitors: {},
      postSchema: {},
    }
  }

  try {
    return JSON.parse(readFileSync(POSTS_FILE, 'utf-8'))
  } catch {
    console.log('Warning: Could not parse existing posts file, starting fresh')
    return {
      metadata: {
        lastCollected: null,
        collectionMethod: 'chrome-mcp',
        version: '1.0.0',
      },
      competitors: {},
      postSchema: {},
    }
  }
}

/**
 * Save posts data
 */
function savePostsData(data: CompetitorPostData): void {
  ensureOutputDir()
  data.metadata.lastCollected = new Date().toISOString()
  writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2))
  console.log(`Saved to ${POSTS_FILE}`)
}

/**
 * Collect posts from a LinkedIn company page
 * NOTE: This is a placeholder for Chrome MCP integration
 */
async function collectCompetitorPosts(
  competitorKey: string,
  config: { name: string; linkedinUrl: string; focus: string }
): Promise<LinkedInPost[]> {
  console.log(`\nCollecting from ${config.name}...`)
  console.log(`  URL: ${config.linkedinUrl}`)
  console.log(`  Focus: ${config.focus}`)

  // TODO: Integrate with Chrome MCP for actual browser automation
  // For now, this creates a placeholder structure for manual collection

  console.log('  NOTE: Chrome MCP integration required for automated collection')
  console.log('  Placeholder structure created - populate manually or implement Chrome MCP')

  // Return empty array - actual posts would be collected via Chrome MCP
  return []
}

/**
 * Analyze engagement patterns from collected posts
 */
function analyzeEngagementPatterns(data: CompetitorPostData): string {
  const allPosts: LinkedInPost[] = []
  for (const competitor of Object.values(data.competitors)) {
    allPosts.push(...competitor.posts)
  }

  if (allPosts.length === 0) {
    return `# LinkedIn Engagement Patterns

*Last Updated: ${new Date().toISOString()}*

## Overview

No posts collected yet. Run collection with Chrome MCP to populate data.

---

*Run \`/intel collect --linkedin\` with Chrome MCP to begin data collection*
`
  }

  // Calculate engagement metrics
  const postsByType: Record<string, LinkedInPost[]> = {}
  const postsWithImages = allPosts.filter(p => p.hasImage)
  const postsWithoutImages = allPosts.filter(p => !p.hasImage)

  for (const post of allPosts) {
    if (!postsByType[post.postType]) {
      postsByType[post.postType] = []
    }
    postsByType[post.postType].push(post)
  }

  // Calculate averages
  const avgEngagement = (posts: LinkedInPost[]) => {
    if (posts.length === 0) return { likes: 0, comments: 0, shares: 0 }
    return {
      likes: Math.round(posts.reduce((sum, p) => sum + p.engagement.likes, 0) / posts.length),
      comments: Math.round(posts.reduce((sum, p) => sum + p.engagement.comments, 0) / posts.length),
      shares: Math.round(posts.reduce((sum, p) => sum + p.engagement.shares, 0) / posts.length),
    }
  }

  const overallAvg = avgEngagement(allPosts)
  const imageAvg = avgEngagement(postsWithImages)
  const noImageAvg = avgEngagement(postsWithoutImages)

  return `# LinkedIn Engagement Patterns

*Last Updated: ${new Date().toISOString()}*

## Overview

Analysis of ${allPosts.length} posts from ${Object.keys(data.competitors).length} competitors.

---

## High-Performing Content Types

### By Engagement Rate
| Content Type | Posts | Avg. Likes | Avg. Comments | Avg. Shares |
|--------------|-------|------------|---------------|-------------|
${Object.entries(postsByType)
  .map(([type, posts]) => {
    const avg = avgEngagement(posts)
    return `| ${type} | ${posts.length} | ${avg.likes} | ${avg.comments} | ${avg.shares} |`
  })
  .join('\n')}

### Image vs No Image Performance
| Type | Posts | Avg. Likes | Avg. Comments | Avg. Shares |
|------|-------|------------|---------------|-------------|
| With Image | ${postsWithImages.length} | ${imageAvg.likes} | ${imageAvg.comments} | ${imageAvg.shares} |
| Without Image | ${postsWithoutImages.length} | ${noImageAvg.likes} | ${noImageAvg.comments} | ${noImageAvg.shares} |

---

## Overall Averages

- **Average Likes**: ${overallAvg.likes}
- **Average Comments**: ${overallAvg.comments}
- **Average Shares**: ${overallAvg.shares}

---

## Recommendations

Based on competitor analysis:
${postsWithImages.length > 0 && imageAvg.likes > noImageAvg.likes ? '- **Prioritize posts with images** - they show higher engagement' : ''}
${Object.entries(postsByType).length > 0 ? `- **Top performing format**: ${Object.entries(postsByType).sort((a, b) => avgEngagement(b[1]).likes - avgEngagement(a[1]).likes)[0][0]}` : ''}

---

*Data collected via Chrome MCP browser automation*
`
}

/**
 * Analyze visual trends from collected posts
 */
function analyzeVisualTrends(data: CompetitorPostData): string {
  const postsWithImages: LinkedInPost[] = []
  for (const competitor of Object.values(data.competitors)) {
    postsWithImages.push(...competitor.posts.filter(p => p.hasImage))
  }

  if (postsWithImages.length === 0) {
    return `# LinkedIn Visual Trends

*Last Updated: ${new Date().toISOString()}*

## Overview

No posts with images collected yet. Run collection with Chrome MCP to populate data.

---

*Run \`/intel collect --linkedin\` with Chrome MCP to begin data collection*
`
  }

  // Group by competitor
  const byCompetitor: Record<string, LinkedInPost[]> = {}
  for (const post of postsWithImages) {
    if (!byCompetitor[post.competitor]) {
      byCompetitor[post.competitor] = []
    }
    byCompetitor[post.competitor].push(post)
  }

  return `# LinkedIn Visual Trends

*Last Updated: ${new Date().toISOString()}*

## Overview

Analysis of ${postsWithImages.length} posts with images from ${Object.keys(byCompetitor).length} competitors.

---

## Competitor Visual Styles

${Object.entries(byCompetitor)
  .map(([competitor, posts]) => {
    const config = COMPETITORS[competitor]
    const imageDescriptions = posts
      .filter(p => p.imageDescription)
      .map(p => p.imageDescription)
      .slice(0, 5)

    return `### ${config?.name || competitor}

**Posts with images**: ${posts.length}

**Sample image styles**:
${imageDescriptions.length > 0 ? imageDescriptions.map(d => `- ${d}`).join('\n') : '- No descriptions available'}
`
  })
  .join('\n')}

---

## Visual Elements That Perform Well

*Analysis pending - requires more data points*

---

## Recommendations for Image Generation

### Positive Prompts (Include)
- *To be identified after data collection*

### Negative Prompts (Avoid)
- *To be identified after data collection*

---

*Data collected via Chrome MCP browser automation*
`
}

/**
 * Main collection function
 */
async function main(): Promise<void> {
  console.log('=== LinkedIn Intelligence Collector ===\n')

  // Load competitors from config
  loadCompetitorsFromConfig()

  if (Object.keys(COMPETITORS).length === 0) {
    console.log('No competitors configured.')
    console.log('\nTo configure competitors:')
    console.log('1. Create client-context/competitors/competitor-list.json with:')
    console.log('   { "competitors": { "key": { "name": "...", "linkedinUrl": "...", "focus": "..." } } }')
    console.log('2. Or edit the COMPETITORS object in this file directly')
    return
  }

  if (DRY_RUN) {
    console.log('[DRY RUN MODE - no files will be saved]\n')
  }

  // Load existing data
  const data = loadPostsData()

  // Determine which competitors to collect
  const competitorsToCollect = COMPETITOR_FLAG
    ? { [COMPETITOR_FLAG]: COMPETITORS[COMPETITOR_FLAG] }
    : COMPETITORS

  if (COMPETITOR_FLAG && !COMPETITORS[COMPETITOR_FLAG]) {
    console.log(`Unknown competitor: ${COMPETITOR_FLAG}`)
    console.log(`Available: ${Object.keys(COMPETITORS).join(', ')}`)
    process.exit(1)
  }

  // Collect from each competitor
  for (const [key, config] of Object.entries(competitorsToCollect)) {
    const posts = await collectCompetitorPosts(key, config)

    if (!data.competitors[key]) {
      data.competitors[key] = {
        name: config.name,
        linkedinUrl: config.linkedinUrl,
        posts: [],
      }
    }

    // Merge new posts (deduplicate by ID)
    const existingIds = new Set(data.competitors[key].posts.map(p => p.id))
    const newPosts = posts.filter(p => !existingIds.has(p.id))

    if (newPosts.length > 0) {
      data.competitors[key].posts = [...data.competitors[key].posts, ...newPosts]
      console.log(`  Added ${newPosts.length} new posts`)
    } else {
      console.log('  No new posts to add')
    }
  }

  if (!DRY_RUN) {
    // Save posts data
    savePostsData(data)

    // Generate analysis files
    const patterns = analyzeEngagementPatterns(data)
    writeFileSync(PATTERNS_FILE, patterns)
    console.log(`Generated ${PATTERNS_FILE}`)

    const trends = analyzeVisualTrends(data)
    writeFileSync(TRENDS_FILE, trends)
    console.log(`Generated ${TRENDS_FILE}`)
  } else {
    console.log('\n[DRY RUN] Would save:')
    console.log(`  - ${POSTS_FILE}`)
    console.log(`  - ${PATTERNS_FILE}`)
    console.log(`  - ${TRENDS_FILE}`)
  }

  // Summary
  const totalPosts = Object.values(data.competitors).reduce((sum, c) => sum + c.posts.length, 0)
  console.log('\n=== Collection Summary ===')
  console.log(`Competitors: ${Object.keys(data.competitors).length}`)
  console.log(`Total posts: ${totalPosts}`)
  console.log(`Last collected: ${data.metadata.lastCollected || 'Never'}`)

  if (totalPosts === 0) {
    console.log('\nNote: No posts collected. To enable automated collection:')
    console.log('1. Ensure Chrome MCP extension is installed')
    console.log('2. Configure browser automation for LinkedIn')
    console.log('3. Re-run this script')
  }
}

// Run
main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
