# Content Generation System Redesign

## Current State Analysis

### Existing LOCAL vs SYSTEMATIC Split
- **LOCAL_generation**: Blog posts, guides, location content - generated in-engine
- **SYSTEMATIC_generation**: Social media, visual content - sent to external platforms
- **Issue**: Split workflow creates complexity and off-platform dependencies

## New Architecture: Unified In-Engine Generation

### Core Principle
**Everything generates in-engine** with visual content receiving microbriefs

### Visual Content Microbrief System
For any content requiring visual elements (images, videos, graphics):

```yaml
visual_content_structure:
  content_file: "content/campaign-blog-post.md"
  microbrief_file: "content/microbriefs/campaign-blog-post-visual-brief.md"

microbrief_format:
  visual_description: "Detailed description of required visual elements"
  recommended_prompt: "AI image generation prompt ready for external tools"
  visual_specifications:
    - dimensions: "1200x630 for social sharing"
    - style: "Professional, modern, brand-aligned"
    - elements: ["Brand logo", "Key messaging overlay", "Hero image"]
  usage_context: "Where and how this visual will be used"
```

### Content Generation Validation Checkpoint

#### Phase 1: Content Inventory Approval
When CMO agent plans campaigns, present:
```
📋 PROPOSED CONTENT INVENTORY

Blog Posts (3):
• [Title] - 2000 words, SEO optimized
• [Title] - 1500 words, thought leadership
• [Title] - 1800 words, educational guide

Social Media Content (12):
• Instagram posts (4) - includes image microbriefs
• LinkedIn articles (3) - professional focus
• Facebook posts (5) - community engagement

Email Campaign (1):
• Newsletter - monthly format with CTA sections

Visual Content Requirements:
• 8 images (with microbriefs)
• 2 infographics (with detailed specs)
• 1 video concept (with storyboard brief)

✅ Approve & Generate    ❌ Modify Inventory    📝 Add Items
```

#### Phase 2: Pre-Generation Validation
Before any generation begins:
- User reviews and approves the complete content inventory
- User can modify, add, or remove items
- System only proceeds with explicit approval

## Implementation Changes

### 1. Remove LOCAL/SYSTEMATIC Classification
Replace with:
- **Text Content**: Generated fully in-engine
- **Visual Content**: Generated with microbrief companion files

### 2. CMO Agent Workflow Updates
```yaml
new_campaign_workflow:
  1. Strategy Development
  2. Content Inventory Presentation ← NEW CHECKPOINT
  3. User Approval Required ← NEW CHECKPOINT
  4. Content Generation with Microbriefs
  5. Delivery Summary with Visual Briefs
```

### 3. Microbrief Template
```markdown
# Visual Content Brief: [Content Title]

## Visual Description
[Detailed description of what the visual should show]

## Recommended AI Prompt
```
Create a [style] image featuring [elements]. The image should convey [mood/message] and include [specific details]. Style: [brand aesthetic], Colors: [brand colors], Composition: [layout description]
```

## Technical Specifications
- **Dimensions**: [width x height]
- **Format**: [PNG/JPG/etc]
- **Resolution**: [DPI if needed]
- **Brand Elements**: [logo placement, color requirements]

## Usage Context
- **Primary Use**: [main platform/purpose]
- **Secondary Uses**: [other applications]
- **Campaign Integration**: [how it fits the broader campaign]

## Content Integration
This visual accompanies: `[relative_path_to_content_file]`
```

## Benefits

### For Users
- **Unified Workflow**: All content generated in one place
- **Better Control**: Approve content before generation
- **Visual Clarity**: Detailed briefs for external visual creation
- **Reduced Complexity**: No platform-specific routing

### For System
- **Simplified Architecture**: Single generation path
- **Better Validation**: Checkpoint approval process
- **Comprehensive Delivery**: Content + visual guidance
- **Scalable**: Easy to add new content types

## Migration Strategy

1. **Phase 1**: Update CMO agent with approval checkpoint
2. **Phase 2**: Implement microbrief generation for visual content
3. **Phase 3**: Remove LOCAL/SYSTEMATIC classification
4. **Phase 4**: Update all specialist agents to use unified approach
5. **Phase 5**: Test complete workflow with validation checkpoints

## File Structure Changes
```
content/
├── blog-posts/
├── social-content/
├── email-campaigns/
├── microbriefs/          ← NEW
│   ├── visual-briefs/
│   └── video-briefs/
└── campaign-materials/

strategic-output/
├── content-inventory/    ← NEW
│   └── campaign-inventory-[date].md
```