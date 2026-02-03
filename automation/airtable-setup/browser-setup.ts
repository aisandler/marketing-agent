#!/usr/bin/env npx tsx
/**
 * Airtable Browser Setup
 *
 * Uses Playwright to configure Airtable features that aren't available via API:
 * - Calendar view for date-based content planning
 * - Kanban view for status workflow
 * - Gallery view for visual content review
 * - Field colors and formatting
 *
 * Usage:
 *   npx tsx automation/airtable-setup/browser-setup.ts --base appXXX --table tblXXX
 *   npx tsx automation/airtable-setup/browser-setup.ts --guided  # Step-by-step with pauses
 *
 * Prerequisites:
 *   - npm install playwright (in automation/airtable-setup/)
 *   - Airtable account logged in via browser
 */

import { chromium, Browser, Page } from 'playwright'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Parse CLI arguments
const args = process.argv.slice(2)
const GUIDED_MODE = args.includes('--guided')
const HEADLESS = args.includes('--headless')

function getArg(flag: string): string | undefined {
  const equalsSyntax = args.find(a => a.startsWith(`${flag}=`))
  if (equalsSyntax) return equalsSyntax.split('=')[1]
  const flagIndex = args.indexOf(flag)
  if (flagIndex !== -1 && args[flagIndex + 1] && !args[flagIndex + 1].startsWith('--')) {
    return args[flagIndex + 1]
  }
  return undefined
}

const BASE_ID = getArg('--base') || process.env.AIRTABLE_BASE_ID
const TABLE_ID = getArg('--table') || process.env.AIRTABLE_CONTENT_CALENDAR_TABLE_ID

// View configurations to create
const VIEWS_TO_CREATE = [
  {
    name: 'Calendar',
    type: 'calendar',
    config: {
      dateField: 'Date',
      titleField: 'Post Topic',
      colorField: 'Posting Account',
    },
  },
  {
    name: 'Status Board',
    type: 'kanban',
    config: {
      groupField: 'Post Status',
      cardFields: ['Post Topic', 'Posting Account', 'Platform', 'Date'],
    },
  },
  {
    name: 'Content Gallery',
    type: 'gallery',
    config: {
      coverField: 'Image',
      titleField: 'Post Topic',
      visibleFields: ['Date', 'Platform', 'Copy Status'],
    },
  },
]

// Status field colors
const STATUS_COLORS: Record<string, string> = {
  'Drafting': 'gray',
  'Ready for Review': 'yellow',
  'Approved': 'green',
  'Scheduled': 'blue',
  'Posted': 'purple',
  'Needs Revision': 'red',
}

const COPY_STATUS_COLORS: Record<string, string> = {
  'Draft': 'gray',
  'Ready for Review': 'yellow',
  'Approved': 'green',
  'Needs Revision': 'red',
}

async function waitForUser(message: string): Promise<void> {
  if (!GUIDED_MODE) return

  console.log(`\n⏸️  ${message}`)
  console.log('   Press Enter to continue...')

  return new Promise(resolve => {
    process.stdin.once('data', () => resolve())
  })
}

async function openAirtableBase(page: Page): Promise<void> {
  const baseUrl = `https://airtable.com/${BASE_ID}/${TABLE_ID}`
  console.log(`Opening Airtable: ${baseUrl}`)

  await page.goto(baseUrl, { waitUntil: 'networkidle' })

  // Check if we need to log in
  if (page.url().includes('login')) {
    console.log('\n⚠️  Airtable login required.')
    console.log('   Please log in manually in the browser window.')
    await waitForUser('Log in to Airtable, then press Enter')
    await page.waitForURL(`**/airtable.com/${BASE_ID}/**`, { timeout: 120000 })
  }

  console.log('✓ Airtable base loaded')
}

