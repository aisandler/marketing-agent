#!/usr/bin/env npx tsx
/**
 * Intelligence Synthesis Pipeline
 *
 * Combines all intelligence sources (LinkedIn, Twitter, visual analysis)
 * into a single actionable format for image generation.
 *
 * Usage:
 *   npx tsx automation/intel/synthesize.ts              # Generate synthesis
 *   npx tsx automation/intel/synthesize.ts --dry-run   # Preview without saving
 *   npx tsx automation/intel/synthesize.ts --verbose   # Show detailed processing
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Input paths
const LINKEDIN_POSTS_FILE = join(__dirname, '../../docs/intelligence/linkedin/competitor-posts.json')
const TWITTER_THEMES_FILE = join(__dirname, '../../docs/intelligence/twitter/industry-themes.json')
const STYLE_PATTERNS_FILE = join(__dirname, '../../docs/intelligence/visuals/style-patterns.json')

// Output path
const OUTPUT_DIR = join(__dirname, '../../docs/intelligence/synthesis')
const SYNTHESIS_FILE = join(OUTPUT_DIR, 'image-generation-intel.json')

// CLI arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const VERBOSE = args.includes('--verbose')

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

interface LinkedInData {
  metadata: {
    lastCollected: string | null
  }
  competitors: Record<string, { posts: LinkedInPost[] }>
}

interface TwitterTheme {
  id: string
  theme: string
  category: string
  mentions: number
  sentiment: 'positive' | 'neutral' | 'negative'
  relevance: 'high' | 'medium' | 'low'
}

interface TwitterData {
  metadata: {
    lastCollected: string | null
  }
  categories: Record<string, { themes: TwitterTheme[] }>
  trendingTopics: TwitterTheme[]
}

interface StylePatternsData {
  metadata: {
    lastAnalyzed: string | null
    imagesAnalyzed: number
  }
  styleClassifications: Record<string, {
    count: number
    avgEngagement: number | null
    subtypes: Record<string, number>
  }>
  elementFrequency: Record<string, number>
}

interface SynthesisOutput {
  generatedAt: string
  staleAfterDays: number
  dataSourcesUsed: {
    linkedin: boolean
    twitter: boolean
    visualAnalysis: boolean
  }
  positivePromptEnhancements: string[]
  negativePromptAdditions: string[]
  styleGuidance: Record<string, {
    recommended: string
    avoid: string
  }>
  trendingVisualElements: string[]
  competitorGap: {
    opportunity: string
    differentiator: string
  }
  platformSpecific: Record<string, {
    aspectRatio: string
    style: string
    notes: string
  }>
  seasonalConsiderations: Record<string, string>
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

/**
 * Load LinkedIn data
 */
function loadLinkedInData(): LinkedInData | null {
  if (!existsSync(LINKEDIN_POSTS_FILE)) {
    console.log('  LinkedIn data: not found')
    return null
  }

  try {
    const data = JSON.parse(readFileSync(LINKEDIN_POSTS_FILE, 'utf-8'))
    const postCount = Object.values(data.competitors || {})
      .reduce((sum, c) => sum + ((c as any).posts?.length || 0), 0)
    console.log(`  LinkedIn data: ${postCount} posts`)
    return data
  } catch (error) {
    console.log(`  LinkedIn data: error loading - ${error}`)
    return null
  }
}

/**
 * Load Twitter data
 */
function loadTwitterData(): TwitterData | null {
  if (!existsSync(TWITTER_THEMES_FILE)) {
    console.log('  Twitter data: not found')
    return null
  }

  try {
    const data = JSON.parse(readFileSync(TWITTER_THEMES_FILE, 'utf-8'))
    const themeCount = Object.values(data.categories || {})
      .reduce((sum, c) => sum + ((c as any).themes?.length || 0), 0)
    console.log(`  Twitter data: ${themeCount} themes`)
    return data
  } catch (error) {
    console.log(`  Twitter data: error loading - ${error}`)
    return null
  }
}

