#!/usr/bin/env npx tsx
/**
 * Visual Analyzer
 *
 * Analyzes collected images for patterns, styles, colors, and composition.
 * Correlates visual elements with engagement metrics to inform image generation.
 *
 * Usage:
 *   npx tsx automation/intel/visual-analyzer.ts              # Analyze all collected data
 *   npx tsx automation/intel/visual-analyzer.ts --dry-run    # Preview without saving
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Input paths
const LINKEDIN_POSTS_FILE = join(__dirname, '../../docs/intelligence/linkedin/competitor-posts.json')

// Output paths
const OUTPUT_DIR = join(__dirname, '../../docs/intelligence/visuals')
const STYLE_PATTERNS_FILE = join(OUTPUT_DIR, 'style-patterns.json')
const COMPETITOR_AUDIT_FILE = join(OUTPUT_DIR, 'competitor-audit.md')
const ENGAGEMENT_BY_STYLE_FILE = join(OUTPUT_DIR, 'engagement-by-style.md')

// Style classification categories
const STYLE_CATEGORIES = {
  photography: ['architectural', 'cityscape', 'interior', 'document', 'headshot', 'team'],
  illustration: ['flat', 'isometric', 'line-art', 'icon-based'],
  infographic: ['data-viz', 'process', 'comparison', 'timeline'],
  'branded-graphic': ['quote-card', 'announcement', 'event-promo', 'deal-announcement'],
  'mixed-media': ['photo-overlay', 'collage', 'mockup'],
}

// Visual elements to detect
const VISUAL_ELEMENTS = [
  'buildings',
  'documents',
  'charts-graphs',
  'icons',
  'logos',
  'landmarks',
  'abstract-shapes',
  'people',
  'handshakes',
]

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
  postType: string
  topics: string[]
}

interface StylePatternsData {
  metadata: {
    lastAnalyzed: string | null
    imagesAnalyzed: number
    version: string
  }
  styleClassifications: Record<string, {
    count: number
    avgEngagement: number | null
    subtypes: Record<string, number>
  }>
  colorPalettes: {
    dominant: string[]
    byCompetitor: Record<string, string[]>
    highEngagement: string[]
    lowEngagement: string[]
  }
  compositionPatterns: {
    layouts: Record<string, { count: number; avgEngagement: number | null }>
    textOverlay: Record<string, { count: number; avgEngagement: number | null }>
  }
  elementFrequency: Record<string, number>
}

// CLI arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

/**
 * Load LinkedIn posts data
 */
function loadLinkedInPosts(): LinkedInPost[] {
  if (!existsSync(LINKEDIN_POSTS_FILE)) {
    console.log('No LinkedIn posts data found')
    return []
  }

  try {
    const data = JSON.parse(readFileSync(LINKEDIN_POSTS_FILE, 'utf-8'))
    const posts: LinkedInPost[] = []

    for (const competitor of Object.values(data.competitors || {})) {
      const comp = competitor as { posts: LinkedInPost[] }
      posts.push(...(comp.posts || []))
    }

    return posts
  } catch (error) {
    console.log(`Error loading LinkedIn posts: ${error}`)
    return []
  }
}

/**
 * Load existing style patterns
 */
function loadStylePatterns(): StylePatternsData {
  if (!existsSync(STYLE_PATTERNS_FILE)) {
    return createEmptyStylePatterns()
  }

  try {
    return JSON.parse(readFileSync(STYLE_PATTERNS_FILE, 'utf-8'))
  } catch {
    return createEmptyStylePatterns()
  }
}

/**
 * Create empty style patterns structure
 */
