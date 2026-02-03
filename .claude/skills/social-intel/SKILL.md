# Social Media Intelligence Skill

<command-name>intel</command-name>

## Description

Collects competitive and industry insights from LinkedIn and Twitter/X, and feeds that intelligence into the image generation workflow. This system monitors competitor visual strategies, engagement patterns, and trending topics to continuously improve social media content.

## Commands

| Command | Description |
|---------|-------------|
| `/intel status` | Show collection dates, staleness, and active enhancements |
| `/intel collect --linkedin` | Run LinkedIn competitor data collection |
| `/intel collect --twitter` | Run Twitter/X industry theme collection |
| `/intel collect --all` | Run both LinkedIn and Twitter collection |
| `/intel analyze` | Run visual analysis on collected data |
| `/intel report` | Generate comprehensive intelligence summary |
| `/intel sync` | Update synthesis file for image generation |
| `/intel reset` | Clear all cached data and start fresh |

## Quick Reference

```bash
# Check current intel status
/intel status

# Weekly collection workflow (recommended Monday morning)
/intel collect --linkedin
/intel collect --twitter
/intel analyze
/intel sync
```

## Data Flow

```
LinkedIn/Twitter Collection
         ↓
    Visual Analysis
         ↓
    Synthesis Pipeline
         ↓
image-generation-intel.json
         ↓
   rules.ts (prompts)
         ↓
  Generated Images
```

## Status Command Output

When you run `/intel status`, you'll see:

- **Last Collection**: When LinkedIn and Twitter data was last collected
- **Staleness**: Whether data is current or needs refresh (stale after 7 days)
- **Active Sources**: Which data sources are contributing to intel
- **Positive Enhancements**: Style elements being added to prompts
- **Negative Avoidances**: Elements being avoided in generation
- **Competitor Gap**: Current differentiation opportunity

## Collection Details

### LinkedIn Collection

Targets configured competitors in `client-context/competitors/`.

Collects:
- Recent posts with engagement metrics (likes, comments, shares)
- Image descriptions and visual style analysis
- Post types and topics
- Timing patterns

### Twitter/X Collection

Sources from Airtable follow list (table ID configured via `AIRTABLE_TWITTER_FOLLOW_TABLE_ID` environment variable):
- **Industry voices**: Thought leaders in your space
- **Competitor accounts**: Direct competitor social presence
- **Market commentary**: Industry news and trends

Collects:
- Trending topics and themes
- Hashtag performance
- Sentiment analysis
- Industry conversations

## Analysis Outputs

### Visual Analysis

Analyzes collected images for:
- **Color palettes**: Dominant colors, brand adherence
- **Style classification**: Photo, illustration, infographic, branded graphic
- **Composition**: Layout patterns, text overlay usage
- **Element detection**: Buildings, documents, charts, etc.
- **Engagement correlation**: Which styles drive most interaction

### Synthesis

Combines all intelligence into actionable format:
- Positive prompt enhancements (what to include)
- Negative prompt additions (what to avoid)
- Style guidance by content type
- Trending visual elements
- Competitor gap analysis
- Platform-specific recommendations

## File Structure

```
docs/intelligence/
├── linkedin/
│   ├── competitor-posts.json    # Raw competitor post data
│   ├── engagement-patterns.md   # Engagement analysis
│   └── visual-trends.md         # Visual style trends
├── twitter/
│   ├── industry-themes.json     # Trending topics
│   └── topic-trends.md          # Theme analysis
├── visuals/
│   ├── style-patterns.json      # Visual pattern data
│   ├── competitor-audit.md      # Competitor visual audit
│   └── engagement-by-style.md   # Style performance
└── synthesis/
    └── image-generation-intel.json  # Final synthesis for rules.ts
```

## Integration with Image Generation

The `/images generate` command automatically:
1. Loads intelligence from `image-generation-intel.json`
2. Displays intel status (freshness, active enhancements)
3. Applies positive/negative prompt modifications
4. Logs intel application in generation-log.csv

Example output during generation:
```
[Intel] Loaded intelligence (3 days old)
[Intel] Applying: architectural sophistication, premium editorial style
[Intel] Avoiding: generic stock, corporate sterile
```

## Recommended Cadence

| Collection Type | Frequency | Best Day |
|-----------------|-----------|----------|
| LinkedIn full scan | Weekly | Monday morning |
| Twitter/X scan | 2x/week | Monday, Thursday |
| Visual analysis | After each collection | - |
| Synthesis | After each analysis | - |

### Monday Morning Checklist

1. `/intel collect --all` - Collect fresh data
2. `/intel analyze` - Run visual analysis
3. `/intel sync` - Update synthesis for image generation
4. `/intel status` - Verify intel is fresh

## Configuration

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `AIRTABLE_API_KEY` | Airtable API access for Twitter follow list |
| `AIRTABLE_BASE_ID` | Base containing follow list table |
| `AIRTABLE_TWITTER_FOLLOW_TABLE_ID` | Table ID for Twitter accounts to monitor |

### Competitor Configuration

Configure competitors in `client-context/competitors/` or directly in the collector scripts. The LinkedIn collector looks for competitor company URLs to monitor.

## Troubleshooting

### "Intelligence data is stale"
Run `/intel collect --all` followed by `/intel sync` to refresh.

### "No intelligence file found"
Run `/intel sync` to generate the initial synthesis file.

### Collection fails
Ensure Chrome MCP extension is available for browser automation. Check that LinkedIn/Twitter accounts are accessible.

### Intel not applying to images
1. Check `/intel status` to ensure data is fresh
2. Verify `image-generation-intel.json` has valid content
3. Run `/images --dry-run` to see if intel is being loaded

## Manual File Locations

If you need to manually inspect or edit:
- **Raw LinkedIn data**: `docs/intelligence/linkedin/competitor-posts.json`
- **Raw Twitter data**: `docs/intelligence/twitter/industry-themes.json`
- **Synthesis output**: `docs/intelligence/synthesis/image-generation-intel.json`
- **Intel cache**: `automation/image-generation/intel-cache.json`

## Scripts

```bash
# LinkedIn collection
npx tsx automation/intel/linkedin-collector.ts

# Twitter collection
npx tsx automation/intel/twitter-collector.ts

# Visual analysis
npx tsx automation/intel/visual-analyzer.ts

# Synthesis
npx tsx automation/intel/synthesize.ts
```
