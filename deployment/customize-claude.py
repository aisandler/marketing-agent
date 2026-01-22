#!/usr/bin/env python3
"""
Marketing Engine CLAUDE.md Customization Script
Generates client-specific CLAUDE.md from template using client configuration
"""

import json
import sys
import os
from typing import Dict, Any
import re

def load_client_config(config_path: str) -> Dict[str, Any]:
    """Load and parse client configuration JSON"""
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Configuration file not found: {config_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in configuration file: {e}")
        sys.exit(1)

def load_template() -> str:
    """Load the CLAUDE.md template"""
    template_path = os.path.join(os.path.dirname(__file__), '..', 'CLAUDE-template.md')
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: Template file not found: {template_path}")
        sys.exit(1)

def create_substitution_map(config: Dict[str, Any]) -> Dict[str, str]:
    """Create mapping of template variables to actual values"""

    # Extract values from config with fallbacks
    client = config.get('client', {})
    branding = config.get('branding', {})
    services = config.get('services', {})
    seo = config.get('seo', {})
    content_strategy = config.get('contentStrategy', {})
    airtable = config.get('airtable', {})

    # Determine content types and structure
    content_types = ', '.join(content_strategy.get('contentTypes', ['Blog Posts', 'Social Media Posts', 'Location Pages']))
    primary_content_type = content_strategy.get('contentTypes', ['Blog Posts'])[0]

    # Build substitution mapping
    substitutions = {
        # Basic client info
        'COMPANY_NAME': client.get('name', 'Your Company'),
        'INDUSTRY': client.get('industry', 'service'),
        'BUSINESS_TYPE': client.get('businessType', 'local service business'),
        'WEBSITE_URL': client.get('website', 'https://yourcompany.com'),
        'SERVICE_AREA': ', '.join(client.get('serviceArea', {}).get('secondary', ['Your Service Area'])),
        'GITHUB_REPO_URL': f"https://github.com/your-org/marketing-team-{client.get('name', 'client').lower().replace(' ', '-')}",

        # Content strategy
        'CONTENT_TYPES': content_types,
        'PRIMARY_CONTENT_TYPE': primary_content_type,
        'SECONDARY_CONTENT_TYPES': ', '.join(content_strategy.get('contentTypes', ['Social Media Posts', 'Location Pages'])[1:]),
        'KEYWORD_REQUIRED_CONTENT_TYPES': f"{primary_content_type} & Location Pages",
        'MONTH': 'September',  # Default planning month

        # Airtable integration
        'AIRTABLE_TABLE_ID': airtable.get('tableId', 'tblYourTableId'),

        # Content requirements
        'MIN_WORD_COUNT': '1000',
        'CONTENT_LENGTH_REQUIREMENTS': '1,000-1,500 words (comprehensive format)',
        'EDUCATION_PROMOTION_RATIO': '70% educational content, 30% professional service promotion',
        'CONTENT_STRUCTURE_REQUIREMENTS': 'Multi-section format with detailed information, comprehensive guides, and extensive educational content',

        # Brand voice and requirements
        'BRAND_VOICE_ATTRIBUTES': ', '.join(branding.get('personality', ['professional', 'trustworthy', 'knowledgeable'])),
        'BRAND_VOICE_DESCRIPTION': f"{', '.join(branding.get('personality', ['professional', 'trustworthy', 'knowledgeable']))} - customer-centered approach",
        'READING_LEVEL_REQUIREMENTS': 'Accessible for average customers - assume beginners/new customers',

        # Writing guidelines
        'NEVER_USE_LIST': 'Em dashes, excessive emojis, overly casual language, location-specific references in social media',
        'NEVER_CREATE_LIST': 'Fictional examples, made-up information, specific people/names, fake testimonials',
        'ALWAYS_USE_LIST': 'Accurate, verified information only',
        'AUTHORITY_BUILDING_REQUIREMENTS': f"Reference {branding.get('experience', 'years of')} experience, use real customer reviews, cite credible sources",
        'CONTENT_FOCUS_REQUIREMENTS': 'Start with problem → provide practical solutions → end with call to action',

        # SEO and content specifics
        'LOCATION_DENSITY_REQUIREMENTS': '5-7 location mentions per 1,000 words',
        'SEASONAL_INTEGRATION_REQUIREMENTS': 'Season mentioned 3-4 times throughout content',
        'LONG_TAIL_KEYWORD_PATTERNS': f'"{primary_content_type.lower()} in [Location] [Season]" patterns integrated naturally',
        'REGIONAL_FOCUS_REQUIREMENTS': f"{client.get('serviceArea', {}).get('region', 'Regional')}-specific focus and local environmental factors",

        # Social media requirements
        'SECONDARY_CONTENT_LENGTH': '50-150 words maximum (excluding headline and CTA)',
        'SECONDARY_CONTENT_STRUCTURE': 'Compelling headline → Problem identification → Solution/insight → Clear call-to-action',
        'SECONDARY_CONTENT_MIX': '40% problem/solution, 30% educational, 20% reviews, 10% seasonal/promotional',
        'SECONDARY_LOCATION_STRATEGY': 'NO location-specific references (works across service areas)',

        # Content structure requirements
        'OPENING_HOOK_REQUIREMENTS': '200-300 words with detailed scenarios and seasonal context',
        'EDUCATION_SECTION_REQUIREMENTS': '600-800 words on detailed information and identification',
        'PREVENTION_SECTION_REQUIREMENTS': '500-700 words with step-by-step instructions',
        'SERVICE_SECTION_REQUIREMENTS': '300-400 words maximum (maintain 70/30 ratio)',
        'CTA_PLACEMENT_REQUIREMENTS': 'Multiple placement throughout content (25%, 50%, 75% completion points)',

        # Quality requirements
        'LOCATION_MENTION_FREQUENCY': '5-7 times per 1,000 words',
        'SEASONAL_KEYWORD_FREQUENCY': '3-4 times',
        'INDUSTRY_SPECIFIC_REQUIREMENTS': f"{client.get('industry', 'Service')}-specific details and terminology included",
        'FORBIDDEN_ELEMENTS': 'em dashes, excessive emojis, or fictional content',
        'AUTHORITY_REQUIREMENTS': f"{branding.get('experience', 'years of')} experience reference",
        'CREDIBLE_SOURCES': f"industry associations, {client.get('industry', 'service')} authorities, government resources",
        'SECONDARY_CONTENT_REQUIREMENTS': '50-150 words, NO location references',

        # Strategic focus
        'LOCAL_SEO_STRATEGY_POINTS': f"- {primary_content_type.lower()} identification guides and seasonal strategies\n- Location-specific content for {client.get('serviceArea', {}).get('primary', 'service areas')}\n- {', '.join(services.get('primary', ['Professional services']))} solutions\n- Agent-driven development process with quality assurance",

        # Marketing focus
        'CORE_MESSAGE': branding.get('primaryMessage', 'Professional Service You Can Trust'),
        'MESSAGING_EMPHASIS_POINTS': '\n- '.join([''] + branding.get('differentiators', ['Local expertise', 'Professional results', 'Customer satisfaction', 'Reliable service'])),
        'PERFORMANCE_TARGETS': f"- Top 3 local search rankings\n- Improved website conversion\n- Faster content cycles\n- Competitive market share growth through volume and quality",

        # Agent coordination
        'PRIMARY_AGENTS': 'content-marketing-strategist + lead-writer',
        'SEASONAL_STRATEGIES': f"{primary_content_type} Prevention",

        # Content folder structure
        'CONTENT_FOLDER': primary_content_type.lower().replace(' ', '-'),

        # Required fields
        'REQUIRED_FIELDS': f"Keywords + Search Volume for {primary_content_type} & Location Pages",

        # Phone and contact
        'PHONE_NUMBER': client.get('phone', '(555) 123-4567'),
    }

    return substitutions

def apply_substitutions(template: str, substitutions: Dict[str, str]) -> str:
    """Apply variable substitutions to template"""
    content = template

    # Replace all {{VARIABLE}} patterns
    for key, value in substitutions.items():
        pattern = f"{{{{{key}}}}}"
        content = content.replace(pattern, str(value))

    return content

def generate_seasonal_calendar(config: Dict[str, Any]) -> str:
    """Generate seasonal calendar content based on industry"""
    industry = config.get('client', {}).get('industry', 'service')

    # Default seasonal content for general service industries
    seasonal_calendar = [
        "**Spring (March-May):** Preparation and maintenance, seasonal service needs, spring cleaning",
        "**Summer (June-August):** Peak service demand, maintenance, preventive care, outdoor services",
        "**Fall (September-November):** Preparation for winter, maintenance, seasonal transitions",
        "**Winter (December-February):** Indoor services, maintenance, planning for next year"
    ]

    # Industry-specific calendars can be added here
    if industry == 'pest_control':
        seasonal_calendar = [
            "**Spring (March-May):** Ants, spiders, stink bugs, beetles, springtails, mice, rodent activity",
            "**Summer (June-August):** Wasps, spiders, ants, mosquitoes, ticks, flies, beetles, outdoor pest activity",
            "**Fall (September-November):** Overwintering pests, stink bugs, beetles, mice, rats, spiders seeking shelter",
            "**Winter (December-February):** Mice, indoor pests, overwintering pest management"
        ]
    elif industry == 'hvac':
        seasonal_calendar = [
            "**Spring (March-May):** AC maintenance, filter changes, spring tune-ups, duct cleaning",
            "**Summer (June-August):** AC repairs, cooling efficiency, emergency services, high-demand period",
            "**Fall (September-November):** Heating system preparation, furnace maintenance, winterization",
            "**Winter (December-February):** Heating repairs, emergency services, energy efficiency, cold weather issues"
        ]
    elif industry == 'roofing':
        seasonal_calendar = [
            "**Spring (March-May):** Storm damage repair, spring inspections, gutter cleaning, maintenance",
            "**Summer (June-August):** New installations, major repairs, optimal working conditions",
            "**Fall (September-November):** Winter preparation, final repairs, gutter maintenance, storm prep",
            "**Winter (December-February):** Emergency repairs, ice dam prevention, winter damage assessment"
        ]

    return '\n'.join([f"- {item}" for item in seasonal_calendar])

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 customize-claude.py <config-file> <output-file>")
        sys.exit(1)

    config_file = sys.argv[1]
    output_file = sys.argv[2]

    # Load configuration and template
    config = load_client_config(config_file)
    template = load_template()

    # Create substitutions
    substitutions = create_substitution_map(config)

    # Add seasonal calendar
    substitutions['SEASONAL_CALENDAR'] = generate_seasonal_calendar(config)

    # Apply substitutions
    customized_content = apply_substitutions(template, substitutions)

    # Write output
    try:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(customized_content)
        print(f"✅ Customized CLAUDE.md created: {output_file}")
    except Exception as e:
        print(f"Error writing output file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()