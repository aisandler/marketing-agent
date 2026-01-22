# Sample Planning Session - {{COMPANY_NAME}} Content Generation

**Scenario**: {{CLIENT_CONTACT}} wants to plan September content focusing on fall pest preparation  
**Input Method**: Voice dictation processed by Monthly Content Planner Agent  
**Output**: CSV ready for Airtable import  

---

## 📝 {{CLIENT_CONTACT}}'S VOICE INPUT

*"I need content for September focusing on fall pest prep. Target Illinois first - Dixon, Sycamore, and Rockford are priorities. I want 6 blog posts covering rodent prevention and spider control since they'll be moving indoors. Also need 4 social media posts that work across all our markets - general fall pest tips, no location stuff. And let's add 2 location pages for Naperville and Wheaton since those are high-value markets we've been wanting to target. Make Illinois HIGH priority, everything else MEDIUM. Focus on getting people ready before the cold weather hits."*

---

## 🤖 CLAUDE CODE PROCESSING

### Extracted Requirements:
- **Content Volume**: 12 total pieces (6 blogs + 4 social + 2 location pages)
- **Timing**: September (fall preparation focus)
- **Target Locations**: Dixon IL, Sycamore IL, Rockford IL (priority), Naperville IL, Wheaton IL
- **Pest Focus**: Rodents, spiders (indoor migration)
- **Priority**: HIGH for Illinois, MEDIUM for expansion
- **Special Notes**: Pre-cold weather timing, social media location-agnostic

### Content Strategy:
- Blog posts target specific Illinois markets with fall rodent/spider themes
- Social media posts are location-neutral per {{CLIENT_CONTACT}}'s rules
- Location pages target high-value Naperville and Wheaton markets
- Timeline spreads content across September for optimal seasonal timing

---

## 📊 GENERATED CSV OUTPUT

```csv
Content ID,Description,Publish Date,Status,Content Type,Priority,Target Location,Pest Type,Primary Keyword,Content Format,Seasonal Relevance,Search Volume,Keyword Difficulty,Notes
,"Fall Rodent Prevention Dixon IL",,,Blog Post,HIGH,Dixon IL,Rodents,"fall rodent control Dixon IL",WordPress Blog,Fall,420,Medium,"Office location priority - pre-cold weather timing"
,"Spider Control Sycamore IL",,,Blog Post,HIGH,Sycamore IL,Spiders,"spider control Sycamore IL",WordPress Blog,Fall,280,Low,"Office location - indoor migration focus"
,"Rockford Fall Pest Preparation",,,Blog Post,HIGH,Rockford IL,General,"fall pest control Rockford IL",WordPress Blog,Fall,380,Medium,"Large market - comprehensive fall prep"
,"Dixon Mice Prevention Guide",,,Blog Post,HIGH,Dixon IL,Rodents,"mouse prevention Dixon IL",WordPress Blog,Fall,190,Low,"Specific rodent focus for office area"
,"Fall Spider Prevention Tips",,,Blog Post,HIGH,Sycamore IL,Spiders,"fall spider prevention Sycamore",WordPress Blog,Fall,150,Low,"Seasonal indoor migration content"
,"Rockford Rodent Proofing",,,Blog Post,HIGH,Rockford IL,Rodents,"rodent proofing Rockford IL",WordPress Blog,Fall,220,Medium,"Large market rodent preparation"
,"Fall Pest Prevention Tips",,,Social Media,MEDIUM,Multi-State,General,"fall pest prevention tips",Facebook Post,Fall,590,Low,"Location-agnostic per {{CLIENT_CONTACT}} rules"
,"Prepare Home for Winter Pests",,,Social Media,MEDIUM,Multi-State,General,"winter pest preparation",Instagram Post,Fall,320,Low,"General seasonal prep messaging"
,"Rodent Season Alert",,,Social Media,MEDIUM,Multi-State,Rodents,"fall rodent prevention",Facebook Post,Fall,410,Low,"Seasonal awareness - no location"
,"Spider Indoor Migration",,,Social Media,MEDIUM,Multi-State,Spiders,"spider prevention fall",Instagram Post,Fall,250,Low,"Educational seasonal content"
,"Pest Control Naperville IL",,,Location Page,MEDIUM,Naperville IL,General,"pest control Naperville IL",Landing Page,Year-Round,2100,High,"High-value market expansion"
,"Pest Control Wheaton IL",,,Location Page,MEDIUM,Wheaton IL,General,"pest control Wheaton IL",Landing Page,Year-Round,1800,Medium,"High-value market expansion"
```

---

## 🎯 PLANNING SUMMARY

### Content Breakdown:
- **6 Blog Posts**: Illinois-focused, fall pest preparation
- **4 Social Media Posts**: Location-agnostic, seasonal awareness
- **2 Location Pages**: High-value market expansion

### SEO Strategy:
- Target local + seasonal keywords for blogs
- General seasonal terms for social media
- High-value location keywords for new market pages

### Priority Distribution:
- **HIGH**: 6 items (Illinois blog content)
- **MEDIUM**: 6 items (social media + location expansion)

### Seasonal Alignment:
- **Fall Focus**: 10 items aligned with pest migration patterns
- **Year-Round**: 2 location pages for ongoing local SEO

---

## 📤 AIRTABLE IMPORT PROCESS

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
      "baseId": "appS6XjjRUrELJRgC", 
      "tableId": "tblDaJzBBjtR2mrDq",
      "csv_data": "[Generated CSV content above]"
    }
  }'
```

---

## ✅ NEXT STEPS

1. **Import to Airtable**: Use manual or webhook method
2. **Review Content Ideas**: {{CLIENT_CONTACT}} can adjust priorities or add notes
3. **Begin Production**: Start with HIGH priority items
4. **Status Tracking**: Move items through workflow as completed

This planning session demonstrates how voice input can be quickly converted to structured, actionable content plans ready for the enhanced Airtable workflow system.