function createEmptyStylePatterns(): StylePatternsData {
  const styleClassifications: StylePatternsData['styleClassifications'] = {}
  for (const [category, subtypes] of Object.entries(STYLE_CATEGORIES)) {
    const subtypeObj: Record<string, number> = {}
    for (const subtype of subtypes) {
      subtypeObj[subtype] = 0
    }
    styleClassifications[category] = {
      count: 0,
      avgEngagement: null,
      subtypes: subtypeObj,
    }
  }

  const elementFrequency: Record<string, number> = {}
  for (const element of VISUAL_ELEMENTS) {
    elementFrequency[element] = 0
  }

  return {
    metadata: {
      lastAnalyzed: null,
      imagesAnalyzed: 0,
      version: '1.0.0',
    },
    styleClassifications,
    colorPalettes: {
      dominant: [],
      byCompetitor: {},
      highEngagement: [],
      lowEngagement: [],
    },
    compositionPatterns: {
      layouts: {
        centered: { count: 0, avgEngagement: null },
        'rule-of-thirds': { count: 0, avgEngagement: null },
        split: { count: 0, avgEngagement: null },
        'full-bleed': { count: 0, avgEngagement: null },
      },
      textOverlay: {
        none: { count: 0, avgEngagement: null },
        'headline-only': { count: 0, avgEngagement: null },
        'headline-subhead': { count: 0, avgEngagement: null },
        'heavy-text': { count: 0, avgEngagement: null },
      },
    },
    elementFrequency,
  }
}

/**
 * Analyze image description for style classification
 * NOTE: In production, this would use vision AI for actual image analysis
 */
function classifyImageStyle(description: string | null): {
  category: string
  subtype: string
} | null {
  if (!description) return null

  const desc = description.toLowerCase()

  // Photography detection
  if (desc.includes('photo') || desc.includes('photograph')) {
    if (desc.includes('building') || desc.includes('architecture') || desc.includes('skyline')) {
      return { category: 'photography', subtype: 'architectural' }
    }
    if (desc.includes('city') || desc.includes('street')) {
      return { category: 'photography', subtype: 'cityscape' }
    }
    if (desc.includes('interior') || desc.includes('office') || desc.includes('room')) {
      return { category: 'photography', subtype: 'interior' }
    }
    if (desc.includes('headshot') || desc.includes('portrait') || desc.includes('person')) {
      return { category: 'photography', subtype: 'headshot' }
    }
    if (desc.includes('team') || desc.includes('group')) {
      return { category: 'photography', subtype: 'team' }
    }
    return { category: 'photography', subtype: 'architectural' }
  }

  // Illustration detection
  if (desc.includes('illustration') || desc.includes('graphic') || desc.includes('icon')) {
    if (desc.includes('flat') || desc.includes('2d')) {
      return { category: 'illustration', subtype: 'flat' }
    }
    if (desc.includes('isometric') || desc.includes('3d')) {
      return { category: 'illustration', subtype: 'isometric' }
    }
    if (desc.includes('line') || desc.includes('outline')) {
      return { category: 'illustration', subtype: 'line-art' }
    }
    return { category: 'illustration', subtype: 'icon-based' }
  }

  // Infographic detection
  if (desc.includes('infographic') || desc.includes('chart') || desc.includes('graph') || desc.includes('data')) {
    if (desc.includes('process') || desc.includes('flow') || desc.includes('step')) {
      return { category: 'infographic', subtype: 'process' }
    }
    if (desc.includes('comparison') || desc.includes('vs') || desc.includes('versus')) {
      return { category: 'infographic', subtype: 'comparison' }
    }
    if (desc.includes('timeline') || desc.includes('history')) {
      return { category: 'infographic', subtype: 'timeline' }
    }
    return { category: 'infographic', subtype: 'data-viz' }
  }

  // Branded graphic detection
  if (desc.includes('quote') || desc.includes('announcement') || desc.includes('branded')) {
    if (desc.includes('quote')) {
      return { category: 'branded-graphic', subtype: 'quote-card' }
    }
    if (desc.includes('event') || desc.includes('panel') || desc.includes('webinar')) {
      return { category: 'branded-graphic', subtype: 'event-promo' }
    }
    if (desc.includes('deal') || desc.includes('closed') || desc.includes('congratulations')) {
      return { category: 'branded-graphic', subtype: 'deal-announcement' }
    }
    return { category: 'branded-graphic', subtype: 'announcement' }
  }

  // Mixed media
  if (desc.includes('overlay') || desc.includes('collage') || desc.includes('mockup')) {
    if (desc.includes('overlay')) {
      return { category: 'mixed-media', subtype: 'photo-overlay' }
    }
    if (desc.includes('collage')) {
      return { category: 'mixed-media', subtype: 'collage' }
    }
    return { category: 'mixed-media', subtype: 'mockup' }
  }

  return null
}

