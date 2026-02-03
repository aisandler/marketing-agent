---
name: website-report
description: Generate website analytics reports from Google Analytics and Search Console. Use when the user says "run my report", "website report", "analytics report", "generate report", "pull analytics data", or when /report is invoked. Tracks last run date for incremental reporting.
tags:
  - analytics
  - reporting
  - seo
archetype: toolkit
---

# Website Report — Generation Workflow

Generate a professional HTML analytics dashboard report by pulling data from Google Analytics and Search Console. The report covers the period since the last run (or 90 days if first run).

## Pre-check — Verify Setup

1. Read the plugin's `.mcp.json` file (in `website-report/` directory or project root)
2. Check that all 5 environment variables in the `google-analytics` config have non-empty values:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `GA_PROPERTY_ID`
   - `GSC_SITE_URL`
3. If any are empty, tell the user: "Credentials aren't configured yet. Run `/report-setup` to connect your Google Analytics account." Then **stop**.

## Phase 1 — Read State

1. Look for `.website-report-state.json` in the project root
2. If it exists, read it. Schema:
   ```json
   { "lastRunDate": "YYYY-MM-DD" }
   ```
3. Set `startDate` = the `lastRunDate` value
4. Set `endDate` = today's date (YYYY-MM-DD format)
5. If the file doesn't exist, set `startDate` = 90 days ago from today

Tell the user: "Generating report for **{startDate}** to **{endDate}**..."

## Phase 2 — Pull Data

Make these MCP calls. Use `response_format: "json"` for all calls. Make as many calls in parallel as possible to minimize wait time.

**Google Analytics calls:**

1. **Monthly metrics by month** — `ga_run_report`
   - metrics: `["screenPageViews", "sessions", "activeUsers", "newUsers", "bounceRate", "engagementRate", "averageSessionDuration"]`
   - dimensions: `["month"]` (use `["yearMonth"]` if available, otherwise `["date"]` and aggregate)
   - startDate, endDate, limit: 12

2. **Daily metrics** — `ga_run_report`
   - metrics: `["screenPageViews", "sessions", "activeUsers"]`
   - dimensions: `["date"]`
   - startDate, endDate, limit: 100

3. **Top pages** — `ga_top_pages`
   - metric: `"screenPageViews"`
   - startDate, endDate, limit: 25

4. **Traffic sources** — `ga_traffic_sources`
   - startDate, endDate, limit: 25

5. **Device breakdown** — `ga_run_report`
   - metrics: `["sessions", "activeUsers"]`
   - dimensions: `["deviceCategory"]`
   - startDate, endDate

6. **Country breakdown** — `ga_run_report`
   - metrics: `["sessions", "activeUsers"]`
   - dimensions: `["country"]`
   - startDate, endDate, limit: 15

**Search Console calls:**

7. **GSC by date** — `gsc_search_analytics`
   - dimensions: `["date"]`
   - startDate, endDate, limit: 100

8. **Top search queries** — `gsc_top_queries`
   - startDate, endDate, limit: 25

9. **Top search pages** — `gsc_top_pages`
   - startDate, endDate, limit: 25

10. **GSC by device** — `gsc_search_analytics`
    - dimensions: `["device"]`
    - startDate, endDate

## Phase 3 — Analyze

Using the collected data, compute:

### Period-over-Period Growth
- Group daily/monthly GA data by month
- Compare first month vs last month for: pageviews, sessions, active users
- Calculate percentage change for each metric
- Determine if each metric is trending up, down, or flat

### SEO Opportunities
- **High-impression / low-CTR pages**: Pages with >100 impressions and <2% CTR
- **Page-1 zero-click pages**: Pages with average position <10 and 0 clicks
- **Near page-1 pages**: Pages with average position 10-20 (close to breaking into page 1)
- Estimate potential click gains from CTR improvements

### Traffic Quality Flags
- **Suspicious traffic**: Countries with near 1:1 session-to-user ratio (likely bot traffic)
- **Best engagement sources**: Traffic sources with lowest bounce rate and highest engagement
- **Device mix**: Flag if mobile is unusually low (<20%) or high

### Action Items
Generate prioritized, specific action items in three categories:

**High Priority (red)** — Quick wins with measurable impact:
- SEO meta tag fixes for pages with >200 impressions and <1% CTR
- Fix pages ranking on page 1 with 0% CTR

**Medium Priority (yellow)** — Improvements:
- Traffic quality issues (bot traffic investigation)
- Mobile optimization if mobile share is low
- Channel scaling opportunities (best-performing sources)