/**
 * Load visual analysis data
 */
function loadVisualData(): StylePatternsData | null {
  if (!existsSync(STYLE_PATTERNS_FILE)) {
    console.log('  Visual analysis: not found')
    return null
  }

  try {
    const data = JSON.parse(readFileSync(STYLE_PATTERNS_FILE, 'utf-8'))
    console.log(`  Visual analysis: ${data.metadata?.imagesAnalyzed || 0} images analyzed`)
    return data
  } catch (error) {
    console.log(`  Visual analysis: error loading - ${error}`)
    return null
  }
}

/**
 * Extract high-engagement patterns from LinkedIn
 */
function extractLinkedInInsights(data: LinkedInData): {
  highEngagementStyles: string[]
  avoidStyles: string[]
  topics: string[]
} {
  const allPosts: LinkedInPost[] = []
  for (const competitor of Object.values(data.competitors || {})) {
    allPosts.push(...((competitor as any).posts || []))
  }

  const postsWithImages = allPosts.filter(p => p.hasImage)

  // Calculate engagement threshold (top 25%)
  const engagements = postsWithImages.map(p =>
    p.engagement.likes + (p.engagement.comments * 3) + (p.engagement.shares * 5)
  )
  engagements.sort((a, b) => b - a)
  const threshold = engagements[Math.floor(engagements.length * 0.25)] || 0

  // Get high-engagement posts
  const highEngagement = postsWithImages.filter(p =>
    (p.engagement.likes + (p.engagement.comments * 3) + (p.engagement.shares * 5)) >= threshold
  )

  // Extract common themes from high-engagement posts
  const highEngagementStyles: string[] = []

  for (const post of highEngagement) {
    if (post.imageDescription) {
      const desc = post.imageDescription.toLowerCase()
      if (desc.includes('architectural') || desc.includes('building')) {
        highEngagementStyles.push('architectural photography')
      }
      if (desc.includes('data') || desc.includes('chart')) {
        highEngagementStyles.push('data visualization')
      }
      if (desc.includes('modern') || desc.includes('minimal')) {
        highEngagementStyles.push('modern minimalist aesthetic')
      }
    }
  }

  // Extract topics
  const topics = [...new Set(allPosts.flatMap(p => p.topics))]

  return {
    highEngagementStyles: [...new Set(highEngagementStyles)],
    avoidStyles: ['generic stock photo', 'dated design', 'amateur quality'],
    topics,
  }
}

/**
 * Extract trending themes from Twitter
 */
function extractTwitterInsights(data: TwitterData): {
  trendingTopics: string[]
  contentOpportunities: string[]
} {
  const allThemes: TwitterTheme[] = []
  for (const category of Object.values(data.categories || {})) {
    allThemes.push(...((category as any).themes || []))
  }
  allThemes.push(...(data.trendingTopics || []))

  // High relevance, positive or neutral themes
  const goodThemes = allThemes
    .filter(t => t.relevance === 'high' && t.sentiment !== 'negative')
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 10)

  return {
    trendingTopics: goodThemes.map(t => t.theme),
    contentOpportunities: goodThemes
      .filter(t => t.relevance === 'high')
      .slice(0, 5)
      .map(t => t.theme),
  }
}

/**
 * Extract visual insights from style patterns
 */
function extractVisualInsights(data: StylePatternsData): {
  topStyles: string[]
  topElements: string[]
  styleToAvoid: string[]
} {
  // Sort by engagement
  const sortedStyles = Object.entries(data.styleClassifications || {})
    .filter(([, d]) => d.count > 0)
    .sort((a, b) => (b[1].avgEngagement || 0) - (a[1].avgEngagement || 0))

  // Sort elements by frequency
  const sortedElements = Object.entries(data.elementFrequency || {})
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  return {
    topStyles: sortedStyles.slice(0, 3).map(([style]) => style),
    topElements: sortedElements.slice(0, 5).map(([element]) => element),
    styleToAvoid: sortedStyles.slice(-2).map(([style]) => style),
  }
}

