# Client Deployment System

This deployment system allows you to quickly customize the Marketing Team Base for any client across any industry.

## Quick Start

### 1. Create Client Configuration

Copy the template and customize for your client:

```bash
cp config/client.config.template.json config/my-client.config.json
# Edit my-client.config.json with your client's details
```

### 2. Generate Customized CLAUDE.md

```bash
python3 deployment/customize-claude.py config/my-client.config.json CLAUDE.md
```

This will generate a fully customized CLAUDE.md file with all template variables replaced with your client's specific information.

### 3. Sample Configurations

Sample configurations for various industries are available in `deployment/archive/sample-configs/`. Use `client-config-template.json` as the starting point for new client setups.

## Template Variables

The system uses these key variables that get replaced throughout all files:

### Client Information
- `{{COMPANY_NAME}}` - Client company name
- `{{INDUSTRY}}` - Industry type (home_services, hvac, roofing, landscaping, etc.)
- `{{BUSINESS_TYPE}}` - Business classification
- `{{WEBSITE_URL}}` - Client website
- `{{PHONE_NUMBER}}` - Client phone
- `{{SERVICE_AREA}}` - Service locations

### Content Strategy
- `{{CONTENT_TYPES}}` - Types of content to create
- `{{PRIMARY_CONTENT_TYPE}}` - Main content focus
- `{{CONTENT_LENGTH_REQUIREMENTS}}` - Word count requirements
- `{{EDUCATION_PROMOTION_RATIO}}` - Content balance

### Brand & Messaging
- `{{BRAND_VOICE_ATTRIBUTES}}` - Brand personality traits
- `{{CORE_MESSAGE}}` - Primary value proposition
- `{{MESSAGING_EMPHASIS_POINTS}}` - Key differentiators

### Technical Integration
- `{{AIRTABLE_TABLE_ID}}` - Airtable table identifier
- `{{WEBHOOK_URL}}` - N8N webhook endpoint
- `{{GITHUB_REPO_URL}}` - Repository location

## Industry-Specific Customization

### Legal Services
```json
{
  "client": {
    "industry": "legal_services",
    "businessType": "professional services"
  },
  "services": {
    "primary": ["Commercial Real Estate", "Residential Real Estate"],
    "practice_areas": {
      "commercial": ["Commercial Leasing", "1031 Exchanges", "Entity Formation"],
      "residential": ["Purchase/Sale", "Refinancing", "Estate Planning"]
    }
  }
}
```

### Real Estate
```json
{
  "client": {
    "industry": "real_estate",
    "businessType": "professional services"
  },
  "services": {
    "primary": ["Commercial Brokerage", "Residential Sales"],
    "specializations": {
      "commercial": ["Office Leasing", "Retail Space", "Industrial"],
      "residential": ["Luxury Homes", "Condos", "Investment Properties"]
    }
  }
}
```

## Verification

After deployment, verify the configuration:

```bash
# Check for any remaining template variables
grep -r "{{" CLAUDE.md

# Verify client-specific content
grep -i "your_client_name" CLAUDE.md
```

## Support

- Template variables are defined in `deployment/customize-claude.py`
- Sample configurations show real-world examples
- The base template `CLAUDE-template.md` contains all available placeholders
- For new industries, create a new sample config based on existing ones

## Multi-Client GitHub Branching Strategy

### Overview (Simple Terms)

Think of this like a **software franchise model**:
- **Master Template** (main branch) = Your core system with all improvements
- **Client Branches** = Individual client versions with their specific branding
- **Updates** = You improve the master, then "push" those improvements to all clients

### Setting Up Client Branches

```bash
# Create a new client branch
git checkout -b client-[CLIENT-NAME]

# Deploy client configuration
python3 deployment/customize-claude.py config/[CLIENT-NAME].config.json CLAUDE.md

# Push client branch to GitHub
git add .
git commit -m "Initial setup for [CLIENT-NAME]"
git push origin client-[CLIENT-NAME]
```

### Pushing Updates to All Clients

When you improve the system:

```bash
# 1. Make improvements in main branch
git checkout main
# Add your improvements...
git commit -m "Improve SEO optimization system"

# 2. Update each client with new improvements
for client in client-acme-services client-hvac-services client-roofing; do
  git checkout $client
  git merge main  # This brings your improvements to the client
  git push origin $client
done

# 3. Return to main for next development cycle
git checkout main
```

### Branch Structure

```
main (master template)
├── client-acme-services-il
├── client-comfort-aire-hvac
├── client-greenscape-landscaping
├── client-summit-roofing
└── [future-clients]
```

### Real-World Example

**Scenario**: You improve the SEO system

1. **Add improvements to `main` branch**:
   - Better keyword research
   - Enhanced local SEO templates
   - Improved content scoring

2. **Push to all clients**:
   ```bash
   ./deployment/update-all-clients.sh
   ```

3. **Each client automatically gets**:
   - Better SEO capabilities
   - Improved content quality
   - Latest system features
   - **BUT keeps their unique branding**

### Benefits

**For You**:
- Fix once, deploy everywhere
- Track what each client has
- Test improvements before deployment
- Scale to unlimited clients

**For Clients**:
- Always get latest improvements
- Keep their unique branding
- Reliable, tested updates
- Separate, private repositories

### Emergency Procedures

**If update breaks something**:
```bash
# Immediate rollback for affected client
git checkout client-[CLIENT-NAME]
git revert HEAD  # Undo the problematic update
git push origin client-[CLIENT-NAME]
```

**If client needs custom feature**:
```bash
# Add to their branch only
git checkout client-[CLIENT-NAME]
# Implement custom feature...
git commit -m "Custom feature for [CLIENT-NAME]"

# If beneficial to all clients, merge back to main
git checkout main
git cherry-pick [commit-hash]  # Bring the feature to main
# Then push to other clients as standard update
```

## Best Practices

1. **Always backup** the original CLAUDE.md before customization
2. **Test configuration** with sample content before full deployment
3. **Use consistent naming** for template variables across configs
4. **Document custom variables** for future reference
5. **Version control** client-specific configurations separately
6. **Test updates in main branch** before pushing to client branches
7. **Use meaningful commit messages** for easy rollback identification
8. **Keep client branches focused** on their specific customizations only