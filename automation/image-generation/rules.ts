/**
 * Image Generation Rules & Configuration
 *
 * Cost: ~$0.14 per generation via OpenRouter/Gemini
 *
 * GENERATION IS ALWAYS MANUAL - never auto-triggered on content push
 *
 * Brand configuration is loaded from config/brand.json
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import type { BrandConfig } from './types'

// Load brand configuration from config/brand.json
function loadBrandConfig(): BrandConfig {
  const configPath = resolve(__dirname, '../../config/brand.json')

  if (!existsSync(configPath)) {
    console.warn('Warning: config/brand.json not found, using defaults')
    return {
      name: 'Brand',
      colors: {
        primary: '#1a365d',
        secondary: '#c9a227',
        _names: { primary: 'navy', secondary: 'gold' }
      },
      imageStyleDirective: 'sophisticated minimal professional aesthetic, modern professional style, clean composition, no people, no faces'
    }
  }

  try {
    const content = readFileSync(configPath, 'utf-8')
    return JSON.parse(content) as BrandConfig
  } catch (error) {
    console.warn('Warning: Could not parse config/brand.json, using defaults')
    return {
      name: 'Brand',
      colors: {
        primary: '#1a365d',
        secondary: '#c9a227',
        _names: { primary: 'navy', secondary: 'gold' }
      },
      imageStyleDirective: 'sophisticated minimal professional aesthetic, modern professional style, clean composition, no people, no faces'
    }
  }
}

// Load brand config at module initialization
const brandConfig = loadBrandConfig()

export const GENERATION_RULES = {
  // Cost per image generation (USD)
  costPerImage: 0.14,

  // Never auto-generate - always require explicit CLI command
  autoGenerate: false,

  // Skip these post types entirely
  skipPostTypes: ['Repost', 'Link Share'],

  // Skip these Image Source values (already handled)
  skipImageSources: ['Requires Real Video', 'Received', 'Manual Upload'],

  // Platforms where images are optional (copy-only acceptable)
  copyOnlyPlatforms: ['LinkedIn'],

  // Platforms where images are strongly recommended
  imageRecommendedPlatforms: ['Instagram'],

  // Minimum brief length to attempt generation
  minBriefLength: 30,

  // Maximum generations per batch (safety throttle)
  maxBatchSize: 10,
}

/**
 * Prompt Safety Rules
 * These terms are automatically filtered from prompts or cause skips
 */
export const PROMPT_RULES = {
  // Terms to REMOVE from prompts (replaced with alternatives)
  termReplacements: {
    'person': 'figure silhouette',
    'people': 'abstract figures',
    'man': 'professional silhouette',
    'woman': 'professional silhouette',
    'face': 'abstract form',
    'portrait': 'professional graphic',
    'headshot': 'abstract professional icon',
    'broker': 'professional silhouette',
    'attorney': 'professional silhouette',
    'client': 'abstract figure',
    'meeting': 'conference setting',
    'handshake': 'partnership symbol',
  },

  // Terms that should SKIP generation entirely (needs real photo/video)
  skipTerms: [
    'photo of',
    'photograph',
    'real person',
    'actual photo',
    'headshot',
    'team photo',
    'group photo',
  ],

  // Required style elements to append if missing
  requiredStyleElements: [
    'no people',
    'no faces',
    'no human figures',
  ],

  // Brand colors loaded from config
  brandColors: brandConfig.colors,

  // Brand style directive loaded from config
  brandStyleDirective: brandConfig.imageStyleDirective,

  // Negative prompts to avoid stock photo clichés
  negativePrompts: [
    'cartoon',
    'clipart',
    'stock photo look',
    'generic business imagery',
    'dated design',
    'amateur',
    'cluttered',
    'old-fashioned',
    'generic magnifying glass',
    'handshake stock photo',
  ],
}

/**
 * Apply prompt safety rules
 * Returns sanitized prompt or null if should skip
 *
 * @param brief - The image brief to sanitize
 * @param dynamicNegatives - Additional negative prompts from live feedback
 */
export function sanitizePrompt(
  brief: string,
  dynamicNegatives: string[] = []
): string | null {
  let sanitized = brief.toLowerCase()

  // Check for skip terms - these need real photos, not AI
  for (const term of PROMPT_RULES.skipTerms) {
    if (sanitized.includes(term)) {
      return null // Skip this generation
    }
  }

  // Apply term replacements
  for (const [term, replacement] of Object.entries(PROMPT_RULES.termReplacements)) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi')
    sanitized = brief.replace(regex, replacement)
  }

  // Combine static and dynamic negative prompts
  const allNegatives = [
    ...PROMPT_RULES.negativePrompts,
    ...dynamicNegatives,
  ]
  // Deduplicate
  const uniqueNegatives = Array.from(new Set(allNegatives))

  // Check if brief already has full styling (from image briefs file)
  const hasFullStyling = sanitized.includes(brandConfig.colors.primary) ||
    sanitized.includes(brandConfig.colors._names?.primary || '') ||
    sanitized.includes('--style')

  if (hasFullStyling) {
    // Brief already has brand styling - just ensure no people directive
    if (!sanitized.includes('no people') && !sanitized.includes('no human')) {
      sanitized += ', no people, no faces'
    }
    // Still add dynamic negatives if present
    if (dynamicNegatives.length > 0) {
      sanitized += `. Avoid: ${dynamicNegatives.join(', ')}`
    }
  } else {
    // Apply full brand style directive with all negatives
    sanitized += `. Style: ${PROMPT_RULES.brandStyleDirective}. Avoid: ${uniqueNegatives.slice(0, 8).join(', ')}`
  }

  return sanitized
}

/**
 * Check if a record should be skipped based on rules
 */
export function shouldSkipRecord(record: {
  postType?: string
  imageSource?: string
  platform?: string
  imageBrief?: string
}): { skip: boolean; reason?: string } {
  // Skip reposts and link shares
  if (record.postType && GENERATION_RULES.skipPostTypes.includes(record.postType)) {
    return { skip: true, reason: `Post type "${record.postType}" doesn't need images` }
  }

  // Skip if already has image source handled elsewhere
  if (record.imageSource && GENERATION_RULES.skipImageSources.includes(record.imageSource)) {
    return { skip: true, reason: `Image source "${record.imageSource}" handled separately` }
  }

  // Skip if brief is too short
  if (record.imageBrief && record.imageBrief.length < GENERATION_RULES.minBriefLength) {
    return { skip: true, reason: `Brief too short (${record.imageBrief.length} chars, min ${GENERATION_RULES.minBriefLength})` }
  }

  // Check if brief contains skip terms
  if (record.imageBrief) {
    const sanitized = sanitizePrompt(record.imageBrief)
    if (sanitized === null) {
      return { skip: true, reason: 'Brief requires real photo/video, not AI generation' }
    }
  }

  return { skip: false }
}

/**
 * Format cost for display
 */
export function formatCost(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/**
 * Calculate batch cost estimate
 */
export function estimateBatchCost(count: number): string {
  const total = count * GENERATION_RULES.costPerImage
  return formatCost(total)
}

/**
 * Get the loaded brand configuration
 */
export function getBrandConfig(): BrandConfig {
  return brandConfig
}
