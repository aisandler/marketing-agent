---
name: markdown-to-docs
description: Convert markdown content to Word (.docx) or Google Docs format with preserved formatting. Use when users need to transform markdown text, files, or clipboard content into professional Word documents for client sharing, approvals, or collaboration. Supports headers, lists, tables, code blocks, bold/italic styling, and custom output formatting (fonts, margins, colors).
---

# Markdown to Document Converter

Convert markdown content to professionally formatted Word (.docx) documents or Google Docs for client sharing and approval workflows.

## Quick Start

```bash
# Most common: Convert markdown file to Word
pandoc input.md -o output.docx

# With custom styling reference
pandoc input.md --reference-doc=template.docx -o output.docx
```

## Input Sources

| Source | How to Access |
|--------|---------------|
| **File** | Read the `.md` file directly |
| **Clipboard** | Ask user to paste content, or use `pbpaste` (macOS) / `xclip` (Linux) |
| **Direct paste** | User provides markdown in conversation |
| **Generated content** | AI-generated markdown from current session |

## Workflow Decision Tree

```
What output format is needed?
├─ Word (.docx)
│   ├─ Simple conversion → "Pandoc Workflow" below
│   ├─ Custom styling → "Styled Pandoc Workflow" below
│   └─ Programmatic/complex → "Python-docx Workflow" or read references/docx-js-workflow.md
├─ Google Docs
│   └─ Follow "Google Docs Export" section
└─ Both formats
    └─ Create .docx first, then upload to Google Drive
```

---

## Pandoc Workflow (Recommended)

Pandoc is the fastest and most reliable method for standard conversions.

### Basic Conversion

```bash
# Simple conversion
pandoc input.md -o output.docx

# From stdin (for clipboard/pasted content)
echo "$MARKDOWN_CONTENT" | pandoc -f markdown -o output.docx

# With table of contents
pandoc input.md --toc -o output.docx

# Standalone with metadata
pandoc input.md -s --metadata title="Document Title" -o output.docx
```

### Styled Conversion

```bash
# Step 1: Generate default reference template
pandoc -o custom-reference.docx --print-default-data-file reference.docx

# Step 2: Open custom-reference.docx in Word and modify:
# - Update styles (Heading 1, Heading 2, Body Text, etc.)
# - Set fonts, colors, margins
# - Save the document

# Step 3: Use template for conversion
pandoc input.md --reference-doc=custom-reference.docx -o output.docx
```

### Pandoc Options Reference

| Option | Purpose | Example |
|--------|---------|---------|
| `--toc` | Add table of contents | `pandoc input.md --toc -o output.docx` |
| `--toc-depth=N` | TOC heading depth | `--toc-depth=2` |
| `--reference-doc=FILE` | Use styling template | `--reference-doc=brand.docx` |
| `--metadata title="X"` | Set document title | `--metadata title="Report"` |
| `--highlight-style=STYLE` | Code highlighting | `--highlight-style=tango` |
| `-V margin-top=1in` | Set margins | `-V margin-left=1in -V margin-right=1in` |

**Code highlighting styles:** `pygments`, `tango`, `espresso`, `zenburn`, `kate`, `monochrome`, `breezedark`, `haddock`

---

## Python-docx Workflow

Use when you need programmatic control or complex document generation.

### Basic Conversion Script

```python
import re
from docx import Document
from docx.shared import Pt, Inches

def markdown_to_docx(markdown_text, output_path, font_name="Arial", font_size=11, margin_inches=1.0):
    """Convert markdown to Word document with formatting."""
    doc = Document()

    # Set margins
    for section in doc.sections:
        section.top_margin = Inches(margin_inches)
        section.bottom_margin = Inches(margin_inches)
        section.left_margin = Inches(margin_inches)
        section.right_margin = Inches(margin_inches)

    lines = markdown_text.split('\n')
    in_code_block = False
    code_content = []

    for line in lines:
        # Code blocks
        if line.startswith('```'):
            if in_code_block:
                p = doc.add_paragraph()
                p.style = 'No Spacing'
                run = p.add_run('\n'.join(code_content))
                run.font.name = 'Courier New'
                run.font.size = Pt(10)
                code_content = []
            in_code_block = not in_code_block
            continue

        if in_code_block:
            code_content.append(line)
            continue

        # Headers
        if line.startswith('# '):
            doc.add_heading(line[2:], level=1)
        elif line.startswith('## '):
            doc.add_heading(line[3:], level=2)
        elif line.startswith('### '):
            doc.add_heading(line[4:], level=3)
        # Bullet lists
        elif line.strip().startswith('- ') or line.strip().startswith('* '):
            text = line.strip()[2:]
            p = doc.add_paragraph(style='List Bullet')
            add_formatted_text(p, text)
        # Numbered lists
        elif re.match(r'^\d+\.\s', line.strip()):
            text = re.sub(r'^\d+\.\s', '', line.strip())
            p = doc.add_paragraph(style='List Number')
            add_formatted_text(p, text)
        # Regular paragraph
        elif line.strip():
            p = doc.add_paragraph()
            add_formatted_text(p, line)

    doc.save(output_path)
    return output_path