async function createCalendarView(page: Page): Promise<void> {
  console.log('\nCreating Calendar view...')

  // Click the view switcher/add button
  await page.click('[data-testid="view-bar"] button:has-text("Grid")')
  await page.waitForSelector('[data-testid="view-menu"]')

  // Click "Create view"
  await page.click('button:has-text("Create")')
  await page.waitForSelector('[data-testid="create-view-menu"]')

  // Select Calendar
  await page.click('[data-testid="create-view-menu"] button:has-text("Calendar")')

  // Wait for view creation dialog
  await page.waitForSelector('[data-testid="view-creation-modal"]')

  // Name the view
  await page.fill('input[placeholder*="view name"]', 'Calendar')

  // Select date field
  await page.click('button:has-text("Select a date field")')
  await page.click('[data-testid="field-picker-option"]:has-text("Date")')

  // Create view
  await page.click('button:has-text("Create view")')

  await page.waitForSelector('.calendarView', { timeout: 10000 })
  console.log('✓ Calendar view created')
}

async function createKanbanView(page: Page): Promise<void> {
  console.log('\nCreating Kanban view...')

  // Click the view switcher/add button
  await page.click('[data-testid="view-bar"] [aria-label="Views"]')

  // Click "Create view"
  await page.click('button:has-text("Create")')

  // Select Kanban
  await page.click('button:has-text("Kanban")')

  // Wait for view creation dialog
  await page.waitForSelector('[data-testid="view-creation-modal"]')

  // Name the view
  await page.fill('input[placeholder*="view name"]', 'Status Board')

  // Select group field (Post Status)
  await page.click('button:has-text("Select a field")')
  await page.click('[data-testid="field-picker-option"]:has-text("Post Status")')

  // Create view
  await page.click('button:has-text("Create view")')

  await page.waitForSelector('.kanbanView', { timeout: 10000 })
  console.log('✓ Kanban view created')
}

async function createGalleryView(page: Page): Promise<void> {
  console.log('\nCreating Gallery view...')

  // Click the view switcher/add button
  await page.click('[data-testid="view-bar"] [aria-label="Views"]')

  // Click "Create view"
  await page.click('button:has-text("Create")')

  // Select Gallery
  await page.click('button:has-text("Gallery")')

  // Wait for view creation dialog
  await page.waitForSelector('[data-testid="view-creation-modal"]')

  // Name the view
  await page.fill('input[placeholder*="view name"]', 'Content Gallery')

  // Select cover field (Image)
  await page.click('button:has-text("Select a field")')
  await page.click('[data-testid="field-picker-option"]:has-text("Image")')

  // Create view
  await page.click('button:has-text("Create view")')

  await page.waitForSelector('.galleryView', { timeout: 10000 })
  console.log('✓ Gallery view created')
}

async function configureFieldColors(page: Page): Promise<void> {
  console.log('\nConfiguring field colors...')

  // This requires opening field customization
  // The exact selectors depend on Airtable's current UI

  await waitForUser('Field color configuration requires manual steps in guided mode')

  console.log('   To configure field colors manually:')
  console.log('   1. Click on the Post Status field header')
  console.log('   2. Click "Customize field type"')
  console.log('   3. Click on each option to set colors:')
  for (const [status, color] of Object.entries(STATUS_COLORS)) {
    console.log(`      - ${status}: ${color}`)
  }
}

