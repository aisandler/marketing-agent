#!/usr/bin/env npx tsx
/**
 * Image Generation CLI
 *
 * Cost: ~$0.14 per generation via OpenRouter/Gemini
 * NEVER auto-generates - always requires explicit CLI command
 *
 * Usage:
 *   npx tsx automation/image-generation/generate-images.ts           # Process all pending
 *   npx tsx automation/image-generation/generate-images.ts --dry-run # Preview with cost estimate
 *   npx tsx automation/image-generation/generate-images.ts --status  # Show queue status
 *   npx tsx automation/image-generation/generate-images.ts --costs   # Show cost report
 *   npx tsx automation/image-generation/generate-images.ts --record recXXX  # Single record
 *   npx tsx automation/image-generation/generate-images.ts --limit 5 # Limit batch size
 */

import {
  fetchRecordsNeedingImages,
  fetchRecord,
  uploadImageDirectly,
  updateImageMetadata,
  listRecordsWithImageStatus
} from './airtable-client'
import { generateImage, sleep, withRetry } from './openrouter-client'
import { saveToTempFile } from './image-storage'
import type { ProcessResult, BatchSummary, AirtableRecord } from './types'
import {
  GENERATION_RULES,
  shouldSkipRecord,
  sanitizePrompt,
  estimateBatchCost,
  formatCost,
  getBrandConfig
} from './rules'
import { logGeneration, printCostReport, getCurrentMonthCost } from './cost-tracker'
import { fetchLiveFeedback, type FeedbackData } from './feedback-client'

// Global feedback data - fetched once per batch
let liveFeedback: FeedbackData | null = null

// Parse CLI arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const STATUS_ONLY = args.includes('--status')
const COSTS_ONLY = args.includes('--costs')
const SAVE_LOCAL = args.includes('--save-local')
const FORCE = args.includes('--force') // Skip rule checks (use with caution)

// Parse --limit flag
function parseLimitArg(): number {
  const equalsSyntax = args.find(a => a.startsWith('--limit='))
  if (equalsSyntax) return parseInt(equalsSyntax.split('=')[1]) || 0

  const flagIndex = args.indexOf('--limit')
  if (flagIndex !== -1 && args[flagIndex + 1] && !args[flagIndex + 1].startsWith('--')) {
    return parseInt(args[flagIndex + 1]) || 0
  }
  return 0
}
const LIMIT = parseLimitArg()

// Parse --record flag
function parseRecordArg(): string | undefined {
  const equalsSyntax = args.find(a => a.startsWith('--record='))
  if (equalsSyntax) return equalsSyntax.split('=')[1]

  const flagIndex = args.indexOf('--record')
  if (flagIndex !== -1 && args[flagIndex + 1] && !args[flagIndex + 1].startsWith('--')) {
    return args[flagIndex + 1]
  }
  return undefined
}
const SINGLE_RECORD = parseRecordArg()

// Rate limiting: 2 seconds between API calls
const RATE_LIMIT_MS = 2000

