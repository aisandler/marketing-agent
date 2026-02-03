# Advanced Styling Reference

Deep customization options for markdown-to-document conversion.

## Custom Pandoc Reference Documents

### Creating a Brand Template

1. Generate the default reference:
```bash
pandoc -o reference.docx --print-default-data-file reference.docx
```

2. Open in Word and customize these styles:
   - **Title** - Document title style
   - **Heading 1-6** - Section headers
   - **Body Text** / **Normal** - Main content
   - **First Paragraph** - Opening paragraphs
   - **Source Code** - Code blocks
   - **Block Text** - Block quotes
   - **Definition Term** / **Definition** - Definition lists
   - **Table** - Table styling
   - **Figure** - Image captions
   - **Hyperlink** - Link appearance

3. Set document defaults:
   - Page margins
   - Header/footer content
   - Default font and size

4. Save and use:
```bash
pandoc input.md --reference-doc=brand-template.docx -o output.docx
```

### Style Name Mapping

| Pandoc Element | Word Style Name |
|----------------|-----------------|
| `# H1` | Heading 1 |
| `## H2` | Heading 2 |
| Regular text | Body Text or First Paragraph |
| Code blocks | Source Code |
| `> quotes` | Block Text |
| Table | Table |
| Image | Figure |

---

## Python-docx Advanced Patterns

### Table Conversion

```python
import re
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def parse_markdown_table(table_text):
    """Parse markdown table into rows and detect alignment."""
    lines = [l.strip() for l in table_text.strip().split('\n') if l.strip()]
    if len(lines) < 2:
        return None, None

    # Parse header
    header = [cell.strip() for cell in lines[0].split('|')[1:-1]]

    # Parse alignment from separator row
    separator = lines[1]
    alignments = []
    for cell in separator.split('|')[1:-1]:
        cell = cell.strip()
        if cell.startswith(':') and cell.endswith(':'):
            alignments.append('center')
        elif cell.endswith(':'):
            alignments.append('right')
        else:
            alignments.append('left')

    # Parse data rows
    rows = []
    for line in lines[2:]:
        row = [cell.strip() for cell in line.split('|')[1:-1]]
        rows.append(row)

    return {'header': header, 'rows': rows, 'alignments': alignments}, None

def add_table_to_doc(doc, table_data):
    """Add parsed table to document with styling."""
    num_cols = len(table_data['header'])
    table = doc.add_table(rows=1, cols=num_cols)
    table.style = 'Table Grid'

    # Add header
    header_cells = table.rows[0].cells
    for i, text in enumerate(table_data['header']):
        header_cells[i].text = text
        # Bold header
        for paragraph in header_cells[i].paragraphs:
            for run in paragraph.runs:
                run.bold = True

    # Add data rows
    for row_data in table_data['rows']:
        row = table.add_row()
        for i, text in enumerate(row_data):
            row.cells[i].text = text

    return table
```

### Image Handling

```python
import re
import os
import urllib.request
from docx import Document
from docx.shared import Inches

def process_images(doc, markdown_text, base_path=''):
    """Extract and embed images from markdown."""
    # Pattern: ![alt](src "title")
    img_pattern = r'!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)'

    for match in re.finditer(img_pattern, markdown_text):
        alt_text = match.group(1)
        src = match.group(2)
        title = match.group(3) or alt_text

        try:
            if src.startswith('http'):
                # Download remote image
                temp_path = f'/tmp/img_{hash(src)}.png'
                urllib.request.urlretrieve(src, temp_path)
                img_path = temp_path
            else:
                # Local image
                img_path = os.path.join(base_path, src)

            if os.path.exists(img_path):
                doc.add_picture(img_path, width=Inches(5))
                if title:
                    caption = doc.add_paragraph(title)
                    caption.style = 'Caption'
        except Exception as e:
            # Add placeholder for failed images
            doc.add_paragraph(f'[Image: {alt_text}]')

    return doc
```

### Headers and Footers

```python
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_header_footer(doc, header_text='', footer_text='', include_page_numbers=True):
    """Add headers and footers to document."""
    for section in doc.sections:
        # Header
        header = section.header
        header_para = header.paragraphs[0]
        header_para.text = header_text
        header_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT

        # Footer
        footer = section.footer
        footer_para = footer.paragraphs[0]

        if include_page_numbers:
            footer_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            # Add page number field
            run = footer_para.add_run()
            fld_char1 = OxmlElement('w:fldChar')
            fld_char1.set(qn('w:fldCharType'), 'begin')
            run._r.append(fld_char1)

            instr_text = OxmlElement('w:instrText')
            instr_text.text = "PAGE"
            run._r.append(instr_text)

            fld_char2 = OxmlElement('w:fldChar')
            fld_char2.set(qn('w:fldCharType'), 'end')
            run._r.append(fld_char2)
        else:
            footer_para.text = footer_text
            footer_para.alignment = WD_ALIGN_PARAGRAPH.CENTER

    return doc

# Import for OxmlElement
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
```

### Cover Page