def add_formatted_text(paragraph, text):
    """Parse inline markdown and add formatted runs."""
    patterns = [
        (r'\*\*\*(.+?)\*\*\*', {'bold': True, 'italic': True}),
        (r'\*\*(.+?)\*\*', {'bold': True}),
        (r'\*(.+?)\*', {'italic': True}),
        (r'`(.+?)`', {'font_name': 'Courier New'}),
    ]
    remaining = text
    while remaining:
        earliest_match, earliest_pos, matched_fmt = None, len(remaining), None
        for pattern, fmt in patterns:
            match = re.search(pattern, remaining)
            if match and match.start() < earliest_pos:
                earliest_match, earliest_pos, matched_fmt = match, match.start(), fmt
        if earliest_match:
            if earliest_pos > 0:
                paragraph.add_run(remaining[:earliest_pos])
            run = paragraph.add_run(earliest_match.group(1))
            for attr, val in matched_fmt.items():
                if attr == 'bold': run.bold = val
                elif attr == 'italic': run.italic = val
                elif attr == 'font_name': run.font.name = val
            remaining = remaining[earliest_match.end():]
        else:
            paragraph.add_run(remaining)
            break

# Usage
markdown_text = open('input.md').read()
markdown_to_docx(markdown_text, 'output.docx')
```

### Custom Styling

```python
from docx.shared import Pt, RGBColor

def configure_styles(doc, heading_font='Georgia', body_font='Arial', heading_color='2C5282'):
    """Apply custom styling to document."""
    styles = doc.styles
    for level in range(1, 5):
        style = styles[f'Heading {level}']
        style.font.name = heading_font
        style.font.size = Pt(18 - (level * 2))
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(heading_color)
    styles['Normal'].font.name = body_font
    styles['Normal'].font.size = Pt(11)
    return doc
```

**For JavaScript/TypeScript:** Read `references/docx-js-workflow.md` for the docx-js implementation.

**For advanced styling (cover pages, headers/footers, tables):** Read `references/advanced-styling.md`.

---

## Google Docs Export

### Method 1: Via Google Drive API

```python
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def upload_to_google_docs(docx_path, doc_title):
    """Upload .docx to Google Drive as Google Doc."""
    creds = Credentials.from_authorized_user_file('token.json')
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': doc_title,
        'mimeType': 'application/vnd.google-apps.document'
    }
    media = MediaFileUpload(
        docx_path,
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    file = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
    return file.get('webViewLink')
```

### Method 2: Manual Upload

1. Convert markdown to .docx using Pandoc
2. Open Google Drive (drive.google.com)
3. Click "New" > "File upload" and select the .docx
4. Right-click uploaded file > "Open with" > "Google Docs"

---

## Formatting Preservation Guide

| Markdown | Word Equivalent | Notes |
|----------|-----------------|-------|
| `# Heading` | Heading 1 | Full support |
| `## Heading` | Heading 2 | Full support |
| `**bold**` | Bold | Full support |
| `*italic*` | Italic | Full support |
| `` `code` `` | Monospace | Uses Courier New |
| `- item` | Bullet list | Full support |
| `1. item` | Numbered list | Full support |
| `[text](url)` | Hyperlink | Pandoc handles automatically |
| `![alt](img)` | Embedded image | Pandoc embeds; python-docx needs extra handling |
| Tables | Word tables | Pandoc handles; python-docx needs manual parsing |
| `> quote` | Block quote | Indented paragraph style |
| Code blocks | Monospace paragraph | Styled with background in advanced usage |

---

## Customization Options

### Font Recommendations

| Use Case | Heading Font | Body Font |
|----------|--------------|-----------|
| Professional/Corporate | Arial | Arial |
| Traditional/Legal | Times New Roman | Times New Roman |
| Modern/Tech | Helvetica | Arial |
| Readable/Reports | Georgia | Verdana |

### Margin Presets

| Style | Top/Bottom | Left/Right | Use For |
|-------|------------|------------|---------|
| Normal | 1 inch | 1 inch | General documents |
| Narrow | 0.5 inch | 0.5 inch | More content per page |
| Wide | 1 inch | 1.5 inch | Easy reading |

---

## Common Workflows

### Client Deliverable

```bash
# Convert with professional template
pandoc content.md --reference-doc=company-template.docx -o deliverable.docx
```

### Approval Document

```bash
pandoc proposal.md --toc --metadata title="Project Proposal" -o proposal.docx
```

### Batch Conversion

```bash
for file in *.md; do
    pandoc "$file" -o "${file%.md}.docx"
done
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tables not rendering | Ensure proper pipe table format with header separator row |
| Code blocks no highlighting | Use `--highlight-style=pygments` |
| Custom styles not applied | Verify reference doc has exact style names: "Heading 1", "Body Text" |
| Images not embedding | For python-docx: `doc.add_picture('img.png', width=Inches(4))` |

---

## Dependencies

```bash
# Pandoc (primary tool) - macOS
brew install pandoc

# Pandoc - Ubuntu/Debian
sudo apt-get install pandoc

# Python library (for programmatic control)
pip install python-docx

# Node.js library (for JS/TS)
npm install docx

# Google API (for Docs export)
pip install google-api-python-client google-auth-oauthlib
```

---

## Reference Files

- **`references/advanced-styling.md`** - Cover pages, headers/footers, tables, color schemes, complete pipeline
- **`references/docx-js-workflow.md`** - Full JavaScript/TypeScript implementation with docx-js library
