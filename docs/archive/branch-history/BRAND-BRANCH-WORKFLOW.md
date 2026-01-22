# Brand Branch Workflow

*Multi-brand repository management guide for Marketing Organization*

---

## Architecture Overview

This repository uses a **main + brand branches** architecture:

- **main branch**: Brand-agnostic system code, templates, and documentation
- **Brand branches**: Self-contained brand-specific content and configurations
- **Git manages isolation**: Switching branches = automatic content switching

### Key Principle

Brand-specific content is **committed to brand branches**, so Git automatically shows/hides content when you switch branches. No manual copying needed!

---

## Main Branch (Current)

**Purpose**: Brand-agnostic system that can be forked for any brand

**Contains**:
- ✅ System documentation (CLAUDE.md, docs/)
- ✅ Automation scripts (automation/)
- ✅ Agent configurations (.claude/commands/)
- ✅ System templates (content/templates/, client-context/templates/, onboarding/templates/)
- ✅ Dashboard and API code (dashboard/, planning-api-server/)

**Gitignores** (never commits):
- 🚫 Brand-specific content (client-brand/, content/blog-posts/, etc.)
- 🚫 Brand configurations (.claude/settings.local.json, .claude/memory/)
- 🚫 Analytics and strategic output

**Current Status**:
- Clean, brand-agnostic foundation
- Ready to merge system updates into brand branches
- Templates tracked for system-wide improvements

---

## Brand Branches

**Purpose**: Dedicated branch per client with all brand-specific content

**Structure**:
```
brand-name/
├── (inherits all system code from main)
├── .gitignore (MODIFIED - removes brand content exclusions)
├── .claude/
│   ├── settings.local.json (brand-specific welcome message)
│   └── memory/brand-core.md (brand foundation)
├── client-brand/ (brand assets)
├── client-context/
│   ├── brand/ (configured brand instances)
│   ├── business/ (business context)
│   └── keywords/ (SEO keywords)
├── content/
│   ├── blog-posts/ (published content)
│   ├── email-campaigns/
│   └── social-media/
├── analytics/ (performance data)
├── strategic-output/ (campaign outputs)
└── onboarding/intake/ (client materials)
```

**All brand content is committed to Git** on the brand branch, so switching branches automatically loads/unloads content.

---

## Creating a New Brand Branch

### Step 1: Create Branch from Main

```bash
git checkout main
git pull  # Ensure you have latest system updates
git checkout -b brand-name
```

### Step 2: Modify .gitignore

Edit `.gitignore` and **comment out or remove** these lines:

```gitignore
# Brand-specific content (keep main branch agnostic)
# client-brand/                    # ← Comment out for brand branch
# client-context/brand/
# client-context/business/
# content/blog-posts/
# content/*.md
# analytics/
# strategic-output/
# .claude/settings.local.json
# .claude/memory/
```

This allows Git to track brand content in this branch.

###Step 3: Add Brand-Specific Content

```bash
# From backup (if migrating existing brand)
cp -r /path/to/backup/client-brand ./
cp -r /path/to/backup/client-context/brand ./client-context/
cp -r /path/to/backup/content/blog-posts ./content/
# ... etc for other directories

# Or create fresh (for new brand)
mkdir -p client-brand client-context/brand content/blog-posts
```

### Step 4: Configure Claude Settings

```bash
# Copy template
cp .claude/settings.local.json.template .claude/settings.local.json

# Edit welcome message (line 61)
# Change: "Marketing Organization - Brand Agnostic Mode"
# To: "BRAND NAME Marketing Engine"
```

### Step 5: Create Brand Memory

```bash
mkdir -p .claude/memory

# Create .claude/memory/brand-core.md
# Use CLAUDE.template.md for structure
```

### Step 6: Commit Brand Content

```bash
git add -A
git commit -m "feat: Initialize BRAND_NAME brand branch

Brand-specific content and configurations for BRAND_NAME.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push -u origin brand-name
```

---

## Daily Workflow

### Switching to a Brand

