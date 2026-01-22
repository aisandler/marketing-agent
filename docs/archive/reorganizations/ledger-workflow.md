# Document Ledger Maintenance Workflow

**Version**: 1.0  
**Last Updated**: 2025-08-05  
**Owner**: Technical Document Manager  

## Overview
This workflow ensures the Document Tracking Ledger remains current, accurate, and useful for the marketing organization. It defines processes for adding, updating, and maintaining document records.

---

## WORKFLOW PROCESSES

### 1. ADDING NEW DOCUMENTS TO THE LEDGER

#### When to Add Documents
- **Immediately** when any new .md file is created
- **Before** the document is used in production
- **During** document migration or reorganization

#### Process Steps

**Step 1: Document Creation**
```bash
# After creating any new .md file, run this check
find /Users/adamsandler/marketing-team -name "*.md" -newer DOCUMENT_TRACKING_LEDGER.md
```

**Step 2: Gather Document Information**
For each new document, collect:
- **Filename**: Full relative path from project root
- **Purpose**: 1-2 sentence description of document purpose
- **Category**: Select from approved category list
- **Status**: Usually `draft` for new documents
- **Owner**: Agent or team member responsible
- **Dependencies**: Other documents this one references or requires
- **Priority**: `high` | `medium` | `low` based on business impact

**Step 3: Categorize Document**
Use this decision tree to assign category:

```
Is it an agent configuration file?
├─ YES → system
└─ NO → Continue

Is it published content or content templates?
├─ YES → content-library/{published|drafts|templates|research}
└─ NO → Continue

Is it client-specific work or deliverables?
├─ YES → client-work/{deliverables|examples|templates|campaigns|proposals}
└─ NO → Continue

Is it operational processes, standards, or tracking?
├─ YES → operations/{processes|standards|resources|tracking|reporting|testing}
└─ NO → Continue

Is it strategic planning or research?
├─ YES → strategic-planning/{market-research|quarterly-plans|annual-strategies}
└─ NO → Continue

Is it system implementation or troubleshooting?
├─ YES → system/{implementation|troubleshooting|optimization}
└─ NO → Continue

Is it methodology or framework documentation?
├─ YES → methodology/{frameworks|training}
└─ NO → Assign 'other' and review with team
```

**Step 4: Update Ledger**
Add new row to appropriate section in `DOCUMENT_TRACKING_LEDGER.md`:

```markdown
| `new_document.md` | Document purpose | category/subcategory | draft | 2025-08-05 | owner-name | dependency1.md, dependency2.md | medium |
```

**Step 5: Update Statistics**
Increment totals in the Document Statistics section.

---

### 2. UPDATING EXISTING DOCUMENT RECORDS

#### When to Update
- **Daily**: When documents are modified
- **Weekly**: During regular audits
- **Monthly**: During comprehensive reviews

#### Update Triggers
- File modification date changes
- Document status changes (draft → active → archived)
- Ownership transfers
- Category reorganization
- New dependencies identified

#### Process Steps

**Step 1: Identify Changes**
```bash
# Find recently modified documents
find /Users/adamsandler/marketing-team -name "*.md" -mtime -7 -exec ls -la {} \;
```

**Step 2: Update Record Fields**
For each modified document:
- Update `Last Updated` field with current date
- Verify `Status` is still accurate
- Check if `Owner` has changed
- Review `Dependencies` for accuracy
- Adjust `Priority` if business needs changed

**Step 3: Document Change Log**
For significant changes, add note to ledger maintenance log.

---

### 3. DOCUMENT LIFECYCLE MANAGEMENT

#### Status Transitions
```
draft → active → archived → deprecated
  ↑       ↓         ↓
  └─── review-needed ←─────┘
```

**Draft to Active**
- Content is complete and reviewed
- Dependencies are satisfied
- Owner approval obtained

**Active to Review-Needed**
- Content may be outdated
- Dependencies have changed
- Accuracy concerns raised

**Active to Archived**
- Content is superseded by newer version
- No longer actively used but kept for reference
- Historical value maintained

**Archived to Deprecated**
- Content is obsolete
- Actively harmful if used
- Scheduled for deletion

#### Lifecycle Actions

**Monthly Review Process**:
1. **Audit Active Documents** (First Monday)
   - Verify content is current
   - Check all links and references
   - Confirm owner is still responsible

2. **Review Draft Documents** (Second Monday)
   - Identify stalled drafts
   - Reassign abandoned work
   - Convert completed drafts to active

3. **Clean Archived Documents** (Third Monday)
   - Evaluate archived documents for deprecation
   - Confirm historical value
   - Update archive organization

