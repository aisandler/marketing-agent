# docx-js Workflow (JavaScript/TypeScript)

Use for Node.js environments or when building web applications.

## Complete Conversion Script

```javascript
const { Document, Packer, Paragraph, TextRun, HeadingLevel,
        AlignmentType, LevelFormat } = require('docx');
const fs = require('fs');

function markdownToDocx(markdownText, outputPath, options = {}) {
    const {
        fontName = 'Arial',
        fontSize = 24,  // Half-points (24 = 12pt)
        margins = { top: 1440, bottom: 1440, left: 1440, right: 1440 }
    } = options;

    const children = [];
    const lines = markdownText.split('\n');
    let inCodeBlock = false;
    let codeLines = [];

    // Numbering config for lists
    const numbering = {
        config: [{
            reference: "bullet-list",
            levels: [{
                level: 0,
                format: LevelFormat.BULLET,
                text: "\u2022",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 720, hanging: 360 } } }
            }]
        }, {
            reference: "number-list",
            levels: [{
                level: 0,
                format: LevelFormat.DECIMAL,
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 720, hanging: 360 } } }
            }]
        }]
    };

    for (const line of lines) {
        // Code blocks
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                children.push(new Paragraph({
                    children: [new TextRun({
                        text: codeLines.join('\n'),
                        font: 'Courier New',
                        size: 20
                    })]
                }));
                codeLines = [];
            }
            inCodeBlock = !inCodeBlock;
            continue;
        }

        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }

        // Headers
        if (line.startsWith('# ')) {
            children.push(new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun({ text: line.slice(2), bold: true, size: 32 })]
            }));
        } else if (line.startsWith('## ')) {
            children.push(new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun({ text: line.slice(3), bold: true, size: 28 })]
            }));
        } else if (line.startsWith('### ')) {
            children.push(new Paragraph({
                heading: HeadingLevel.HEADING_3,
                children: [new TextRun({ text: line.slice(4), bold: true, size: 24 })]
            }));
        }
        // Bullet lists
        else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            children.push(new Paragraph({
                numbering: { reference: "bullet-list", level: 0 },
                children: parseInlineFormatting(line.trim().slice(2))
            }));
        }
        // Numbered lists
        else if (/^\d+\.\s/.test(line.trim())) {
            children.push(new Paragraph({
                numbering: { reference: "number-list", level: 0 },
                children: parseInlineFormatting(line.trim().replace(/^\d+\.\s/, ''))
            }));
        }
        // Regular paragraph
        else if (line.trim()) {
            children.push(new Paragraph({
                children: parseInlineFormatting(line)
            }));
        }
    }

    const doc = new Document({
        numbering,
        styles: {
            default: {
                document: {
                    run: { font: fontName, size: fontSize }
                }
            }
        },
        sections: [{
            properties: {
                page: { margin: margins }
            },
            children
        }]
    });

    return Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(outputPath, buffer);
        return outputPath;
    });
}

function parseInlineFormatting(text) {
    const runs = [];
    let remaining = text;

    const patterns = [
        { regex: /\*\*\*(.+?)\*\*\*/, bold: true, italic: true },
        { regex: /\*\*(.+?)\*\*/, bold: true },
        { regex: /\*(.+?)\*/, italic: true },
        { regex: /`(.+?)`/, font: 'Courier New' }
    ];

    while (remaining) {
        let earliestMatch = null;
        let earliestPos = remaining.length;
        let matchedPattern = null;

        for (const p of patterns) {
            const match = remaining.match(p.regex);
            if (match && remaining.indexOf(match[0]) < earliestPos) {
                earliestMatch = match;
                earliestPos = remaining.indexOf(match[0]);
                matchedPattern = p;
            }
        }

        if (earliestMatch) {
            if (earliestPos > 0) {
                runs.push(new TextRun(remaining.slice(0, earliestPos)));
            }
            runs.push(new TextRun({
                text: earliestMatch[1],
                bold: matchedPattern.bold,
                italics: matchedPattern.italic,
                font: matchedPattern.font
            }));
            remaining = remaining.slice(earliestPos + earliestMatch[0].length);
        } else {
            runs.push(new TextRun(remaining));
            break;
        }
    }

    return runs;
}

// Usage
const markdown = fs.readFileSync('input.md', 'utf8');
markdownToDocx(markdown, 'output.docx', {
    fontName: 'Georgia',
    fontSize: 24
}).then(() => console.log('Document created!'));
```

## Dependencies

```bash
npm install docx
```

## Key Concepts

### Measurements
- Font sizes in half-points: `24` = 12pt, `32` = 16pt
- Margins in DXA (twentieths of a point): `1440` = 1 inch

### Numbering
- Use `LevelFormat.BULLET` constant (not string "bullet")
- Each reference creates an independent list
- Same reference continues numbering; different reference restarts at 1

### Styles
- Override built-in styles with IDs: "Heading1", "Heading2"
- Set default font via `styles.default.document.run.font`