```bash
git checkout brand-name
# ✅ All brand content appears automatically
# ✅ Claude loads brand-specific memory
# ✅ Ready to work immediately
```

### Switching to Main

```bash
git checkout main
# ✅ All brand content disappears
# ✅ Clean, agnostic system
# ✅ Ready for system development
```

### Working in a Brand

```bash
# On brand branch
git checkout hydr8

# Make changes to content, strategies, etc.
# Edit files normally

# Commit as usual
git add .
git commit -m "Add Q1 content calendar"
git push
```

---

## System Updates

When you improve the **main branch** (fix bugs, update agents, add features):

### Option 1: Merge Main into Brand Branch

```bash
git checkout brand-name
git merge main -m "Merge system updates from main"
# Resolve any conflicts (rare - brand content is isolated)
git push
```

### Option 2: Rebase Brand onto Main (Clean History)

```bash
git checkout brand-name
git rebase main
# Resolve conflicts if any
git push --force-with-lease
```

### Option 3: Recreate Brand Branch (Fresh Start)

If main has changed significantly:

```bash
# Backup brand content first
git checkout brand-name
mkdir ../brand-backup-temp
cp -r client-brand content analytics .claude ../brand-backup-temp/

# Create fresh branch
git checkout main
git branch -D brand-name  # Delete old branch
git checkout -b brand-name

# Restore content (follow "Creating New Brand Branch" steps)
```

---

## Branch Isolation Behavior

### What Stays Across Branches
- ✅ System code (automation/, docs/, .claude/commands/)
- ✅ Templates (content/templates/, etc.)
- ✅ Git configuration (.gitignore on main)

### What Changes Per Branch
- 🔄 .gitignore (modified on brand branches)
- 🔄 .claude/settings.local.json (brand-specific)
- 🔄 .claude/memory/ (brand-specific)
- 🔄 All gitignored directories (client-brand/, content/, etc.)

### Important Notes

1. **Untracked files persist**: If you create a file in a gitignored directory on main, it won't disappear when switching branches (because it's untracked). Solution: Don't create brand content on main.

2. **Committed files switch automatically**: Once content is committed on a brand branch, Git manages it perfectly.

3. **Templates can diverge**: System templates are tracked on main, but brand branches can modify them. Merging main will update templates unless the brand customized them.

---

## Backup Strategy

### Before Major Changes

```bash
# Backup current branch content
git checkout brand-name
tar -czf "../brand-name-backup-$(date +%Y%m%d).tar.gz" \
  client-brand client-context content analytics strategic-output .claude/memory
```

### Regular Backups

```bash
# Push all branches to remote
git push --all origin

# Remote backup serves as your safety net
```

---

## Current Brands

Based on backup analysis:

- **HYDR8** - Commercial water & ice systems (most complete)
- **Face First** - Live events ticketing marketplace (investor materials)
- **Viable Edge** - Marketing materials (various documents)

**Next Step**: Create brand branches for active clients using the workflow above.

---

## Troubleshooting

### "Content not appearing when I switch branches"

**Cause**: Content is gitignored and not committed to the branch.

**Solution**:
1. Check `.gitignore` on the brand branch - should have brand content uncommented
2. Verify content is committed: `git ls-files client-brand/`
3. If not committed: `git add -f client-brand/ && git commit -m "Track brand content"`

### "Content from Brand A showing up in Brand B"

**Cause**: Content exists as untracked files in working directory.

**Solution**:
1. Delete the unwanted content: `rm -rf client-brand/`
2. Switch to correct branch: `git checkout brand-b`
3. Content should reappear automatically (if properly committed)

### "Merge conflicts when updating from main"

**Cause**: Both main and brand branch modified the same system file.

**Solution**:
1. Review conflict: System update vs. brand customization
2. Usually keep brand customization for brand-specific files
3. Keep main version for system files
4. Test after resolving

---

*Last Updated: October 17, 2025*
*Main Branch Commit: 0518937*
*Backup Location: `../brand-content-backup-20251017/`*