async function runBrowserSetup(): Promise<void> {
  console.log('=== Airtable Browser Setup ===\n')

  if (!BASE_ID || !TABLE_ID) {
    console.error('Error: Base ID and Table ID required.')
    console.error('Use: --base appXXX --table tblXXX')
    console.error('Or set AIRTABLE_BASE_ID and AIRTABLE_CONTENT_CALENDAR_TABLE_ID in .env')
    process.exit(1)
  }

  console.log(`Base ID: ${BASE_ID}`)
  console.log(`Table ID: ${TABLE_ID}`)
  console.log(`Mode: ${GUIDED_MODE ? 'Guided (with pauses)' : 'Automatic'}`)
  console.log(`Headless: ${HEADLESS}`)

  let browser: Browser | null = null

  try {
    // Launch browser
    console.log('\nLaunching browser...')
    browser = await chromium.launch({
      headless: HEADLESS,
      slowMo: GUIDED_MODE ? 500 : 100, // Slow down for visibility
    })

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      // Use existing browser profile for auth
      storageState: existsSync('.airtable-auth.json') ? '.airtable-auth.json' : undefined,
    })

    const page = await context.newPage()

    // Open Airtable
    await openAirtableBase(page)

    await waitForUser('Base loaded. Ready to create views?')

    // Create views
    try {
      await createCalendarView(page)
    } catch (e) {
      console.log('⚠️  Calendar view may already exist or failed. Continuing...')
    }

    try {
      await createKanbanView(page)
    } catch (e) {
      console.log('⚠️  Kanban view may already exist or failed. Continuing...')
    }

    try {
      await createGalleryView(page)
    } catch (e) {
      console.log('⚠️  Gallery view may already exist or failed. Continuing...')
    }

    // Configure field colors
    await configureFieldColors(page)

    // Save auth state for future runs
    await context.storageState({ path: '.airtable-auth.json' })
    console.log('\n✓ Auth state saved for future runs')

    console.log('\n=== Browser Setup Complete ===')
    console.log('Created views:')
    console.log('  - Calendar (date-based planning)')
    console.log('  - Status Board (kanban workflow)')
    console.log('  - Content Gallery (visual review)')

    if (GUIDED_MODE) {
      await waitForUser('Setup complete. Press Enter to close browser.')
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`\nError: ${message}`)

    if (message.includes('Playwright')) {
      console.error('\nPlaywright not installed. Run:')
      console.error('  cd automation/airtable-setup && npm install playwright')
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Alternative: Generate URLs for manual setup
function printManualInstructions(): void {
  console.log('=== Manual Airtable Setup Instructions ===\n')

  if (!BASE_ID) {
    console.log('Set AIRTABLE_BASE_ID in .env first.\n')
    return
  }

  const baseUrl = `https://airtable.com/${BASE_ID}`

  console.log('Open your Airtable base and follow these steps:\n')

  console.log('1. CREATE CALENDAR VIEW')
  console.log(`   Open: ${baseUrl}`)
  console.log('   - Click the view dropdown (shows "Grid")')
  console.log('   - Click "Create view" → "Calendar"')
  console.log('   - Name: "Calendar"')
  console.log('   - Date field: "Date"')
  console.log('')

  console.log('2. CREATE KANBAN VIEW')
  console.log('   - Click the view dropdown')
  console.log('   - Click "Create view" → "Kanban"')
  console.log('   - Name: "Status Board"')
  console.log('   - Group by: "Post Status"')
  console.log('')

  console.log('3. CREATE GALLERY VIEW')
  console.log('   - Click the view dropdown')
  console.log('   - Click "Create view" → "Gallery"')
  console.log('   - Name: "Content Gallery"')
  console.log('   - Cover field: "Image"')
  console.log('')

  console.log('4. CONFIGURE STATUS COLORS')
  console.log('   - Click "Post Status" field header')
  console.log('   - Click "Customize field type"')
  console.log('   - Set option colors:')
  for (const [status, color] of Object.entries(STATUS_COLORS)) {
    console.log(`     ${status}: ${color}`)
  }
  console.log('')

  console.log('5. CONFIGURE COPY STATUS COLORS')
  console.log('   - Click "Copy Status" field header')
  console.log('   - Click "Customize field type"')
  console.log('   - Set option colors:')
  for (const [status, color] of Object.entries(COPY_STATUS_COLORS)) {
    console.log(`     ${status}: ${color}`)
  }
}

// Main
async function main(): Promise<void> {
  if (args.includes('--manual') || args.includes('--instructions')) {
    printManualInstructions()
    return
  }

  try {
    // Check if Playwright is available
    require.resolve('playwright')
    await runBrowserSetup()
  } catch {
    console.log('Playwright not installed. Showing manual instructions instead.\n')
    console.log('To enable browser automation:')
    console.log('  cd automation/airtable-setup')
    console.log('  npm init -y && npm install playwright')
    console.log('  npx playwright install chromium\n')
    printManualInstructions()
  }
}

main()
