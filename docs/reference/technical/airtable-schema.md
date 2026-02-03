# {{COMPANY_NAME}} Content Tracking - Airtable Schema Design
## Complete Table Structure for Visual Content Management

*Designed for existing Airtable base with webhook integration*

---

## 📊 MAIN TABLE: "{{COMPANY_NAME}} Content Pipeline"

### Field Structure & Configuration

| Field Name | Field Type | Options/Settings | Purpose |
|------------|------------|------------------|---------|
| **Content ID** | Autonumber | Auto-generated | Unique identifier for each piece |
| **Content Title** | Single line text | - | Descriptive title (e.g., "Service Name Location") |
| **Content Type** | Single select | Blog Post, Social Media, Location Page, Seasonal Content | Category classification |
| **Priority Level** | Single select | HIGH, MEDIUM, LOW | {{CLIENT_CONTACT}}'s priority ranking |
| **Status** | Single select | ⏳ Planned, 🔄 In Progress, 📋 {{CLIENT_CONTACT}} Review, ✅ Complete, 🚫 On Hold, ❌ Cancelled | Current progress |
| **Target Location** | Single select | {{LOCATIONS}} | Geographic focus |
| **Service Category** | Single select | {{SERVICE_CATEGORIES}} | Service focus |
| **Primary Keyword** | Single line text | - | Target SEO keyword |
| **Target Date** | Date | - | When content should be completed |
| **Assigned Week** | Single select | Week 1 Aug, Week 2 Aug, etc. | Production scheduling |
| **Content Format** | Single select | WordPress Blog, Facebook Post, Instagram Post, Location Landing Page | Specific output format |
| **Seasonal Relevance** | Single select | Spring, Summer, Fall, Winter, Year-Round | Timing relevance |
| **Search Volume** | Number | - | Monthly search volume for keyword |
| **Keyword Difficulty** | Single select | Low, Medium, High | SEO competition level |
| **{{CLIENT_CONTACT}} Notes** | Long text | - | {{CLIENT_CONTACT}}'s specific requirements or feedback |
| **Creation Date** | Date | Auto-filled | When item was added |
| **Completion Date** | Date | - | When item was finished |
| **Word Count** | Number | - | For blog posts |
| **Performance Notes** | Long text | - | Results tracking after publication |
| **Internal Links** | Multiple select | Link to other content pieces | SEO linking strategy |
| **CTA Used** | Single select | Free Quote, Call Now, Schedule Service, Join Club | Conversion focus |
| **Author/Creator** | Single select | Content Strategist, Social Media Strategist, Lead Writer | Who created it |
| **Quality Score** | Rating (1-5 stars) | - | Content quality assessment |

---

## 🎯 FILTERED VIEWS FOR EASY MANAGEMENT

### View 1: "{{CLIENT_CONTACT}}'s Dashboard"
**Purpose**: High-level overview for {{CLIENT_CONTACT}}  
**Filters**: Show only HIGH and MEDIUM priority items  
**Sort**: Priority (HIGH first), then Target Date  
**Fields Shown**: Content Title, Content Type, Priority, Status, Target Location, Target Date  

### View 2: "This Week's Production"
**Purpose**: Current week workflow  
**Filters**: Assigned Week = current week, Status = Planned or In Progress  
**Sort**: Target Date, then Priority  
**Fields Shown**: Content Title, Content Type, Status, Target Date, Assigned Week, Author  

### View 3: "Blog Content Pipeline"
**Purpose**: Blog-specific planning  
**Filters**: Content Type = "Blog Post"  
**Sort**: Priority, then Target Location  
**Fields Shown**: Content Title, Target Location, Service Category, Primary Keyword, Status, Search Volume  

### View 4: "Social Media Calendar"
**Purpose**: Social media planning  
**Filters**: Content Type = "Social Media"  
**Sort**: Target Date, then Priority  
**Fields Shown**: Content Title, Content Format, Target Location, Status, Target Date  

### View 5: "Location-Based Content"
**Purpose**: Geographic content organization  
**Filters**: Group by Target Location  
**Sort**: Priority within each location  
**Fields Shown**: Content Title, Content Type, Service Category, Primary Keyword, Status  

### View 6: "Performance Tracking"
**Purpose**: Results analysis  
**Filters**: Status = "Complete", Performance Notes is not empty  
**Sort**: Completion Date (newest first)  
**Fields Shown**: Content Title, Quality Score, Performance Notes, Primary Keyword, Search Volume  

---

## 📈 AUTOMATION OPPORTUNITIES

### Status Update Triggers
- **When Status changes to "Complete"**: Auto-fill Completion Date
- **When Status changes to "{{CLIENT_CONTACT}} Review"**: Send notification
- **When Priority changes to HIGH**: Move to top of current week view
- **When Target Date passes**: Flag as overdue

### Content Production Triggers
- **When new HIGH priority item added**: Auto-assign to current week
- **When Status = "In Progress"**: Start time tracking
- **When {{CLIENT_CONTACT}} adds notes**: Flag for creator attention
- **When Performance Notes added**: Update Quality Score

---

## 💾 CSV IMPORT DATA STRUCTURE

Here's the CSV structure with initial {{COMPANY_NAME}} content priorities:

```csv
Content Title,Content Type,Priority Level,Status,Target Location,Service Category,Primary Keyword,Target Date,Assigned Week,Content Format,Seasonal Relevance,Search Volume,Keyword Difficulty,{{CLIENT_CONTACT}} Notes
"Service A Guide City 1",Blog Post,HIGH,⏳ Planned,{{CITY_1}},{{SERVICE_CAT_1}},"[service] [city 1]",2025-08-20,Week 1 Aug,WordPress Blog,Year-Round,2400,Medium,"High priority - major service area"
"Service B Guide City 2",Blog Post,HIGH,⏳ Planned,{{CITY_2}},{{SERVICE_CAT_2}},"[service] [city 2]",2025-08-20,Week 1 Aug,WordPress Blog,Year-Round,1800,Low,"Office location focus"
"City 1 Service Social",Social Media,HIGH,✅ Complete,{{CITY_1}},{{SERVICE_CAT_2}},"[industry] [city 1]",2025-08-13,Week 1 Aug,Facebook Post,Year-Round,590,Low,"Test post - successful format"
"Service C City 3",Blog Post,HIGH,⏳ Planned,{{CITY_3}},{{SERVICE_CAT_3}},"[service c] [city 3]",2025-08-22,Week 1 Aug,WordPress Blog,Spring,3200,High,"High-value service"
"Service D City 4",Blog Post,HIGH,⏳ Planned,{{CITY_4}},{{SERVICE_CAT_4}},"[service d] [city 4]",2025-08-23,Week 1 Aug,WordPress Blog,Fall,2100,Medium,"Large market opportunity"
"City 2 Service A Social",Social Media,HIGH,⏳ Planned,{{CITY_2}},{{SERVICE_CAT_1}},"[service a] [city 2]",2025-08-14,Week 1 Aug,Facebook Post,Year-Round,1900,Medium,""
"City 3 Seasonal Social",Social Media,HIGH,⏳ Planned,{{CITY_3}},{{SERVICE_CAT_3}},"[service] [city 3]",2025-08-14,Week 1 Aug,Instagram Post,Spring,890,Low,"Seasonal timing"
"City 5 Services Guide",Blog Post,MEDIUM,⏳ Planned,{{CITY_5}},General,"[industry] [city 5]",2025-08-26,Week 2 Aug,WordPress Blog,Year-Round,320,Low,"Office location"
"City 6 Service A Guide",Blog Post,MEDIUM,⏳ Planned,{{CITY_6}},{{SERVICE_CAT_1}},"[service a] [city 6]",2025-08-27,Week 2 Aug,WordPress Blog,Year-Round,1100,Medium,"Market expansion"
"Fall Service Prevention",Blog Post,MEDIUM,⏳ Planned,{{STATE_1}},General,"fall [industry] [state]",2025-09-01,Week 1 Sep,WordPress Blog,Fall,480,Medium,"Seasonal content"
"Winter Prep Guide",Blog Post,MEDIUM,⏳ Planned,Multi-State,General,"winter [service] prevention",2025-10-01,Week 1 Oct,WordPress Blog,Fall,760,Low,"Seasonal preparation"
"Service ID Guide",Blog Post,LOW,⏳ Planned,{{STATE_1}},General,"common [services] [state]",2025-09-15,Week 3 Sep,WordPress Blog,Year-Round,320,Low,"Evergreen authority content"
"Commercial Guide",Blog Post,LOW,⏳ Planned,Multi-State,General,"commercial [industry]",2025-10-20,Week 3 Oct,WordPress Blog,Year-Round,110,Low,"Commercial audience"
"City 1 Location Page",Location Page,MEDIUM,⏳ Planned,{{CITY_1}},General,"[industry] [city 1]",2025-08-25,Week 1 Aug,Landing Page,Year-Round,590,Medium,"Local SEO optimization"
"City 2 Location Page",Location Page,MEDIUM,⏳ Planned,{{CITY_2}},General,"[industry] [city 2]",2025-09-01,Week 1 Sep,Landing Page,Year-Round,320,Low,"Office location page"
```

---

## 🔗 WEBHOOK INTEGRATION POSSIBILITIES

### Content Creation Workflow
1. **Status Change to "In Progress"**: Trigger N8N workflow to prepare content brief
2. **Agent Assignment**: Auto-route to appropriate content creation agent
3. **Status Change to "{{CLIENT_CONTACT}} Review"**: Send content to {{CLIENT_CONTACT}} via email/Slack
4. **{{CLIENT_CONTACT}} Approval**: Auto-update status and move to publishing queue

### Performance Tracking Integration
1. **Content Published**: Auto-create tracking entry for SEO monitoring
2. **Performance Data Available**: Update Performance Notes field
3. **Monthly Review**: Generate performance summary for {{CLIENT_CONTACT}}

### Content Planning Automation  
1. **New Month**: Auto-generate next month's content calendar
2. **Seasonal Trigger**: Add seasonal content to pipeline
3. **Priority Changes**: Re-sort production queue automatically

---

## 📱 MOBILE-FRIENDLY INTERFACE

### {{CLIENT_CONTACT}}'s Mobile Dashboard
**Key Views Optimized for Phone**:
- Current Week Status (what's being worked on)
- Items Awaiting His Review
- Recently Completed Content
- High Priority Items Queue

### Creator Mobile Views
- Today's Tasks (what to work on now)
- In Progress Items (current status)
- Content Brief Generator (quick content specs)

---

## 🎯 IMMEDIATE SETUP STEPS

1. **Create Table**: Import CSV structure into existing Airtable base
2. **Configure Views**: Set up the 6 filtered views listed above
3. **Test Webhook**: Verify integration with existing N8N workflows
4. **{{CLIENT_CONTACT}} Training**: Show {{CLIENT_CONTACT}} how to use his dashboard views
5. **Production Test**: Run first week's content through the system

---

*This Airtable structure provides complete visual management of all {{COMPANY_NAME}} content needs while integrating with your existing webhook system for automation possibilities.*

**Benefits**:
- ✅ Visual overview of entire content pipeline
- ✅ Easy priority adjustments based on {{CLIENT_CONTACT}} feedback
- ✅ Automated workflow integration ready
- ✅ Mobile-friendly for on-the-go management
- ✅ Performance tracking built-in