async function processRecord(record: AirtableRecord): Promise<ProcessResult> {
  const recordId = record.id
  const postTopic = record.fields['Post Topic'] || '(untitled)'
  const postingAccount = record.fields['Posting Account'] || ''
  const platform = record.fields.Platform || ''
  const imageBrief = record.fields['Image Brief']

  // Check rules (unless --force)
  if (!FORCE) {
    const ruleCheck = shouldSkipRecord({
      postType: record.fields['Post Type'],
      imageSource: record.fields['Image Source'],
      platform: platform,
      imageBrief: imageBrief,
    })

    if (ruleCheck.skip) {
      console.log(`  ⊘ Skipped: ${ruleCheck.reason}`)
      return {
        recordId,
        postTopic,
        success: false,
        error: `Skipped: ${ruleCheck.reason}`,
      }
    }
  }

  if (!imageBrief) {
    return {
      recordId,
      postTopic,
      success: false,
      error: 'No image brief',
    }
  }

  // Get dynamic negative prompts from live feedback
  const dynamicNegatives = liveFeedback?.negativePrompts || []

  // Sanitize prompt (remove people, add safety directives, apply feedback)
  const sanitizedBrief = sanitizePrompt(imageBrief, dynamicNegatives)
  if (!sanitizedBrief) {
    const error = 'Brief requires real photo/video - skipping AI generation'
    logGeneration({
      timestamp: new Date().toISOString(),
      recordId,
      postTopic,
      postingAccount,
      platform,
      costUsd: 0,
      success: false,
      error,
      feedbackApplied: dynamicNegatives,
    })
    return {
      recordId,
      postTopic,
      success: false,
      error,
    }
  }

  try {
    console.log(`\n  Generating image...`)
    console.log(`  (Using sanitized prompt - no people/faces)`)
    if (dynamicNegatives.length > 0) {
      console.log(`  [Feedback] Applying ${dynamicNegatives.length} learned avoidances: ${dynamicNegatives.join(', ')}`)
    }

    // Generate image via OpenRouter/Gemini
    const image = await withRetry(() => generateImage(sanitizedBrief))

    console.log(`  Generated ${image.mimeType} image (${Math.round(image.base64Data.length / 1024)}KB)`)

    // Save locally if requested (for debugging)
    if (SAVE_LOCAL) {
      const sanitizedTopic = postTopic.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50)
      const localPath = saveToTempFile(image, `${recordId}-${sanitizedTopic}`)
      console.log(`  Saved locally: ${localPath}`)
    }

    // Upload directly to Airtable
    const filename = `${recordId}-${Date.now()}.png`
    const imageBuffer = Buffer.from(image.base64Data, 'base64')

    console.log(`  Uploading to Airtable...`)
    await withRetry(() => uploadImageDirectly(recordId, imageBuffer, image.mimeType, filename))

    // Update metadata fields
    await updateImageMetadata(recordId)

    console.log(`  ✓ Complete (${formatCost(GENERATION_RULES.costPerImage)})`)

    // Log successful generation
    logGeneration({
      timestamp: new Date().toISOString(),
      recordId,
      postTopic,
      postingAccount,
      platform,
      costUsd: GENERATION_RULES.costPerImage,
      success: true,
      feedbackApplied: dynamicNegatives,
    })

    return {
      recordId,
      postTopic,
      success: true,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(`  ✗ Error: ${message}`)

    // Log failed generation (no cost charged on failure)
    logGeneration({
      timestamp: new Date().toISOString(),
      recordId,
      postTopic,
      postingAccount,
      platform,
      costUsd: 0,
      success: false,
      error: message,
      feedbackApplied: dynamicNegatives,
    })

    return {
      recordId,
      postTopic,
      success: false,
      error: message,
    }
  }
}