/**
 * Generate synthesis output
 */
function generateSynthesis(
  linkedIn: LinkedInData | null,
  twitter: TwitterData | null,
  visual: StylePatternsData | null
): SynthesisOutput {
  // Extract insights from each source
  const linkedInInsights = linkedIn ? extractLinkedInInsights(linkedIn) : null
  const twitterInsights = twitter ? extractTwitterInsights(twitter) : null
  const visualInsights = visual ? extractVisualInsights(visual) : null

  // Build positive enhancements
  const positiveEnhancements = [
    'professional quality imagery',
    'premium editorial photography style',
    'modern minimalist aesthetic',
    'clean composition',
  ]

  if (linkedInInsights?.highEngagementStyles) {
    positiveEnhancements.push(...linkedInInsights.highEngagementStyles.slice(0, 2))
  }

  if (visualInsights?.topStyles) {
    positiveEnhancements.push(...visualInsights.topStyles.map(s => `${s} style`))
  }

  // Build negative additions
  const negativeAdditions = [
    'generic stock photo aesthetic',
    'corporate sterile look',
    'dated design elements',
    'amateur quality',
    'clipart style',
  ]

  if (linkedInInsights?.avoidStyles) {
    negativeAdditions.push(...linkedInInsights.avoidStyles)
  }

  if (visualInsights?.styleToAvoid) {
    negativeAdditions.push(...visualInsights.styleToAvoid.map(s => `${s} imagery`))
  }

  // Build trending elements
  const trendingElements = [
    'architectural detail shots',
    'premium data visualizations',
    'clean typography overlays',
    'sophisticated color gradients',
  ]

  if (visualInsights?.topElements) {
    trendingElements.push(...visualInsights.topElements)
  }

  if (twitterInsights?.trendingTopics) {
    // Add relevant trending topics as visual themes
    const visualTopics = twitterInsights.trendingTopics
      .filter(t => t.toLowerCase().includes('design') ||
                   t.toLowerCase().includes('visual') ||
                   t.toLowerCase().includes('image'))
    trendingElements.push(...visualTopics.slice(0, 3))
  }

  // Determine competitor gap
  const hasRealData = linkedIn || twitter || visual
  const competitorGap = hasRealData
    ? {
        opportunity: 'Competitors rely heavily on generic stock imagery - differentiate with premium, branded visuals',
        differentiator: 'Consistent modern aesthetic with professional sophistication and data-driven visuals',
      }
    : {
        opportunity: 'Most competitors use generic stock imagery - differentiate with premium, modern visual identity',
        differentiator: 'Consistent brand aesthetic with professional sophistication and modern minimalism',
      }

  return {
    generatedAt: new Date().toISOString(),
    staleAfterDays: 7,
    dataSourcesUsed: {
      linkedin: !!linkedIn,
      twitter: !!twitter,
      visualAnalysis: !!visual,
    },
    positivePromptEnhancements: [...new Set(positiveEnhancements)],
    negativePromptAdditions: [...new Set(negativeAdditions)],
    styleGuidance: {
      professional: {
        recommended: 'architectural photography, data visualization, premium editorial style',
        avoid: 'generic office imagery, handshake stock photos, overused cliches',
      },
      casual: {
        recommended: 'warm aesthetics, approachable professionalism, human elements',
        avoid: 'cold corporate imagery, overly formal compositions',
      },
      announcement: {
        recommended: 'celebration elements, milestone markers, achievement visuals',
        avoid: 'generic congratulations graphics, overused stock imagery',
      },
      thoughtLeadership: {
        recommended: 'sophisticated data viz, editorial portrait style, modern typography',
        avoid: 'busy infographics, dated design trends, generic business imagery',
      },
    },
    trendingVisualElements: [...new Set(trendingElements)],
    competitorGap,
    platformSpecific: {
      linkedin: {
        aspectRatio: '1.91:1 or 1:1',
        style: 'professional, sophisticated',
        notes: 'Data-driven visuals perform well',
      },
      instagram: {
        aspectRatio: '1:1 or 4:5',
        style: 'visually striking, scroll-stopping',
        notes: 'High contrast and bold elements',
      },
      twitter: {
        aspectRatio: '16:9 or 1:1',
        style: 'clean, quick to parse',
        notes: 'Text should be readable at small sizes',
      },
    },
    seasonalConsiderations: {
      q1: 'New year themes, fresh starts, planning ahead',
      q2: 'Spring activity, growth themes',
      q3: 'Mid-year reviews, summer themes',
      q4: 'Year-end reviews, holiday themes, planning ahead',
    },
  }
}

