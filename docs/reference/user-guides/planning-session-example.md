# Sample Planning Session - {{COMPANY_NAME}} Content Generation

**Scenario**: {{CLIENT_CONTACT}} wants to plan September content focusing on fall seasonal preparation
**Input Method**: Voice dictation processed by Monthly Content Planner Agent
**Output**: CSV ready for Airtable import

---

## Voice Input

*"I need content for September focusing on fall seasonal preparation. Target our primary market first - {{SERVICE_AREA}} locations are priorities. I want 6 blog posts covering our core services since demand picks up this time of year. Also need 4 social media posts that work across all our markets - general seasonal tips, no location stuff. And let's add 2 location pages for two new high-value markets we've been wanting to target. Make primary market HIGH priority, everything else MEDIUM. Focus on getting people ready before the busy season hits."*

---

## Claude Code Processing

### Extracted Requirements:
- **Content Volume**: 12 total pieces (6 blogs + 4 social + 2 location pages)
- **Timing**: September (fall preparation focus)
- **Target Locations**: Primary {{SERVICE_AREA}} markets (priority), plus 2 expansion markets
- **Service Focus**: Core seasonal services
- **Priority**: HIGH for primary market, MEDIUM for expansion
- **Special Notes**: Pre-season timing, social media location-agnostic

### Content Strategy:
- Blog posts target specific primary markets with seasonal service themes
- Social media posts are location-neutral per {{CLIENT_CONTACT}}'s rules
- Location pages target high-value expansion markets
- Timeline spreads content across September for optimal seasonal timing

---

## Generated CSV Output

```csv
Content ID,Description,Publish Date,Status,Content Type,Priority,Target Location,Service Category,Primary Keyword,Content Format,Seasonal Relevance,Search Volume,Keyword Difficulty,Notes
,"Fall Service Prep Guide - Market A",,,Blog Post,HIGH,Market A,Core Services,"fall preparation Market A",WordPress Blog,Fall,420,Medium,"Primary market priority - pre-season timing"
,"Seasonal Tips Market B",,,Blog Post,HIGH,Market B,Specialty Services,"seasonal tips Market B",WordPress Blog,Fall,280,Low,"Primary market - seasonal demand focus"
,"Market C Fall Preparation",,,Blog Post,HIGH,Market C,General,"fall services Market C",WordPress Blog,Fall,380,Medium,"Large market - comprehensive fall prep"
,"Market A Prevention Guide",,,Blog Post,HIGH,Market A,Core Services,"prevention guide Market A",WordPress Blog,Fall,190,Low,"Specific service focus for primary area"
,"Fall Prevention Tips",,,Blog Post,HIGH,Market B,Specialty Services,"fall prevention Market B",WordPress Blog,Fall,150,Low,"Seasonal content"
,"Market C Service Preparation",,,Blog Post,HIGH,Market C,Core Services,"service preparation Market C",WordPress Blog,Fall,220,Medium,"Large market preparation"
,"Fall Prevention Tips",,,Social Media,MEDIUM,Multi-Market,General,"fall prevention tips",Facebook Post,Fall,590,Low,"Location-agnostic per {{CLIENT_CONTACT}} rules"
,"Prepare Your Home for the Season",,,Social Media,MEDIUM,Multi-Market,General,"seasonal preparation",Instagram Post,Fall,320,Low,"General seasonal prep messaging"
,"Seasonal Service Alert",,,Social Media,MEDIUM,Multi-Market,Core Services,"fall service awareness",Facebook Post,Fall,410,Low,"Seasonal awareness - no location"
,"Seasonal Maintenance Tips",,,Social Media,MEDIUM,Multi-Market,General,"seasonal maintenance tips",Instagram Post,Fall,250,Low,"Educational seasonal content"
,"{{COMPANY_NAME}} Services Expansion Market A",,,Location Page,MEDIUM,Expansion Market A,General,"services Expansion Market A",Landing Page,Year-Round,2100,High,"High-value market expansion"
,"{{COMPANY_NAME}} Services Expansion Market B",,,Location Page,MEDIUM,Expansion Market B,General,"services Expansion Market B",Landing Page,Year-Round,1800,Medium,"High-value market expansion"
```

---

## Planning Summary

### Content Breakdown:
- **6 Blog Posts**: Primary-market-focused, fall seasonal preparation
- **4 Social Media Posts**: Location-agnostic, seasonal awareness
- **2 Location Pages**: High-value market expansion

### SEO Strategy:
- Target local + seasonal keywords for blogs
- General seasonal terms for social media
- High-value location keywords for new market pages

### Priority Distribution:
- **HIGH**: 6 items (primary market blog content)
- **MEDIUM**: 6 items (social media + location expansion)

### Seasonal Alignment:
- **Fall Focus**: 10 items aligned with seasonal demand patterns
- **Year-Round**: 2 location pages for ongoing local SEO

---

## Airtable Import Process

### Option 1: Manual Import
1. Copy CSV data above
2. Save as .csv file
3. Import to Airtable content table
4. Verify data mapping

### Option 2: Webhook Import
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": "bulk_import",
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_INVENTORY_TABLE_ID",
      "csv_data": "[Generated CSV content above]"
    }
  }'
```

---

## Next Steps

1. **Import to Airtable**: Use manual or webhook method
2. **Review Content Ideas**: {{CLIENT_CONTACT}} can adjust priorities or add notes
3. **Begin Production**: Start with HIGH priority items
4. **Status Tracking**: Move items through workflow as completed

This planning session demonstrates how voice input can be quickly converted to structured, actionable content plans ready for the enhanced Airtable workflow system.