async function main(): Promise<void> {
  const brandConfig = getBrandConfig()
  console.log(`=== ${brandConfig.name} Image Generation ===`)
  console.log(`Cost per image: ${formatCost(GENERATION_RULES.costPerImage)}`)
  console.log(`This month so far: ${formatCost(getCurrentMonthCost())}\n`)

  // Cost report mode
  if (COSTS_ONLY) {
    printCostReport()
    return
  }

  // Status check mode
  if (STATUS_ONLY) {
    await listRecordsWithImageStatus()
    return
  }

  // Fetch live feedback from partner portal (for dynamic prompt adjustment)
  console.log('Fetching partner feedback for prompt optimization...')
  liveFeedback = await fetchLiveFeedback()
  if (liveFeedback) {
    console.log(`  Approval rate: ${liveFeedback.stats.approvalRate}%`)
    if (liveFeedback.negativePrompts.length > 0) {
      console.log(`  Active avoidances: ${liveFeedback.negativePrompts.join(', ')}`)
    } else {
      console.log(`  No recurring rejection themes detected yet`)
    }
  } else {
    console.log('  Using static rules only (portal not available)')
  }
  console.log('')

  // Fetch records to process
  let records: AirtableRecord[]

  if (SINGLE_RECORD) {
    console.log(`Fetching single record: ${SINGLE_RECORD}`)
    const record = await fetchRecord(SINGLE_RECORD)
    records = [record]
  } else {
    console.log('Fetching records needing images...')
    records = await fetchRecordsNeedingImages()
  }

  if (records.length === 0) {
    console.log('\nNo records found needing image generation.')
    return
  }

  // Filter records based on rules (unless processing single record with --force)
  if (!SINGLE_RECORD || !FORCE) {
    const originalCount = records.length
    records = records.filter(r => {
      const check = shouldSkipRecord({
        postType: r.fields['Post Type'],
        imageSource: r.fields['Image Source'],
        platform: r.fields.Platform,
        imageBrief: r.fields['Image Brief'],
      })
      return !check.skip
    })

    if (records.length < originalCount) {
      console.log(`Filtered: ${originalCount - records.length} records skipped by rules`)
    }
  }

  // Apply batch size limit from rules
  const effectiveLimit = LIMIT > 0 ? Math.min(LIMIT, GENERATION_RULES.maxBatchSize) : GENERATION_RULES.maxBatchSize
  if (records.length > effectiveLimit) {
    console.log(`Limiting to ${effectiveLimit} records (max batch size)`)
    records = records.slice(0, effectiveLimit)
  }

  console.log(`\nReady to process ${records.length} record(s)`)
  console.log(`Estimated cost: ${estimateBatchCost(records.length)}`)

  // Dry run mode
  if (DRY_RUN) {
    console.log('\n--- DRY RUN MODE ---')
    if (liveFeedback && liveFeedback.negativePrompts.length > 0) {
      console.log(`Feedback loop active: will apply avoidances for "${liveFeedback.negativePrompts.join('", "')}"`)
    }
    console.log('Would process the following records:\n')

    records.forEach((r, i) => {
      const brief = r.fields['Image Brief'] || ''
      const briefPreview = brief.length > 80 ? brief.substring(0, 80) + '...' : brief
      const sanitized = sanitizePrompt(brief)

      console.log(`${i + 1}. [${r.id}] ${r.fields['Post Topic'] || '(no topic)'}`)
      console.log(`   Date: ${r.fields.Date || 'not set'}`)
      console.log(`   Account: ${r.fields['Posting Account'] || 'not set'}`)
      console.log(`   Platform: ${r.fields.Platform || 'not set'}`)
      console.log(`   Brief: ${briefPreview}`)

      if (!sanitized) {
        console.log(`   Warning: Brief requires real photo - would be skipped`)
      } else if (sanitized !== brief) {
        console.log(`   Prompt will be sanitized (no people/faces)`)
      }
      console.log()
    })

    console.log(`Total estimated cost: ${estimateBatchCost(records.length)}`)
    console.log('\nRun without --dry-run to process these records.')
    return
  }

  // Confirm before processing (if more than 3 records)
  if (records.length > 3 && !FORCE) {
    console.log(`\nAbout to generate ${records.length} images (${estimateBatchCost(records.length)})`)
    console.log('Use --force to skip this warning, or --limit N to reduce batch size.\n')
  }

  // Process records
  const summary: BatchSummary = {
    total: records.length,
    successful: 0,
    failed: 0,
    skipped: 0,
    results: [],
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    console.log(`\n[${i + 1}/${records.length}] ${record.fields['Post Topic'] || '(no topic)'} (${record.id})`)

    const result = await processRecord(record)
    summary.results.push(result)

    if (result.success) {
      summary.successful++
    } else if (result.error?.startsWith('Skipped:') || result.error === 'No image brief') {
      summary.skipped++
    } else {
      summary.failed++
    }

    // Rate limiting between requests
    if (i < records.length - 1) {
      await sleep(RATE_LIMIT_MS)
    }
  }

  // Print summary
  console.log('\n=== Summary ===')
  console.log(`Total: ${summary.total}`)
  console.log(`Successful: ${summary.successful} (${formatCost(summary.successful * GENERATION_RULES.costPerImage)})`)
  console.log(`Failed: ${summary.failed}`)
  console.log(`Skipped: ${summary.skipped}`)

  if (summary.failed > 0) {
    console.log('\n--- Failed Records ---')
    summary.results
      .filter(r => !r.success && !r.error?.startsWith('Skipped:') && r.error !== 'No image brief')
      .forEach(r => {
        console.log(`  [${r.recordId}] ${r.postTopic}: ${r.error}`)
      })
  }

  // Feedback loop status
  if (liveFeedback) {
    console.log('\n--- Feedback Loop ---')
    console.log(`Partner approval rate: ${liveFeedback.stats.approvalRate}%`)
    console.log(`Themes applied this batch: ${liveFeedback.negativePrompts.length > 0 ? liveFeedback.negativePrompts.join(', ') : 'none'}`)
    console.log(`Total feedback data points: ${liveFeedback.stats.totalFeedback}`)
  }

  console.log(`\nThis month total: ${formatCost(getCurrentMonthCost())}`)
}

// Run
main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
