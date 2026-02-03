#!/usr/bin/env python3
"""
Skill Scanner - Scans repository for all skills and outputs JSON inventory

Usage:
    scan_skills.py [--output <path>] [--root <path>] [--json]

Options:
    --output <path>   Write output to file instead of stdout
    --root <path>     Root directory to scan (default: parent of script's skill-architect)
    --json            Output as JSON (default if --output is specified)

Examples:
    scan_skills.py                          # Print skills summary
    scan_skills.py --json                   # Print JSON to stdout
    scan_skills.py --output inventory.json  # Write to file
"""

import sys
import json
import re
import argparse
from pathlib import Path
from datetime import datetime
import yaml


def get_default_root():
    """Get default root directory (parent of skill-architect)."""
    script_dir = Path(__file__).parent.resolve()
    return script_dir.parent.parent


def parse_frontmatter(skill_md_path):
    """Parse YAML frontmatter from SKILL.md file."""
    try:
        content = skill_md_path.read_text()
        if not content.startswith('---'):
            return None

        # Find end of frontmatter
        second_delimiter = content.find('---', 3)
        if second_delimiter == -1:
            return None

        frontmatter_text = content[3:second_delimiter].strip()
        return yaml.safe_load(frontmatter_text)

    except Exception:
        return None


def detect_archetype(skill_path, frontmatter, content):
    """Detect skill archetype based on patterns."""
    # If declared, use that
    if frontmatter and 'archetype' in frontmatter:
        return frontmatter['archetype']

    content_lower = content.lower() if content else ''

    # Pattern-based detection
    archetype_patterns = {
        'guidance': ['design thinking', 'philosophy', 'guidelines', 'anti-patterns', 'aesthetic'],
        'toolkit': ['requirements', 'core workflow', 'utilities', 'dependencies', 'pip install'],
        'router': ['load the appropriate', 'from the request', 'examples/'],
        'document': ['workflow decision tree', 'quick start', 'reading workflow', 'creation workflow'],
        'meta': ['phase 1', 'phase 2', 'overview', 'core principles']
    }

    scores = {}
    for archetype, patterns in archetype_patterns.items():
        score = sum(1 for p in patterns if p in content_lower)
        # Check for directories
        if archetype == 'router' and (skill_path / 'examples').exists():
            score += 3
        elif archetype == 'toolkit' and (skill_path / 'core').exists():
            score += 3
        elif archetype == 'document' and (skill_path / 'scripts').exists():
            score += 2
        scores[archetype] = score

    if scores:
        best = max(scores, key=scores.get)
        if scores[best] >= 2:
            return best

    return None


def determine_ownership(skill_path, frontmatter):
    """Determine skill ownership based on license."""
    # Check frontmatter license field
    license_field = frontmatter.get('license', '') if frontmatter else ''

    # Check LICENSE.txt file
    license_file = skill_path / 'LICENSE.txt'
    license_content = ''
    if license_file.exists():
        try:
            license_content = license_file.read_text()
        except Exception:
            pass

    combined = f"{license_field} {license_content}".lower()

    # Ownership detection rules:
    # - Apache 2.0 = Anthropic
    # - Proprietary = Anthropic
    # - MIT (without specific Anthropic reference) = User
    # - No license = User (assumed)

    if 'apache' in combined:
        return 'anthropic'
    if 'proprietary' in combined:
        return 'anthropic'
    if 'mit' in combined:
        # Check for specific copyright holder
        if 'anthropic' in combined:
            return 'anthropic'
        return 'user'

    # Default to user-owned
    return 'user'


def scan_skill(skill_md_path):
    """Scan a single skill and return its metadata."""
    skill_path = skill_md_path.parent
    frontmatter = parse_frontmatter(skill_md_path)

    if not frontmatter:
        return None

    # Read full content for archetype detection
    try:
        content = skill_md_path.read_text()
    except Exception:
        content = ''

    # Get line count
    line_count = len(content.split('\n'))

    skill_info = {
        'name': frontmatter.get('name', skill_path.name),
        'description': frontmatter.get('description', ''),
        'tags': frontmatter.get('tags', []),
        'archetype': detect_archetype(skill_path, frontmatter, content),
        'ownership': determine_ownership(skill_path, frontmatter),
        'license': frontmatter.get('license', ''),
        'path': str(skill_path),
        'relative_path': None,  # Set by caller
        'line_count': line_count,
        'has_scripts': (skill_path / 'scripts').exists(),
        'has_references': (skill_path / 'references').exists(),
        'has_assets': (skill_path / 'assets').exists(),
    }

    return skill_info


