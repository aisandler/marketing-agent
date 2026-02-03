#!/usr/bin/env python3
"""
Skill Initializer - Creates a new skill from archetype template

Usage:
    init_skill.py <skill-name> --path <path> [--archetype <type>]

Archetypes:
    guidance  - Philosophy-first creative skills (e.g., frontend-design)
    toolkit   - Technical tools with utilities (e.g., slack-gif-creator)
    router    - Routes to reference files (e.g., internal-comms)
    document  - File format processing (e.g., pdf, docx)
    meta      - Multi-phase workflows (e.g., mcp-builder)

Examples:
    init_skill.py my-design-skill --path ./skills --archetype guidance
    init_skill.py my-tool --path ./skills --archetype toolkit
    init_skill.py my-skill --path ./skills  # Uses generic template
"""

import sys
import argparse
from pathlib import Path


# Archetype templates
ARCHETYPES = {
    'guidance': {
        'template': 'guidance-template.md',
        'directories': ['references'],
        'description': 'Philosophy-first creative skill'
    },
    'toolkit': {
        'template': 'toolkit-template.md',
        'directories': ['core', 'references'],
        'description': 'Technical tool with utilities'
    },
    'router': {
        'template': 'router-template.md',
        'directories': ['examples'],
        'description': 'Routes to reference files'
    },
    'document': {
        'template': 'document-template.md',
        'directories': ['scripts', 'references'],
        'description': 'File format processing'
    },
    'meta': {
        'template': 'meta-template.md',
        'directories': ['scripts', 'references', 'assets/templates'],
        'description': 'Multi-phase workflow'
    }
}

# Generic template for when no archetype specified
GENERIC_TEMPLATE = """---
name: {skill_name}
description: [TODO: What this skill does. When to use it - specific triggers.]
---

# {skill_title}

[TODO: 1-2 sentence overview]

## Overview

[TODO: Describe what this skill enables]

## Usage

[TODO: Add usage instructions, examples, or workflows]

## Resources

[TODO: Document any bundled scripts, references, or assets]
"""

# Example files for different directory types
EXAMPLE_SCRIPT = '''#!/usr/bin/env python3
"""
Example script for {skill_name}

Replace with actual implementation or delete if not needed.
"""

def main():
    print("Example script for {skill_name}")
    # TODO: Add implementation

if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE = """# Reference: {topic}

[TODO: Add reference documentation]

## Overview

[Description of this reference material]

## Details

[Detailed information]
"""

EXAMPLE_ROUTER_FILE = """# {type_name}

## Overview

[TODO: What this type covers]

## Format

[TODO: Expected format or structure]

## Guidelines

[TODO: Specific guidelines for this type]

## Example

[TODO: Complete example]
"""

EXAMPLE_CORE_MODULE = '''"""
{skill_title} - Core Utilities

Main utility module for {skill_name}.
"""


class MainUtility:
    """Primary utility class."""

    def __init__(self, **kwargs):
        self.config = kwargs

    def process(self, item):
        """Process an item."""
        # TODO: Implement
        return item

    def save(self, path, **options):
        """Save output."""
        # TODO: Implement
        pass


def helper_function(data):
    """Helper function."""
    # TODO: Implement
    return data
