#!/usr/bin/env python3
"""
Tag Updater - Update tags in SKILL.md frontmatter

Usage:
    update_tags.py <skill-path> --add <tags> [--remove <tags>]
    update_tags.py <skill-path> --set <tags>
    update_tags.py <skill-path> --clear
    update_tags.py <skill-path> --list

Options:
    --add <tags>      Add tags (comma-separated)
    --remove <tags>   Remove tags (comma-separated)
    --set <tags>      Set tags (replaces existing)
    --clear           Remove all tags
    --list            List current tags
    --archetype <a>   Set archetype (guidance, toolkit, router, document, meta)

Examples:
    update_tags.py ./skills/pdf --add documents,productivity
    update_tags.py ./skills/pdf --remove legacy --add office
    update_tags.py ./skills/pdf --set documents,productivity,office
    update_tags.py ./skills/pdf --archetype document
    update_tags.py ./skills/pdf --list
"""

import sys
import re
import argparse
from pathlib import Path
import yaml


def parse_skill_md(skill_md_path):
    """Parse SKILL.md and return frontmatter, body, and raw frontmatter text."""
    content = skill_md_path.read_text()

    if not content.startswith('---'):
        raise ValueError("SKILL.md must start with YAML frontmatter (---)")

    # Find end of frontmatter
    second_delimiter = content.find('---', 3)
    if second_delimiter == -1:
        raise ValueError("YAML frontmatter not properly closed (missing ---)")

    frontmatter_text = content[3:second_delimiter].strip()
    body = content[second_delimiter + 3:]

    try:
        frontmatter = yaml.safe_load(frontmatter_text)
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML frontmatter: {e}")

    return frontmatter, body, frontmatter_text


def write_skill_md(skill_md_path, frontmatter, body):
    """Write updated SKILL.md with new frontmatter."""
    # Custom YAML formatting to preserve nice output
    lines = ['---']

    # Write fields in preferred order
    field_order = ['name', 'description', 'license', 'tags', 'archetype', 'allowed-tools', 'metadata']

    for field in field_order:
        if field in frontmatter:
            value = frontmatter[field]
            if field == 'tags' and isinstance(value, list):
                if value:
                    lines.append('tags:')
                    for tag in value:
                        lines.append(f'  - {tag}')
            elif field == 'description' and len(str(value)) > 60:
                # Multi-line description
                lines.append(f'{field}: {value}')
            elif isinstance(value, list):
                lines.append(f'{field}:')
                for item in value:
                    lines.append(f'  - {item}')
            elif isinstance(value, dict):
                lines.append(f'{field}:')
                for k, v in value.items():
                    lines.append(f'  {k}: {v}')
            else:
                lines.append(f'{field}: {value}')

    lines.append('---')

    new_content = '\n'.join(lines) + body
    skill_md_path.write_text(new_content)


def parse_tags(tags_str):
    """Parse comma-separated tags string into list."""
    if not tags_str:
        return []
    return [t.strip().lower() for t in tags_str.split(',') if t.strip()]


def validate_tag(tag):
    """Validate a single tag."""
    if not re.match(r'^[a-z0-9-]+$', tag):
        return False, f"Tag '{tag}' must be lowercase hyphen-case"
    if len(tag) > 32:
        return False, f"Tag '{tag}' exceeds 32 characters"
    return True, None