/**
 * Main synthesis function
 */
async function main(): Promise<void> {
  console.log('=== Intelligence Synthesis Pipeline ===\n')

  if (DRY_RUN) {
    console.log('[DRY RUN MODE - no files will be saved]\n')
  }

  // Load all data sources
  console.log('Loading data sources...')
  const linkedIn = loadLinkedInData()
  const twitter = loadTwitterData()
  const visual = loadVisualData()

  const sourcesUsed = [linkedIn, twitter, visual].filter(Boolean).length
  console.log(`\nData sources available: ${sourcesUsed}/3`)

  if (sourcesUsed === 0) {
    console.log('\nNo data sources found. Run collection first:')
    console.log('  npx tsx automation/intel/linkedin-collector.ts')
    console.log('  npx tsx automation/intel/twitter-collector.ts')
    console.log('  npx tsx automation/intel/visual-analyzer.ts')
    console.log('\nGenerating synthesis with default values...')
  }

  // Generate synthesis
  console.log('\nGenerating synthesis...')
  const synthesis = generateSynthesis(linkedIn, twitter, visual)

  if (VERBOSE) {
    console.log('\n--- Synthesis Preview ---')
    console.log(`Positive enhancements: ${synthesis.positivePromptEnhancements.length}`)
    synthesis.positivePromptEnhancements.forEach(e => console.log(`  + ${e}`))
    console.log(`\nNegative additions: ${synthesis.negativePromptAdditions.length}`)
    synthesis.negativePromptAdditions.forEach(e => console.log(`  - ${e}`))
    console.log(`\nTrending elements: ${synthesis.trendingVisualElements.length}`)
    synthesis.trendingVisualElements.forEach(e => console.log(`  * ${e}`))
  }

  if (!DRY_RUN) {
    // Ensure output directory
    ensureOutputDir()

    // Save synthesis
    writeFileSync(SYNTHESIS_FILE, JSON.stringify(synthesis, null, 2))
    console.log(`\nSaved to ${SYNTHESIS_FILE}`)
  } else {
    console.log('\n[DRY RUN] Would save to:')
    console.log(`  ${SYNTHESIS_FILE}`)
  }

  // Summary
  console.log('\n=== Synthesis Summary ===')
  console.log(`Generated at: ${synthesis.generatedAt}`)
  console.log(`Stale after: ${synthesis.staleAfterDays} days`)
  console.log(`Data sources: ${[
    synthesis.dataSourcesUsed.linkedin ? 'LinkedIn' : null,
    synthesis.dataSourcesUsed.twitter ? 'Twitter' : null,
    synthesis.dataSourcesUsed.visualAnalysis ? 'Visual' : null,
  ].filter(Boolean).join(', ') || 'None (using defaults)'}`)
  console.log(`Positive enhancements: ${synthesis.positivePromptEnhancements.length}`)
  console.log(`Negative additions: ${synthesis.negativePromptAdditions.length}`)
  console.log(`Style guides: ${Object.keys(synthesis.styleGuidance).length} content types`)
  console.log(`Trending elements: ${synthesis.trendingVisualElements.length}`)

  console.log('\nIntelligence ready for image generation!')
  console.log('Run: npx tsx automation/image-generation/generate-images.ts --dry-run')
}

// Run
main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