4. **Manage Dependencies** (Fourth Monday)
   - Verify all dependencies still exist
   - Update broken dependency links
   - Identify circular dependencies

---

### 4. AUTOMATED MAINTENANCE

#### Git Integration
```bash
# Pre-commit hook to check for untracked documents
#!/bin/bash
NEW_DOCS=$(find . -name "*.md" -newer DOCUMENT_TRACKING_LEDGER.md | wc -l)
if [ $NEW_DOCS -gt 0 ]; then
    echo "Warning: Found $NEW_DOCS new .md files. Update DOCUMENT_TRACKING_LEDGER.md"
    exit 1
fi
```

#### Weekly Automation Script
```bash
#!/bin/bash
# Run every Monday morning

echo "=== Weekly Document Ledger Maintenance ==="
echo "Date: $(date)"

# Find documents modified in last 7 days
echo "Recently modified documents:"
find /Users/adamsandler/marketing-team -name "*.md" -mtime -7

# Count total documents
TOTAL_DOCS=$(find /Users/adamsandler/marketing-team -name "*.md" | wc -l)
echo "Total documents: $TOTAL_DOCS"

# Check for untracked documents
echo "Checking for untracked documents..."
# This would need manual verification
```

---

### 5. QUALITY ASSURANCE

#### Daily QA Checklist
- [ ] All new documents added to ledger
- [ ] Modified documents have updated timestamps
- [ ] No broken dependencies
- [ ] Status fields are accurate

#### Weekly QA Checklist
- [ ] Statistics section updated
- [ ] Category distribution reviewed
- [ ] Priority assignments validated
- [ ] Owner assignments current

#### Monthly QA Checklist
- [ ] Full ledger audit completed
- [ ] Archived documents reviewed
- [ ] Category structure optimized
- [ ] Workflow processes updated

---

### 6. TROUBLESHOOTING COMMON ISSUES

#### Missing Documents in Ledger
```bash
# Find all .md files not in ledger
find /Users/adamsandler/marketing-team -name "*.md" > all_docs.txt
grep -o '`[^`]*\.md`' DOCUMENT_TRACKING_LEDGER.md | tr -d '`' > tracked_docs.txt
diff all_docs.txt tracked_docs.txt
```

#### Broken Dependencies
- Check if referenced documents still exist
- Update paths if documents moved
- Remove dependencies for deleted documents

#### Incorrect Categories
- Review category decision tree
- Consult with document owner
- Update category and move if necessary

#### Stale Status Fields
- Review last modification dates
- Check with document owners
- Update status based on current usage

---

### 7. WORKFLOW PERMISSIONS

#### Who Can Update Ledger
- **Technical Document Manager**: Full access
- **Agent Owners**: Can update their owned documents
- **Team Leads**: Can review and approve category changes

#### Change Approval Process
- **Minor Updates**: No approval needed (timestamps, status changes)
- **Category Changes**: Requires Technical Document Manager approval
- **Structure Changes**: Requires team consensus

---

### 8. INTEGRATION WITH MARKETING WORKFLOWS

#### Content Production Pipeline Integration
```
Content Creation → Document Added to Ledger → Review Process → Publication → Active Status
```

#### Agent Coordination Integration
```
Agent Creates Document → Auto-assign to Agent → Agent Updates Ledger → Weekly Review
```

#### Performance Tracking Integration
```
Document Usage Metrics → Priority Adjustment → Ledger Update → Resource Allocation
```

---

## MAINTENANCE SCHEDULE DETAILS

### Daily (5 minutes)
- Check for new documents created yesterday
- Update any modified document timestamps
- Review documents marked as `review-needed`

### Weekly (30 minutes)
- Run automated maintenance script
- Audit active documents for accuracy
- Process status change requests
- Update document statistics

### Monthly (2 hours)
- Full ledger review and cleanup
- Category structure evaluation
- Workflow process updates
- Quality assurance deep dive

---

## SUCCESS METRICS

### Ledger Accuracy
- **Target**: 99% of documents tracked
- **Measure**: Weekly audit completion rate

### Update Timeliness
- **Target**: Documents added within 24 hours of creation
- **Measure**: Daily new document detection

### Category Organization
- **Target**: 95% of documents in correct categories
- **Measure**: Monthly category audit results

### User Satisfaction
- **Target**: Easy document discovery
- **Measure**: Team feedback on ledger usefulness

---

**Workflow Owner**: Technical Document Manager  
**Next Review Date**: 2025-08-12  
**Version Control**: Track changes in git with clear commit messages