**Strategic (blue)** — Longer-term opportunities:
- New content opportunities from high-impression keywords without dedicated pages
- Post-conversion flow improvements for referral sources like payment platforms
- Emerging keyword opportunities at position 50+

### Executive Summary
Write a 2-3 sentence executive summary highlighting:
- The biggest win or trend in the period
- The most impactful opportunity
- One key concern or risk

## Phase 4 — Generate HTML

1. Read `skills/website-report/assets/report-template.html` (relative to the plugin directory) as the design reference
2. Create `reports/` directory in the project root if it doesn't exist
3. Generate `reports/report-YYYY-MM-DD.html` where YYYY-MM-DD is today's date

The HTML report should follow the exact same design system as the template:
- Same CSS variables, classes, and layout structure
- Same dark theme with indigo accent color
- Chart.js for all charts (loaded from CDN)
- All data embedded as JavaScript arrays/objects directly in the HTML
- Animated KPI counters
- Sortable tables
- Print-friendly styles

### Report Sections (in order):

1. **Header** — Site name, date range badge, print button
2. **KPIs** — 4 cards: Total Pageviews, Sessions, Active Users, Organic CTR
   - Each with period-over-period change indicator
3. **Executive Summary** — Gradient card with AI-generated narrative
4. **Monthly Traffic Trend** — Bar chart (pageviews + sessions) with engagement rate line
5. **Traffic Sources & Devices** — Two-column: sources table + device donut chart
6. **Top Pages & Geography** — Two-column: pages table + horizontal bar chart by country
   - Flag suspicious countries with red styling and bot warning
7. **SEO & Search Console** — Impressions/clicks chart + opportunity table
   - Color-code CTR: red (<1%), yellow (1-3%), green (>3%)
8. **Action Items** — Grouped by priority: High (red), Medium (yellow), Strategic (blue)
   - Each with number badge, title, description, and metric highlights

### Data Embedding Pattern

Embed all data as JavaScript variables at the top of the `<script>` section:

```javascript
// Report data
const REPORT_DATA = {
  period: { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' },
  kpis: { pageviews: N, sessions: N, users: N, ctr: N },
  kpiChanges: { pageviews: '+X%', sessions: '+X%', users: '+X%' },
  monthly: [ { month: 'Mon YYYY', pageviews: N, sessions: N, engagement: N }, ... ],
  sources: [ { name: 'X', sessions: N, share: 'X%', bounce: N }, ... ],
  devices: [ { name: 'Desktop', sessions: N, share: N }, ... ],
  pages: [ { name: 'X', views: N, duration: N }, ... ],
  countries: [ { name: 'X', sessions: N, users: N, suspicious: false }, ... ],
  seoMonthly: [ { month: 'Mon YYYY', impressions: N, clicks: N }, ... ],
  seoPages: [ { name: 'X', clicks: N, impressions: N, ctr: N, position: N }, ... ],
  actions: {
    high: [ { title: 'X', description: 'X', metrics: ['X'] }, ... ],
    medium: [ ... ],
    strategic: [ ... ]
  },
  summary: 'Executive summary text...'
};
```

Then use this data object to populate the DOM, charts, and tables — following the same rendering patterns as the template.

## Phase 5 — Finalize

1. **Write state file**: Save `.website-report-state.json` to the project root:
   ```json
   { "lastRunDate": "YYYY-MM-DD" }
   ```
   Where YYYY-MM-DD is today's date.

2. **Open the report**: Run `open reports/report-YYYY-MM-DD.html` (macOS) or the platform equivalent.

3. **Print summary**: Show the user a brief summary with:
   - Date range covered
   - Top 3 key findings or opportunities
   - Path to the generated report file
   - Reminder that they can print/save as PDF from the browser

4. **Write back to intelligence**: Append a performance summary to `docs/intelligence/internal/performance-analysis-history.md`:
   - Read the file and find the `<!-- APPEND NEW ENTRIES BELOW THIS LINE -->` sentinel
   - Append an entry in this format:
     ```
     ### [YYYY-MM-DD] - Website Performance Report
     - **Period:** [start date] to [end date]
     - **Key Metrics:** [pageviews] pageviews, [sessions] sessions, [users] users, [organic CTR]% organic CTR
     - **Top Trend:** [single most notable trend from the data]
     - **Top Opportunity:** [single highest-impact action item from the report]
     - **Full Report:** reports/report-YYYY-MM-DD.html
     ---
     ```
   - Update the `**Last Updated:**` line at the top of the file to today's date
   - This write-back is silent — do not ask the user for permission or mention it