/**
 * Detect visual elements in description
 */
function detectElements(description: string | null): string[] {
  if (!description) return []

  const desc = description.toLowerCase()
  const detected: string[] = []

  const elementKeywords: Record<string, string[]> = {
    buildings: ['building', 'tower', 'skyscraper', 'architecture', 'facade'],
    documents: ['document', 'paper', 'contract', 'lease', 'agreement'],
    'charts-graphs': ['chart', 'graph', 'data', 'statistics', 'metrics'],
    icons: ['icon', 'symbol', 'pictogram'],
    logos: ['logo', 'brand', 'company name'],
    landmarks: ['landmark', 'monument', 'famous', 'iconic'],
    'abstract-shapes': ['abstract', 'geometric', 'shape', 'pattern'],
    people: ['person', 'people', 'face', 'portrait', 'headshot', 'team'],
    handshakes: ['handshake', 'shaking hands', 'agreement'],
  }

  for (const [element, keywords] of Object.entries(elementKeywords)) {
    if (keywords.some(kw => desc.includes(kw))) {
      detected.push(element)
    }
  }

  return detected
}

/**
 * Calculate total engagement score
 */
function calculateEngagement(post: LinkedInPost): number {
  return post.engagement.likes + (post.engagement.comments * 3) + (post.engagement.shares * 5)
}

/**
 * Analyze all collected posts
 */
function analyzeVisualPatterns(posts: LinkedInPost[]): StylePatternsData {
  const patterns = createEmptyStylePatterns()
  const postsWithImages = posts.filter(p => p.hasImage)

  patterns.metadata.imagesAnalyzed = postsWithImages.length

  // Track engagement by category for averaging
  const engagementByCategory: Record<string, number[]> = {}

  for (const post of postsWithImages) {
    const classification = classifyImageStyle(post.imageDescription)
    const elements = detectElements(post.imageDescription)
    const engagement = calculateEngagement(post)

    // Update style classifications
    if (classification) {
      patterns.styleClassifications[classification.category].count++
      patterns.styleClassifications[classification.category].subtypes[classification.subtype]++

      if (!engagementByCategory[classification.category]) {
        engagementByCategory[classification.category] = []
      }
      engagementByCategory[classification.category].push(engagement)
    }

    // Update element frequency
    for (const element of elements) {
      if (patterns.elementFrequency[element] !== undefined) {
        patterns.elementFrequency[element]++
      }
    }
  }

  // Calculate average engagement per category
  for (const [category, engagements] of Object.entries(engagementByCategory)) {
    if (engagements.length > 0) {
      const avg = Math.round(engagements.reduce((a, b) => a + b, 0) / engagements.length)
      patterns.styleClassifications[category].avgEngagement = avg
    }
  }

  patterns.metadata.lastAnalyzed = new Date().toISOString()

  return patterns
}

/**
 * Generate competitor audit report
 */