'''


def title_case(skill_name):
    """Convert hyphen-case to Title Case."""
    return ' '.join(word.capitalize() for word in skill_name.split('-'))


def get_script_dir():
    """Get the directory containing this script."""
    return Path(__file__).parent.resolve()


def get_template_content(archetype, skill_name, skill_title):
    """Get template content for the given archetype."""
    if archetype is None:
        return GENERIC_TEMPLATE.format(
            skill_name=skill_name,
            skill_title=skill_title
        )

    # Try to load from assets/templates/
    template_dir = get_script_dir().parent / 'assets' / 'templates'
    template_file = template_dir / ARCHETYPES[archetype]['template']

    if template_file.exists():
        content = template_file.read_text()
        return content.replace('{skill_name}', skill_name).replace('{Skill Title}', skill_title)
    else:
        # Fallback to generic
        print(f"Warning: Template {template_file} not found, using generic")
        return GENERIC_TEMPLATE.format(
            skill_name=skill_name,
            skill_title=skill_title
        )


def create_directory_contents(skill_dir, archetype, skill_name, skill_title):
    """Create example files in directories based on archetype."""
    if archetype is None:
        # Generic: create all standard directories with examples
        dirs = ['scripts', 'references', 'assets']
    else:
        dirs = ARCHETYPES[archetype]['directories']

    for dir_path in dirs:
        full_path = skill_dir / dir_path
        full_path.mkdir(parents=True, exist_ok=True)

        # Create example files based on directory type
        if dir_path == 'scripts':
            example = full_path / 'example.py'
            example.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name))
            example.chmod(0o755)
            print(f"  Created {dir_path}/example.py")

        elif dir_path == 'core':
            # Toolkit archetype - create core module
            init_file = full_path / '__init__.py'
            init_file.write_text(f'"""{skill_title} core utilities."""\n')

            main_module = full_path / 'main_utility.py'
            main_module.write_text(EXAMPLE_CORE_MODULE.format(
                skill_name=skill_name,
                skill_title=skill_title
            ))
            print(f"  Created {dir_path}/__init__.py")
            print(f"  Created {dir_path}/main_utility.py")

        elif dir_path == 'references':
            example = full_path / 'reference.md'
            example.write_text(EXAMPLE_REFERENCE.format(topic='Example'))
            print(f"  Created {dir_path}/reference.md")

        elif dir_path == 'examples':
            # Router archetype - create example type files
            for i, type_name in enumerate(['type-a', 'type-b'], 1):
                example = full_path / f'{type_name}.md'
                example.write_text(EXAMPLE_ROUTER_FILE.format(
                    type_name=title_case(type_name)
                ))
            print(f"  Created {dir_path}/type-a.md")
            print(f"  Created {dir_path}/type-b.md")

        elif dir_path == 'assets':
            # Just create empty directory
            print(f"  Created {dir_path}/")

        elif dir_path == 'assets/templates':
            # Meta archetype - create template placeholder
            example = full_path / 'starter.md'
            example.write_text("# Starter Template\n\n[TODO: Add template content]\n")
            print(f"  Created {dir_path}/starter.md")


def init_skill(skill_name, path, archetype=None):
    """Initialize a new skill directory."""
    skill_dir = Path(path).resolve() / skill_name
    skill_title = title_case(skill_name)

    # Check if directory exists
    if skill_dir.exists():
        print(f"Error: Directory already exists: {skill_dir}")
        return None

    # Create skill directory
    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"Created skill directory: {skill_dir}")
    except Exception as e:
        print(f"Error creating directory: {e}")
        return None

    # Create SKILL.md from template
    template_content = get_template_content(archetype, skill_name, skill_title)
    skill_md = skill_dir / 'SKILL.md'
    skill_md.write_text(template_content)
    print(f"  Created SKILL.md ({archetype or 'generic'} template)")

    # Create directory structure with examples
    create_directory_contents(skill_dir, archetype, skill_name, skill_title)

    # Print summary
    print(f"\nSkill '{skill_name}' initialized successfully!")
    if archetype:
        print(f"Archetype: {archetype} - {ARCHETYPES[archetype]['description']}")
    print(f"\nNext steps:")
    print(f"  1. Edit SKILL.md - complete TODO items and description")
    print(f"  2. Customize or delete example files")
    print(f"  3. Run analyze_skill.py to check consistency")
    print(f"  4. Run package_skill.py when ready to distribute")

    return skill_dir


def main():
    parser = argparse.ArgumentParser(
        description='Initialize a new skill from template',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Archetypes:
  guidance   Philosophy-first creative skills (e.g., frontend-design)
  toolkit    Technical tools with utilities (e.g., slack-gif-creator)
  router     Routes to reference files (e.g., internal-comms)
  document   File format processing (e.g., pdf, docx)
  meta       Multi-phase workflows (e.g., mcp-builder)

Examples:
  %(prog)s my-design-skill --path ./skills --archetype guidance
  %(prog)s my-tool --path ./skills --archetype toolkit
  %(prog)s my-skill --path ./skills  # Uses generic template
        """
    )

    parser.add_argument('skill_name', help='Name of the skill (hyphen-case)')
    parser.add_argument('--path', required=True, help='Output directory path')
    parser.add_argument(
        '--archetype', '-a',
        choices=list(ARCHETYPES.keys()),
        help='Skill archetype (guidance, toolkit, router, document, meta)'
    )

    args = parser.parse_args()

    # Validate skill name
    skill_name = args.skill_name.lower()
    if not all(c.isalnum() or c == '-' for c in skill_name):
        print("Error: Skill name must contain only lowercase letters, digits, and hyphens")
        sys.exit(1)
    if len(skill_name) > 64:
        print("Error: Skill name must be 64 characters or less")
        sys.exit(1)

    print(f"Initializing skill: {skill_name}")
    if args.archetype:
        print(f"Archetype: {args.archetype}")
    print()

    result = init_skill(skill_name, args.path, args.archetype)
    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