def scan_repository(root_path):
    """Scan entire repository for skills."""
    root_path = Path(root_path).resolve()
    skills = []
    seen_names = set()

    # Scan patterns - look for SKILL.md files in various locations
    scan_paths = [
        root_path / '.claude' / 'skills',  # Active skills
        root_path,  # Top-level skills
    ]

    for scan_base in scan_paths:
        if not scan_base.exists():
            continue

        # Find all SKILL.md files
        for skill_md in scan_base.rglob('SKILL.md'):
            skill_info = scan_skill(skill_md)
            if skill_info and skill_info['name'] not in seen_names:
                # Calculate relative path from root
                try:
                    rel_path = skill_md.parent.relative_to(root_path)
                    skill_info['relative_path'] = str(rel_path)
                except ValueError:
                    skill_info['relative_path'] = str(skill_md.parent)

                skills.append(skill_info)
                seen_names.add(skill_info['name'])

    return skills


def compute_stats(skills):
    """Compute statistics about the skills inventory."""
    stats = {
        'total': len(skills),
        'by_ownership': {},
        'by_archetype': {},
        'by_tag': {},
        'with_tags': 0,
        'without_tags': 0
    }

    for skill in skills:
        # Ownership
        ownership = skill.get('ownership', 'unknown')
        stats['by_ownership'][ownership] = stats['by_ownership'].get(ownership, 0) + 1

        # Archetype
        archetype = skill.get('archetype') or 'unknown'
        stats['by_archetype'][archetype] = stats['by_archetype'].get(archetype, 0) + 1

        # Tags
        tags = skill.get('tags', [])
        if tags:
            stats['with_tags'] += 1
            for tag in tags:
                stats['by_tag'][tag] = stats['by_tag'].get(tag, 0) + 1
        else:
            stats['without_tags'] += 1

    return stats


def main():
    parser = argparse.ArgumentParser(
        description='Scan repository for skills and output inventory',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    %(prog)s                          # Print skills summary
    %(prog)s --json                   # Print JSON to stdout
    %(prog)s --output inventory.json  # Write to file
        """
    )

    parser.add_argument('--output', '-o', help='Output file path')
    parser.add_argument('--root', '-r', help='Root directory to scan')
    parser.add_argument('--json', '-j', action='store_true', help='Output as JSON')

    args = parser.parse_args()

    # Determine root path
    root_path = Path(args.root) if args.root else get_default_root()

    if not root_path.exists():
        print(f"Error: Root path does not exist: {root_path}", file=sys.stderr)
        sys.exit(1)

    # Scan repository
    skills = scan_repository(root_path)
    stats = compute_stats(skills)

    # Build output
    output = {
        'scanned_at': datetime.now().isoformat(),
        'root_path': str(root_path),
        'stats': stats,
        'skills': skills
    }

    # Output
    if args.output or args.json:
        json_output = json.dumps(output, indent=2)
        if args.output:
            Path(args.output).write_text(json_output)
            print(f"Wrote {len(skills)} skills to {args.output}")
        else:
            print(json_output)
    else:
        # Print summary
        print(f"Skills Inventory - {root_path}")
        print("=" * 60)
        print(f"\nTotal Skills: {stats['total']}")
        print(f"  With tags: {stats['with_tags']}")
        print(f"  Without tags: {stats['without_tags']}")
        print()

        print("By Ownership:")
        for ownership, count in sorted(stats['by_ownership'].items()):
            print(f"  {ownership}: {count}")
        print()

        print("By Archetype:")
        for archetype, count in sorted(stats['by_archetype'].items()):
            print(f"  {archetype}: {count}")
        print()

        if stats['by_tag']:
            print("Tags in use:")
            for tag, count in sorted(stats['by_tag'].items(), key=lambda x: -x[1]):
                print(f"  {tag}: {count}")
            print()

        print("\nSkills List:")
        print("-" * 60)
        for skill in sorted(skills, key=lambda s: s['name']):
            ownership_badge = '[A]' if skill['ownership'] == 'anthropic' else '[U]'
            archetype = skill.get('archetype') or '?'
            tags = ', '.join(skill.get('tags', [])) or '-'
            print(f"{ownership_badge} {skill['name']:<30} {archetype:<10} {tags}")


if __name__ == "__main__":
    main()