function generateCompetitorAudit(posts: LinkedInPost[]): string {
  const byCompetitor: Record<string, LinkedInPost[]> = {}
  for (const post of posts) {
    if (!byCompetitor[post.competitor]) {
      byCompetitor[post.competitor] = []
    }
    byCompetitor[post.competitor].push(post)
  }

  return `# Competitor Visual Audit

*Last Updated: ${new Date().toISOString()}*

## Overview

Audit based on ${posts.filter(p => p.hasImage).length} posts with images from ${Object.keys(byCompetitor).length} competitors.

---

## Audit Summary

| Competitor | Total Posts | Posts with Images | Avg Engagement |
|------------|-------------|-------------------|----------------|
${Object.entries(byCompetitor)
  .map(([key, competitorPosts]) => {
    const withImages = competitorPosts.filter(p => p.hasImage).length
    const avgEng = competitorPosts.length > 0
      ? Math.round(competitorPosts.reduce((sum, p) => sum + calculateEngagement(p), 0) / competitorPosts.length)
      : 0
    return `| ${key} | ${competitorPosts.length} | ${withImages} | ${avgEng} |`
  })
  .join('\n')}

---

## Detailed Audits

${Object.entries(byCompetitor)
  .map(([key, competitorPosts]) => {
    const withImages = competitorPosts.filter(p => p.hasImage)
    const styleBreakdown: Record<string, number> = {}

    for (const post of withImages) {
      const classification = classifyImageStyle(post.imageDescription)
      if (classification) {
        const style = classification.category
        styleBreakdown[style] = (styleBreakdown[style] || 0) + 1
      }
    }

    return `### ${key}

**Total posts**: ${competitorPosts.length}
**Posts with images**: ${withImages.length}

**Style breakdown**:
${Object.entries(styleBreakdown).length > 0
  ? Object.entries(styleBreakdown).map(([style, count]) => `- ${style}: ${count}`).join('\n')
  : '- No style data available'}

**Sample image descriptions**:
${withImages.slice(0, 3).map(p => p.imageDescription ? `- "${p.imageDescription}"` : '- (no description)').join('\n')}
`
  })
  .join('\n')}

---

## Differentiation Opportunities

Based on competitor analysis:
${posts.length > 0 ? `
- **Visual gaps**: Identify styles competitors underutilize
- **Quality opportunities**: Raise bar above stock imagery
- **Brand consistency**: Maintain recognizable visual identity
` : '- Collect more data to identify opportunities'}

---

*Run visual analysis after data collection to populate detailed audit*
`
}

/**
 * Generate engagement by style report
 */
function generateEngagementReport(patterns: StylePatternsData): string {
  // Sort categories by average engagement
  const sortedCategories = Object.entries(patterns.styleClassifications)
    .filter(([, data]) => data.count > 0)
    .sort((a, b) => (b[1].avgEngagement || 0) - (a[1].avgEngagement || 0))

  // Sort elements by frequency
  const sortedElements = Object.entries(patterns.elementFrequency)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  return `# Engagement by Visual Style

*Last Updated: ${patterns.metadata.lastAnalyzed || new Date().toISOString()}*

## Overview

Analysis of ${patterns.metadata.imagesAnalyzed} images for visual style performance.

---

## Style Performance Rankings

### By Average Engagement
| Rank | Style | Count | Avg. Engagement |
|------|-------|-------|-----------------|
${sortedCategories.length > 0
  ? sortedCategories.map(([category, data], i) =>
      `| ${i + 1} | ${category} | ${data.count} | ${data.avgEngagement || 'N/A'} |`
    ).join('\n')
  : '| - | No data yet | - | - |'}

---

## Visual Element Frequency

| Element | Count | Notes |
|---------|-------|-------|
${sortedElements.length > 0
  ? sortedElements.map(([element, count]) =>
      `| ${element} | ${count} | - |`
    ).join('\n')
  : '| - | No data yet | - |'}

---

## Style Category Details

${Object.entries(patterns.styleClassifications)
  .filter(([, data]) => data.count > 0)
  .map(([category, data]) => {
    const topSubtypes = Object.entries(data.subtypes)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return `### ${category}

**Total count**: ${data.count}
**Average engagement**: ${data.avgEngagement || 'N/A'}

**Top subtypes**:
${topSubtypes.length > 0
  ? topSubtypes.map(([subtype, count]) => `- ${subtype}: ${count}`).join('\n')
  : '- No subtypes detected'}
`
  })
  .join('\n')}

---

## Recommendations for Image Generation

### High-Priority Styles (Use More)
${sortedCategories.slice(0, 2).map(([cat]) => `- ${cat}`).join('\n') || '- To be identified after analysis'}

### Low-Priority Styles (Avoid)
${sortedCategories.slice(-2).map(([cat]) => `- ${cat}`).join('\n') || '- To be identified after analysis'}

### Trending Visual Elements
${sortedElements.slice(0, 5).map(([elem]) => `- ${elem}`).join('\n') || '- To be identified after analysis'}

---

*Data generated from visual pattern analysis*
`
}