```python
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_cover_page(doc, title, subtitle='', author='', date=''):
    """Add a cover page to the document."""
    # Add spacing from top
    for _ in range(8):
        doc.add_paragraph()

    # Title
    title_para = doc.add_paragraph()
    title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title_para.add_run(title)
    title_run.bold = True
    title_run.font.size = Pt(28)

    # Subtitle
    if subtitle:
        doc.add_paragraph()
        sub_para = doc.add_paragraph()
        sub_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        sub_run = sub_para.add_run(subtitle)
        sub_run.font.size = Pt(16)
        sub_run.italic = True

    # Spacing
    for _ in range(4):
        doc.add_paragraph()

    # Author
    if author:
        author_para = doc.add_paragraph()
        author_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        author_para.add_run(author)

    # Date
    if date:
        date_para = doc.add_paragraph()
        date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        date_para.add_run(date)

    # Page break after cover
    doc.add_page_break()

    return doc
```

---

## Color Schemes

### Professional Palettes

```python
# Corporate Blue
CORPORATE_BLUE = {
    'primary': '1E3A5F',      # Dark blue (headings)
    'secondary': '3D5A80',    # Medium blue (subheadings)
    'accent': '98C1D9',       # Light blue (highlights)
    'text': '333333',         # Dark gray (body)
    'background': 'FFFFFF'    # White
}

# Modern Gray
MODERN_GRAY = {
    'primary': '2D3436',      # Charcoal (headings)
    'secondary': '636E72',    # Gray (subheadings)
    'accent': '00B894',       # Teal (highlights)
    'text': '2D3436',         # Charcoal (body)
    'background': 'FFFFFF'    # White
}

# Warm Professional
WARM_PROFESSIONAL = {
    'primary': '6B4423',      # Brown (headings)
    'secondary': '8B6914',    # Gold (subheadings)
    'accent': 'D4A574',       # Tan (highlights)
    'text': '333333',         # Dark gray (body)
    'background': 'FFFEF7'    # Cream
}

def apply_color_scheme(doc, scheme):
    """Apply color scheme to document styles."""
    from docx.shared import RGBColor

    styles = doc.styles

    # Headings
    for i, style_name in enumerate(['Heading 1', 'Heading 2', 'Heading 3']):
        style = styles[style_name]
        color = scheme['primary'] if i == 0 else scheme['secondary']
        style.font.color.rgb = RGBColor.from_string(color)

    # Body text
    normal = styles['Normal']
    normal.font.color.rgb = RGBColor.from_string(scheme['text'])

    return doc
```

---

## Complete Conversion Pipeline

```python
import os
from datetime import datetime
from docx import Document
from docx.shared import Pt, Inches

def full_markdown_to_docx(markdown_text, output_path, config=None):
    """
    Complete markdown to docx conversion with all features.

    Config options:
    - title: Document title
    - subtitle: Document subtitle
    - author: Author name
    - date: Date string (or 'auto' for current date)
    - include_toc: Add table of contents
    - cover_page: Add cover page
    - header_text: Header content
    - footer_text: Footer content
    - page_numbers: Include page numbers
    - font_name: Body font
    - font_size: Body font size (pt)
    - heading_font: Heading font
    - margins: Dict with top, bottom, left, right (inches)
    - color_scheme: Dict with primary, secondary, accent, text colors
    """
    config = config or {}

    doc = Document()

    # Apply margins
    margins = config.get('margins', {'top': 1, 'bottom': 1, 'left': 1, 'right': 1})
    for section in doc.sections:
        section.top_margin = Inches(margins.get('top', 1))
        section.bottom_margin = Inches(margins.get('bottom', 1))
        section.left_margin = Inches(margins.get('left', 1))
        section.right_margin = Inches(margins.get('right', 1))

    # Apply fonts
    font_name = config.get('font_name', 'Arial')
    font_size = config.get('font_size', 11)
    heading_font = config.get('heading_font', font_name)

    styles = doc.styles
    styles['Normal'].font.name = font_name
    styles['Normal'].font.size = Pt(font_size)

    for i in range(1, 5):
        styles[f'Heading {i}'].font.name = heading_font

    # Apply color scheme if provided
    if 'color_scheme' in config:
        apply_color_scheme(doc, config['color_scheme'])

    # Add cover page if requested
    if config.get('cover_page'):
        date_str = config.get('date', '')
        if date_str == 'auto':
            date_str = datetime.now().strftime('%B %d, %Y')

        add_cover_page(
            doc,
            config.get('title', 'Document'),
            config.get('subtitle', ''),
            config.get('author', ''),
            date_str
        )

    # Add headers/footers
    if config.get('header_text') or config.get('page_numbers'):
        add_header_footer(
            doc,
            config.get('header_text', ''),
            config.get('footer_text', ''),
            config.get('page_numbers', True)
        )

    # Convert markdown content
    # ... (use main conversion logic from SKILL.md)

    doc.save(output_path)
    return output_path

# Example usage
config = {
    'title': 'Project Proposal',
    'subtitle': 'Q1 2024 Initiative',
    'author': 'John Smith',
    'date': 'auto',
    'cover_page': True,
    'page_numbers': True,
    'header_text': 'CONFIDENTIAL',
    'font_name': 'Georgia',
    'heading_font': 'Arial',
    'font_size': 11,
    'margins': {'top': 1, 'bottom': 1, 'left': 1.25, 'right': 1},
    'color_scheme': CORPORATE_BLUE
}

full_markdown_to_docx(markdown_text, 'proposal.docx', config)
```
