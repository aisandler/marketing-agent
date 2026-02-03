# Example Configurations

Ready-to-use configuration examples spanning three market verticals. Copy an example to your `config/` directory and customize for your brand.

## Quick Start

```bash
# 1. Choose an example that matches your industry
# 2. Copy the files to your config directory
cp config/examples/home-services/hvac/*.json config/

# 3. Customize the values for your brand
# 4. Run /onboard to complete setup
```

## Available Examples

### Home Services
Local service businesses with geographic focus and seasonal patterns.

| Example | Industry | Location | Use Case |
|---------|----------|----------|----------|
| **hvac/** | HVAC | Denver, CO | Heating & cooling services |
| **landscaping/** | Landscaping | Phoenix, AZ | Outdoor design & maintenance |
| **pest-control/** | Pest Control | Dixon, IL | Pest prevention & treatment |
| **roofing/** | Roofing | Phoenix, AZ | Roof repair & installation |

### SaaS
B2B software companies with digital-first marketing.

| Example | Industry | Focus | Use Case |
|---------|----------|-------|----------|
| **project-management/** | Project Management | B2B SaaS | Team collaboration software |

### Professional Services
B2B service businesses with expertise-driven marketing.

| Example | Industry | Location | Use Case |
|---------|----------|----------|----------|
| **marketing-agency/** | Marketing | Austin, TX | Digital marketing services |

## File Structure

Each example contains three configuration files:

```
example-name/
├── brand.json           # Visual identity, colors, content pillars
├── partners.json        # Team members, accounts, portal colors
└── client.config.json   # Full business configuration
```

### brand.json
Core brand identity for content generation and image styling:
- Brand name and tagline
- Color palette (primary, secondary, accent)
- Image style directive for AI generation
- Content pillars and focus areas

### partners.json
Team configuration for portal and content attribution:
- Social media accounts per team member
- Display names and initials
- UI color coding for the portal
- Email addresses for notifications

### client.config.json
Complete business configuration:
- Service area and locations
- Airtable integration settings
- Branding and messaging
- Services (primary, secondary, seasonal)
- SEO keywords and topics
- Competitive positioning
- Lead generation strategy
- Content strategy and publishing cadence

## Customization Guide

### Minimal Setup
1. Update `client.name` and `client.website` in client.config.json
2. Update `name` in brand.json
3. Update team names in partners.json

### Full Setup
1. Complete all fields in client.config.json
2. Update color palette in brand.json
3. Configure team accounts in partners.json
4. Run `/onboard` to generate remaining brand files

## Notes

- Examples use placeholder values like `{{AIRTABLE_BASE_ID}}` for sensitive data
- Service areas and competitors are fictional but realistic
- Seasonal patterns are region-appropriate
- All examples are production-tested configurations
