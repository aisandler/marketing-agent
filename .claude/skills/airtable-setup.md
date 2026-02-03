# Airtable Setup Skill

Set up your Airtable Content Calendar base with the correct schema.

## Usage

```
/airtable-setup
```

## What This Does

### Phase 1: API Setup (Automatic)
Uses the Airtable Meta API to create:
- A new base, or add to an existing base
- Content Calendar table with all fields
- Posting accounts from your partners config
- Content pillars and focus areas from your brand config

### Phase 2: Browser Setup (Views & Formatting)
The API can't create views, so we offer browser automation:
- **Calendar View** - Date-based content planning
- **Kanban View** - Status workflow board
- **Gallery View** - Visual content review
- **Field Colors** - Status color coding

## Prerequisites

- Airtable Personal Access Token with these scopes:
  - `data.records:read`
  - `data.records:write`
  - `schema.bases:read`
  - `schema.bases:write`

Get your token at: https://airtable.com/create/tokens

For browser automation (optional):
```bash
cd automation/airtable-setup
npm init -y && npm install playwright
npx playwright install chromium
```

## Workflow

### Option 1: Interactive Setup (Recommended)

When you run `/airtable-setup`, I'll guide you through:

1. Confirming your brand configuration
2. Getting your Airtable token (if not in .env)
3. Choosing to create a new base or add to existing
4. Running the API setup
5. Offering browser automation for views
6. Updating your .env with the new IDs

### Option 2: CLI Direct

```bash
# Preview what will be created
npx tsx automation/airtable-setup/setup-base.ts --dry-run

# Create new base
npx tsx automation/airtable-setup/setup-base.ts --token patXXX

# Add to existing base
npx tsx automation/airtable-setup/setup-base.ts --token patXXX --base appXXX

# Create and open in browser
npx tsx automation/airtable-setup/setup-base.ts --token patXXX --open
```

### Option 3: Browser Automation

After API setup, configure views:

```bash
# Automatic mode (requires Playwright)
npx tsx automation/airtable-setup/browser-setup.ts --base appXXX --table tblXXX

# Guided mode (with pauses for manual steps)
npx tsx automation/airtable-setup/browser-setup.ts --base appXXX --table tblXXX --guided

# Just show manual instructions
npx tsx automation/airtable-setup/browser-setup.ts --manual
```

## Table Schema

The Content Calendar table includes:

| Field | Type | Description |
|-------|------|-------------|
| Date | Date | Post scheduled date |
| Post Topic | Text | Brief description |
| Posting Account | Single Select | Partner accounts from config |
| Platform | Single Select | LinkedIn, Instagram, etc. |
| Post Type | Single Select | Original, Repost, Link Share |
| Content Pillar | Single Select | From brand config |
| Focus | Single Select | From brand config |
| Copy | Long Text | Post content |
| Copy Status | Single Select | Draft, Ready for Review, Approved, Needs Revision |
| Image Brief | Long Text | AI image generation prompt |
| Image | Attachment | Post images |
| Image Source | Single Select | AI Generated, Manual Upload, etc. |
| Asset Status | Single Select | Needed, In Progress, Ready, Approved |
| Post Status | Single Select | Drafting through Posted |
| Notes | Long Text | Internal notes |
| Source Post | Link | For reposts |

## Views Created

| View | Type | Purpose |
|------|------|---------|
| Calendar | Calendar | Date-based content planning |
| Status Board | Kanban | Visual workflow (Drafting → Posted) |
| Content Gallery | Gallery | Image-focused content review |

## Status Colors

Configured during browser setup:

| Post Status | Color |
|-------------|-------|
| Drafting | Gray |
| Ready for Review | Yellow |
| Approved | Green |
| Scheduled | Blue |
| Posted | Purple |
| Needs Revision | Red |

## After Setup

Once your Airtable is configured:

1. Update your `.env` file with the IDs provided
2. Start the Partner Portal: `cd portal && npm run dev`
3. Use image generation: `npx tsx automation/image-generation/generate-images.ts --status`

## Complete Setup Flow

```
1. /onboard → Generates config/brand.json, config/partners.json
2. /airtable-setup → Creates Airtable base + table (API)
3. Browser setup → Creates views + colors (Playwright)
4. Portal setup → cd portal && npm install && npm run dev
5. Ready to use!
```

## Troubleshooting

**"Token doesn't have required scopes"**
- Create a new token at airtable.com/create/tokens
- Add schema.bases:read and schema.bases:write scopes

**"Base already exists"**
- Use `--base appXXX` to add table to existing base
- Or manually delete and recreate

**"Content Calendar already exists"**
- The script won't overwrite existing tables
- Delete the table in Airtable first if you want to recreate

**"Playwright not installed"**
- Run: `cd automation/airtable-setup && npm install playwright`
- Then: `npx playwright install chromium`
- Or use `--manual` for step-by-step instructions

**"Login required in browser"**
- In guided mode, log into Airtable when prompted
- Auth state is saved for future runs
