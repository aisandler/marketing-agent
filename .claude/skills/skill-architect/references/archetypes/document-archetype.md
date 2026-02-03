# Document Archetype

Skills for file format processing with decision trees, multiple workflows, and utility scripts.

## When to Use

- Processing specific file formats (PDF, DOCX, XLSX, etc.)
- Multiple operations on the same format (read, create, edit, merge)
- Need both documentation and executable scripts
- Operations have specific technical requirements

**Examples:** docx, pdf, pptx, xlsx

## Directory Structure

```
skill-name/
├── SKILL.md           # Decision tree + Workflows by operation
├── scripts/           # Utility scripts for operations
│   ├── extract.py
│   ├── convert.py
│   └── merge.py
├── references/        # Detailed technical docs
│   ├── advanced.md
│   └── format-spec.md
└── assets/            # Templates if needed
```

Document skills have **multiple workflows** and **utility scripts** for different operations.

## SKILL.md Structure

```markdown
---
name: my-document-skill
description: Comprehensive [format] processing for [operations list].
Use when working with [format] files for: (1) Creating, (2) Reading,
(3) Editing, (4) [Other operations].
---

# Format Processor

## Workflow Decision Tree

Determine the operation type:

```
What do you need to do?
├─ Read/Extract content → "Reading Workflow"
├─ Create new document → "Creation Workflow"
├─ Edit existing document → "Editing Workflow"
└─ [Other operation] → "[Other] Workflow"
```

## Quick Start

[Most common operation with minimal code example]

```python
# Simple read example
from library import Document
doc = Document('file.ext')
content = doc.read()
```

## Reading Workflow

### Step 1: Load the document
[Code example]

### Step 2: Extract content
[Code example]

### Step 3: Process as needed
[Code example]

## Creation Workflow

### Step 1: Initialize document
[Code example]

### Step 2: Add content
[Code example]

### Step 3: Save
[Code example]

## Editing Workflow

### Step 1: Load existing document
[Code example]

### Step 2: Modify content
[Code example]

### Step 3: Save changes
[Code example]

## Utility Scripts

### extract.py
Extract content from document:
```bash
python scripts/extract.py input.ext output.txt
```

### convert.py
Convert between formats:
```bash
python scripts/convert.py input.ext output.other
```

## Advanced Features

For advanced operations, see:
- **[Feature 1]**: See `references/advanced.md#feature-1`
- **[Feature 2]**: See `references/advanced.md#feature-2`

## Dependencies

```bash
pip install library1 library2
```
```

## Key Patterns

### Decision Tree First

Start with a decision tree to route to the right workflow:

```markdown
## Workflow Decision Tree

```
What type of modification?
├─ Creating new documents → Follow "Creation Workflow"
├─ Reading/extracting content → Follow "Reading Workflow"
├─ Editing existing documents:
│   ├─ Simple text changes → Follow "Basic Editing"
│   └─ Complex modifications → Follow "Advanced Editing"
└─ Converting formats → Follow "Conversion Workflow"
```
```

### Quick Start for Common Case

Provide immediate value for the most common use case:

```markdown
## Quick Start

Extract text from a PDF:

```python
import pdfplumber

with pdfplumber.open('document.pdf') as pdf:
    for page in pdf.pages:
        print(page.extract_text())
```
```

### Separate Workflows by Operation

Each workflow is self-contained:

```markdown
## Creation Workflow

### Step 1: Initialize
```python
from docx import Document
doc = Document()
```

### Step 2: Add content
```python
doc.add_heading('Title', 0)
doc.add_paragraph('Content here')
```

### Step 3: Save
```python
doc.save('output.docx')
```
```

### Utility Scripts for Common Operations

Include scripts for frequently-needed operations:

```markdown
## Utility Scripts

### rotate_pdf.py
Rotate pages in a PDF:
```bash
python scripts/rotate_pdf.py input.pdf output.pdf --angle 90
```

### merge_pdfs.py
Merge multiple PDFs:
```bash
python scripts/merge_pdfs.py file1.pdf file2.pdf -o merged.pdf
```
```

### Progressive Disclosure for Advanced Features

Link to reference files for complex operations:

```markdown
## Advanced Features

- **Form filling**: See `references/forms.md`
- **Track changes**: See `references/redlining.md`
- **XML manipulation**: See `references/ooxml.md`
```

## Description Pattern

```
Comprehensive [format] processing for [operation list]. Use when working
with [format] files for: (1) [Operation 1], (2) [Operation 2],
(3) [Operation 3], or any other [format] tasks.
```

**Example:**
```yaml
description: Comprehensive document creation, editing, and analysis with
support for tracked changes, comments, formatting preservation, and text
extraction. Use when working with professional documents (.docx files)
for: (1) Creating new documents, (2) Modifying or editing content,
(3) Working with tracked changes, (4) Adding comments, or any other
document tasks.
```

## Consistency Checklist

- [ ] Decision tree at the top for operation routing
- [ ] Quick start for most common use case
- [ ] Separate workflow sections for each operation type
- [ ] Each workflow has clear steps with code examples
- [ ] Utility scripts documented with usage examples
- [ ] Advanced features link to reference files
- [ ] Dependencies listed
- [ ] Description includes numbered operation list