/**
 * Main analysis function
 */
async function main(): Promise<void> {
  console.log('=== Visual Analyzer ===\n')

  if (DRY_RUN) {
    console.log('[DRY RUN MODE - no files will be saved]\n')
  }

  // Load LinkedIn posts
  console.log('Loading LinkedIn posts...')
  const posts = loadLinkedInPosts()
  console.log(`  Found ${posts.length} total posts`)
  console.log(`  Posts with images: ${posts.filter(p => p.hasImage).length}`)

  if (posts.length === 0) {
    console.log('\nNo posts to analyze. Run LinkedIn collection first:')
    console.log('  npx tsx automation/intel/linkedin-collector.ts')
    return
  }

  // Analyze visual patterns
  console.log('\nAnalyzing visual patterns...')
  const patterns = analyzeVisualPatterns(posts)

  // Generate reports
  console.log('Generating reports...')
  const competitorAudit = generateCompetitorAudit(posts)
  const engagementReport = generateEngagementReport(patterns)

  if (!DRY_RUN) {
    // Ensure output directory
    ensureOutputDir()

    // Save outputs
    writeFileSync(STYLE_PATTERNS_FILE, JSON.stringify(patterns, null, 2))
    console.log(`  Saved ${STYLE_PATTERNS_FILE}`)

    writeFileSync(COMPETITOR_AUDIT_FILE, competitorAudit)
    console.log(`  Saved ${COMPETITOR_AUDIT_FILE}`)

    writeFileSync(ENGAGEMENT_BY_STYLE_FILE, engagementReport)
    console.log(`  Saved ${ENGAGEMENT_BY_STYLE_FILE}`)
  } else {
    console.log('\n[DRY RUN] Would save:')
    console.log(`  - ${STYLE_PATTERNS_FILE}`)
    console.log(`  - ${COMPETITOR_AUDIT_FILE}`)
    console.log(`  - ${ENGAGEMENT_BY_STYLE_FILE}`)
  }

  // Summary
  console.log('\n=== Analysis Summary ===')
  console.log(`Images analyzed: ${patterns.metadata.imagesAnalyzed}`)
  console.log(`Style categories detected: ${Object.entries(patterns.styleClassifications).filter(([, d]) => d.count > 0).length}`)
  console.log(`Visual elements detected: ${Object.entries(patterns.elementFrequency).filter(([, c]) => c > 0).length}`)

  // Top findings
  const topStyle = Object.entries(patterns.styleClassifications)
    .filter(([, d]) => d.count > 0)
    .sort((a, b) => (b[1].avgEngagement || 0) - (a[1].avgEngagement || 0))[0]

  const topElement = Object.entries(patterns.elementFrequency)
    .sort((a, b) => b[1] - a[1])[0]

  if (topStyle) {
    console.log(`\nTop performing style: ${topStyle[0]} (avg engagement: ${topStyle[1].avgEngagement})`)
  }
  if (topElement && topElement[1] > 0) {
    console.log(`Most common element: ${topElement[0]} (${topElement[1]} occurrences)`)
  }
}

// Run
main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
