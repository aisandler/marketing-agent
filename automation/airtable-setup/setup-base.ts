#!/usr/bin/env npx tsx
/**
 * Airtable Auto-Setup CLI
 *
 * Sets up a new Airtable base with Content Calendar table
 * using the Airtable Meta API.
 *
 * Usage:
 *   npx tsx automation/airtable-setup/setup-base.ts --token patXXX
 *   npx tsx automation/airtable-setup/setup-base.ts --dry-run  # Preview without creating
 *   npx tsx automation/airtable-setup/setup-base.ts --base appXXX  # Add table to existing base
 *
 * Prerequisites:
 *   - Airtable Personal Access Token with schema:bases:write scope
 *   - config/brand.json and config/airtable.json configured
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Types for Airtable Meta API
interface AirtableFieldOptions {
  name: string
  type: string
  description?: string
  options?: Record<string, unknown>
}

interface AirtableTableSchema {
  name: string
  description?: string
  fields: AirtableFieldOptions[]
}

interface BrandConfig {
  name: string
  contentPillars?: string[]
  focusAreas?: string[]
}

interface AirtableConfig {
  tables: {
    contentCalendar: {
      name: string
      fields: Record<string, {
        name: string
        type: string
        options?: string[]
        required?: boolean
        default?: string
      }>
    }
  }
}

interface PartnersConfig {
  accounts: Record<string, string[]>
}

// Parse CLI arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')

function getArg(flag: string): string | undefined {
  const equalsSyntax = args.find(a => a.startsWith(`${flag}=`))
  if (equalsSyntax) return equalsSyntax.split('=')[1]

  const flagIndex = args.indexOf(flag)
  if (flagIndex !== -1 && args[flagIndex + 1] && !args[flagIndex + 1].startsWith('--')) {
    return args[flagIndex + 1]
  }
  return undefined
}

const TOKEN = getArg('--token') || process.env.AIRTABLE_API_KEY
const EXISTING_BASE_ID = getArg('--base')
const WORKSPACE_ID = getArg('--workspace')

// Load configurations
function loadConfig<T>(filename: string): T | null {
  const configPath = resolve(__dirname, `../../config/${filename}`)
  if (!existsSync(configPath)) {
    console.warn(`Warning: config/${filename} not found`)
    return null
  }
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8')) as T
  } catch {
    console.warn(`Warning: Could not parse config/${filename}`)
    return null
  }
}

const brandConfig = loadConfig<BrandConfig>('brand.json')
const airtableConfig = loadConfig<AirtableConfig>('airtable.json')
const partnersConfig = loadConfig<PartnersConfig>('partners.json')

// Build posting account options from partners config
function getPostingAccountOptions(): string[] {
  if (!partnersConfig?.accounts) {
    return ['Partner1 LinkedIn', 'Company LinkedIn']
  }
  // Flatten all posting accounts
  return Object.values(partnersConfig.accounts).flat()
}

// Build field schema for Content Calendar
function buildTableSchema(): AirtableTableSchema {
  const postingAccounts = getPostingAccountOptions()
  const contentPillars = brandConfig?.contentPillars || ['Pillar 1', 'Pillar 2', 'Pillar 3']
  const focusAreas = brandConfig?.focusAreas || ['Focus 1', 'Focus 2']

  return {
    name: 'Content Calendar',
    description: 'Social media content calendar with approval workflow',
    fields: [
      {
        name: 'Date',
        type: 'date',
        options: {
          dateFormat: { name: 'local' }
        }
      },
      {
        name: 'Post Topic',
        type: 'singleLineText',
        description: 'Brief description of the post topic'
      },
      {
        name: 'Posting Account',
        type: 'singleSelect',
        options: {
          choices: postingAccounts.map(name => ({ name }))
        }
      },
      {
        name: 'Platform',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'LinkedIn' },
            { name: 'Instagram' },
            { name: 'Facebook' },
            { name: 'X/Twitter' }
          ]
        }
      },
      {
        name: 'Post Type',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Original' },
            { name: 'Repost' },
            { name: 'Link Share' }
          ]
        }
      },
      {
        name: 'Content Pillar',
        type: 'singleSelect',
        options: {
          choices: contentPillars.map(name => ({ name }))
        }
      },
      {
        name: 'Focus',
        type: 'singleSelect',
        options: {
          choices: focusAreas.map(name => ({ name }))
        }
      },
      {
        name: 'Copy',
        type: 'multilineText',
        description: 'The actual post content/copy'
      },
      {
        name: 'Copy Status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Draft' },
            { name: 'Ready for Review' },
            { name: 'Approved' },
            { name: 'Needs Revision' }
          ]
        }
      },
      {
        name: 'Image Brief',
        type: 'multilineText',
        description: 'Brief for AI image generation'
      },
      {
        name: 'Image',
        type: 'multipleAttachments',
        description: 'Post image(s)'
      },
      {
        name: 'Image Source',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'AI Generated' },
            { name: 'Stock Photo' },
            { name: 'Manual Upload' },
            { name: 'Received' },
            { name: 'Requires Real Video' }
          ]
        }
      },
      {
        name: 'Asset Status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Needed' },
            { name: 'In Progress' },
            { name: 'Ready for Review' },
            { name: 'Approved' }
          ]
        }
      },
      {
        name: 'Post Status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Drafting' },
            { name: 'Ready for Review' },
            { name: 'Approved' },
            { name: 'Scheduled' },
            { name: 'Posted' },
            { name: 'Needs Revision' }
          ]
        }
      },
      {
        name: 'Notes',
        type: 'multilineText',
        description: 'Internal notes about this post'
      },
      {
        name: 'Source Post',
        type: 'multipleRecordLinks',
        description: 'Link to original post (for reposts)',
        options: {
          linkedTableId: 'self' // Will be updated after table creation
        }
      }
    ]
  }
}

// API Functions
async function createBase(name: string, workspaceId?: string): Promise<{ id: string; name: string }> {
  console.log(`Creating new base: "${name}"...`)

  const body: Record<string, unknown> = {
    name,
    tables: [buildTableSchema()]
  }

  if (workspaceId) {
    body.workspaceId = workspaceId
  }

  const response = await fetch('https://api.airtable.com/v0/meta/bases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create base: ${error}`)
  }

  const result = await response.json()
  return { id: result.id, name: result.name }
}

async function createTable(baseId: string, schema: AirtableTableSchema): Promise<{ id: string; name: string }> {
  console.log(`Creating table: "${schema.name}" in base ${baseId}...`)

  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schema),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create table: ${error}`)
  }

  const result = await response.json()
  return { id: result.id, name: result.name }
}

async function listBases(): Promise<Array<{ id: string; name: string }>> {
  const response = await fetch('https://api.airtable.com/v0/meta/bases', {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to list bases: ${error}`)
  }

  const result = await response.json()
  return result.bases || []
}

async function getBaseSchema(baseId: string): Promise<{ tables: Array<{ id: string; name: string }> }> {
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get base schema: ${error}`)
  }

  return response.json()
}

// Main execution
async function main(): Promise<void> {
  console.log('=== Airtable Auto-Setup ===\n')

  if (!TOKEN) {
    console.error('Error: No Airtable token provided.')
    console.error('Use --token patXXX or set AIRTABLE_API_KEY environment variable.')
    console.error('\nTo create a token:')
    console.error('1. Go to https://airtable.com/create/tokens')
    console.error('2. Create token with scopes: data.records:read, data.records:write, schema.bases:read, schema.bases:write')
    process.exit(1)
  }

  // Check config files
  console.log('Configuration:')
  console.log(`  Brand: ${brandConfig?.name || '(not configured)'}`)
  console.log(`  Content Pillars: ${brandConfig?.contentPillars?.join(', ') || '(defaults)'}`)
  console.log(`  Focus Areas: ${brandConfig?.focusAreas?.join(', ') || '(defaults)'}`)
  console.log(`  Posting Accounts: ${getPostingAccountOptions().join(', ')}`)
  console.log('')

  const tableSchema = buildTableSchema()

  if (DRY_RUN) {
    console.log('--- DRY RUN MODE ---\n')
    console.log('Would create the following table schema:\n')

    console.log(`Table: ${tableSchema.name}`)
    console.log(`Description: ${tableSchema.description}`)
    console.log('\nFields:')

    tableSchema.fields.forEach((field, i) => {
      console.log(`  ${i + 1}. ${field.name} (${field.type})`)
      if (field.options && 'choices' in field.options) {
        const choices = field.options.choices as Array<{ name: string }>
        console.log(`      Options: ${choices.map(c => c.name).join(', ')}`)
      }
    })

    console.log('\nRun without --dry-run to create the base/table.')
    return
  }

  // Variables to capture IDs across branches
  let createdBaseId: string | undefined
  let createdTableId: string | undefined

  try {
    if (EXISTING_BASE_ID) {
      // Add table to existing base
      console.log(`Adding table to existing base: ${EXISTING_BASE_ID}`)
      createdBaseId = EXISTING_BASE_ID

      // Check if Content Calendar already exists
      const schema = await getBaseSchema(EXISTING_BASE_ID)
      const existingTable = schema.tables.find(t => t.name === 'Content Calendar')

      if (existingTable) {
        console.log(`\nContent Calendar table already exists (${existingTable.id})`)
        createdTableId = existingTable.id
        console.log('Skipping table creation.')
      } else {
        const table = await createTable(EXISTING_BASE_ID, tableSchema)
        createdTableId = table.id
        console.log(`\nTable created successfully!`)
        console.log(`  Table ID: ${table.id}`)
        console.log(`  Table Name: ${table.name}`)

        console.log('\nAdd these to your .env file:')
        console.log(`  AIRTABLE_CONTENT_CALENDAR_TABLE_ID=${table.id}`)
      }

    } else {
      // Create new base
      const baseName = brandConfig?.name
        ? `${brandConfig.name} Marketing`
        : 'Marketing Content Calendar'

      const base = await createBase(baseName, WORKSPACE_ID)
      createdBaseId = base.id

      console.log(`\nBase created successfully!`)
      console.log(`  Base ID: ${base.id}`)
      console.log(`  Base Name: ${base.name}`)

      // Get the table ID
      const schema = await getBaseSchema(base.id)
      const contentCalendar = schema.tables.find(t => t.name === 'Content Calendar')
      createdTableId = contentCalendar?.id

      console.log('\nAdd these to your .env file:')
      console.log(`  AIRTABLE_BASE_ID=${base.id}`)
      if (contentCalendar) {
        console.log(`  AIRTABLE_CONTENT_CALENDAR_TABLE_ID=${contentCalendar.id}`)
      }
    }

    console.log('\n=== API Setup Complete ===')

    // Offer browser setup for views and formatting
    if (createdBaseId && createdTableId) {
      console.log('\n--- Next Step: View Configuration ---')
      console.log('The API created your table, but views require browser setup.')
      console.log('\nOptions:')
      console.log('  1. Browser automation (requires Playwright):')
      console.log(`     npx tsx automation/airtable-setup/browser-setup.ts --base ${createdBaseId} --table ${createdTableId}`)
      console.log('')
      console.log('  2. Guided browser mode (step-by-step):')
      console.log(`     npx tsx automation/airtable-setup/browser-setup.ts --base ${createdBaseId} --table ${createdTableId} --guided`)
      console.log('')
      console.log('  3. Manual instructions:')
      console.log(`     npx tsx automation/airtable-setup/browser-setup.ts --manual`)
      console.log('')
      console.log('  4. Open in browser now:')
      console.log(`     open "https://airtable.com/${createdBaseId}/${createdTableId}"`)

      // Auto-open in browser if --open flag
      if (args.includes('--open')) {
        const { exec } = await import('child_process')
        const url = `https://airtable.com/${createdBaseId}/${createdTableId}`
        console.log(`\nOpening ${url}...`)
        exec(`open "${url}"`)
      }
    }

    console.log('\nSetup complete!')

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`\nError: ${message}`)

    if (message.includes('401') || message.includes('403')) {
      console.error('\nYour token may not have the required scopes.')
      console.error('Required scopes: schema.bases:read, schema.bases:write')
    }

    process.exit(1)
  }
}

// Run
main()