def main():
    parser = argparse.ArgumentParser(
        description='Update tags in SKILL.md frontmatter',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    %(prog)s ./skills/pdf --add documents,productivity
    %(prog)s ./skills/pdf --remove legacy --add office
    %(prog)s ./skills/pdf --set documents,productivity,office
    %(prog)s ./skills/pdf --archetype document
    %(prog)s ./skills/pdf --list
        """
    )

    parser.add_argument('skill_path', help='Path to skill directory')
    parser.add_argument('--add', '-a', help='Add tags (comma-separated)')
    parser.add_argument('--remove', '-r', help='Remove tags (comma-separated)')
    parser.add_argument('--set', '-s', help='Set tags (replaces existing)')
    parser.add_argument('--clear', '-c', action='store_true', help='Remove all tags')
    parser.add_argument('--list', '-l', action='store_true', help='List current tags')
    parser.add_argument('--archetype', help='Set archetype (guidance, toolkit, router, document, meta)')

    args = parser.parse_args()

    # Validate skill path
    skill_path = Path(args.skill_path).resolve()
    skill_md_path = skill_path / 'SKILL.md'

    if not skill_md_path.exists():
        # Try treating path as SKILL.md directly
        if skill_path.name == 'SKILL.md' and skill_path.exists():
            skill_md_path = skill_path
            skill_path = skill_path.parent
        else:
            print(f"Error: SKILL.md not found at {skill_md_path}", file=sys.stderr)
            sys.exit(1)

    # Parse existing SKILL.md
    try:
        frontmatter, body, _ = parse_skill_md(skill_md_path)
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    current_tags = set(frontmatter.get('tags', []))

    # List mode
    if args.list:
        if current_tags:
            print("Current tags:")
            for tag in sorted(current_tags):
                print(f"  - {tag}")
        else:
            print("No tags set")

        archetype = frontmatter.get('archetype')
        if archetype:
            print(f"\nArchetype: {archetype}")

        sys.exit(0)

    # Validate archetype if provided
    if args.archetype:
        valid_archetypes = {'guidance', 'toolkit', 'router', 'document', 'meta'}
        if args.archetype not in valid_archetypes:
            print(f"Error: Invalid archetype '{args.archetype}'. Must be one of: {', '.join(sorted(valid_archetypes))}", file=sys.stderr)
            sys.exit(1)

    # Process tag changes
    modified = False

    if args.clear:
        if current_tags:
            current_tags = set()
            modified = True
            print("Cleared all tags")

    if args.set is not None:
        new_tags = parse_tags(args.set)
        # Validate all tags
        for tag in new_tags:
            valid, error = validate_tag(tag)
            if not valid:
                print(f"Error: {error}", file=sys.stderr)
                sys.exit(1)
        current_tags = set(new_tags)
        modified = True
        print(f"Set tags: {', '.join(sorted(current_tags))}")

    if args.add:
        tags_to_add = parse_tags(args.add)
        for tag in tags_to_add:
            valid, error = validate_tag(tag)
            if not valid:
                print(f"Error: {error}", file=sys.stderr)
                sys.exit(1)
        added = set(tags_to_add) - current_tags
        if added:
            current_tags.update(tags_to_add)
            modified = True
            print(f"Added tags: {', '.join(sorted(added))}")
        else:
            print("Tags already present, no changes made")

    if args.remove:
        tags_to_remove = parse_tags(args.remove)
        removed = current_tags & set(tags_to_remove)
        if removed:
            current_tags -= set(tags_to_remove)
            modified = True
            print(f"Removed tags: {', '.join(sorted(removed))}")
        else:
            print("Tags not found, no changes made")

    if args.archetype:
        if frontmatter.get('archetype') != args.archetype:
            frontmatter['archetype'] = args.archetype
            modified = True
            print(f"Set archetype: {args.archetype}")
        else:
            print(f"Archetype already set to '{args.archetype}'")

    # Update frontmatter and write
    if modified:
        if current_tags:
            frontmatter['tags'] = sorted(list(current_tags))
        elif 'tags' in frontmatter:
            del frontmatter['tags']

        write_skill_md(skill_md_path, frontmatter, body)
        print(f"\nUpdated: {skill_md_path}")

        if current_tags:
            print(f"Final tags: {', '.join(sorted(current_tags))}")
        else:
            print("Final tags: (none)")
    else:
        if not args.list:
            print("No changes made. Use --add, --remove, --set, --clear, or --archetype")


if __name__ == "__main__":
    main()
