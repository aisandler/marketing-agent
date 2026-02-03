#!/usr/bin/env python3
"""
Pack Manager - Create and manage skill packs

Usage:
    manage_packs.py list                          # List all packs
    manage_packs.py show <pack-name>              # Show pack details
    manage_packs.py resolve <pack-name>           # Show matching skills
    manage_packs.py create <pack-name>            # Create new pack interactively
    manage_packs.py export <pack-name> [--output] # Export pack to .skill-pack

Options:
    --output <path>   Output directory for export (default: ./dist)
    --packs <path>    Packs directory (default: ./packs)
    --root <path>     Repository root (default: parent of skill-architect)

Examples:
    manage_packs.py list
    manage_packs.py show design-toolkit
    manage_packs.py resolve design-toolkit
    manage_packs.py export design-toolkit --output ./releases
"""

import sys
import json
import argparse
import zipfile
from pathlib import Path
from datetime import datetime
import yaml

# Import scan_skills functionality
from scan_skills import scan_repository, get_default_root


def get_packs_dir(args):
    """Get packs directory path."""
    if args.packs:
        return Path(args.packs).resolve()
    root = Path(args.root).resolve() if args.root else get_default_root()
    return root / 'packs'


def load_pack(pack_path):
    """Load a pack definition from YAML file."""
    try:
        content = pack_path.read_text()
        # Handle YAML with potential markdown body
        if content.startswith('---'):
            # Find end of frontmatter (if it has markdown body)
            lines = content.split('\n')
            in_frontmatter = True
            yaml_lines = []
            for i, line in enumerate(lines):
                if i == 0 and line == '---':
                    continue
                if line == '---' and in_frontmatter:
                    break
                yaml_lines.append(line)
            return yaml.safe_load('\n'.join(yaml_lines))
        else:
            return yaml.safe_load(content)
    except Exception as e:
        print(f"Error loading pack: {e}", file=sys.stderr)
        return None


def list_packs(packs_dir):
    """List all available packs."""
    if not packs_dir.exists():
        print(f"Packs directory not found: {packs_dir}")
        print("Create it with: mkdir packs")
        return []

    packs = []
    for pack_file in packs_dir.glob('*.pack.yaml'):
        pack = load_pack(pack_file)
        if pack:
            packs.append({
                'file': pack_file.name,
                'name': pack.get('name', pack_file.stem.replace('.pack', '')),
                'display_name': pack.get('display_name', pack.get('name', '')),
                'description': pack.get('description', ''),
                'version': pack.get('version', '1.0.0')
            })

    return packs


def resolve_filter(filter_def, skills):
    """Resolve a filter definition against skills list."""
    if not filter_def:
        return skills

    matched = set()

    # Handle match_any (OR conditions)
    match_any = filter_def.get('match_any', [])
    for condition in match_any:
        for skill in skills:
            if matches_condition(skill, condition):
                matched.add(skill['name'])

    # Handle match_all (AND conditions) - only if no match_any
    match_all = filter_def.get('match_all', [])
    if match_all and not match_any:
        for skill in skills:
            if all(matches_condition(skill, cond) for cond in match_all):
                matched.add(skill['name'])

    # If no match conditions, include all
    if not match_any and not match_all:
        matched = {s['name'] for s in skills}

    # Handle exclude conditions
    exclude = filter_def.get('exclude', [])
    for condition in exclude:
        to_remove = set()
        for skill in skills:
            if skill['name'] in matched and matches_condition(skill, condition):
                to_remove.add(skill['name'])
        matched -= to_remove

    # Return matching skills in original order
    return [s for s in skills if s['name'] in matched]


def matches_condition(skill, condition):
    """Check if a skill matches a condition."""
    # Name condition (exact match)
    if 'name' in condition:
        if skill.get('name') != condition['name']:
            return False

    # Tags condition
    if 'tags' in condition:
        skill_tags = set(skill.get('tags', []))
        condition_tags = set(condition['tags'])
        if not condition_tags & skill_tags:  # No overlap
            return False

    # Archetype condition
    if 'archetype' in condition:
        if skill.get('archetype') != condition['archetype']:
            return False

    # Ownership condition
    if 'ownership' in condition:
        if skill.get('ownership') != condition['ownership']:
            return False

    return True


def cmd_list(args):
    """List all packs."""
    packs_dir = get_packs_dir(args)
    packs = list_packs(packs_dir)

    if not packs:
        print("No packs found.")
        print(f"Create packs in: {packs_dir}")
        return

    print(f"Available Packs ({len(packs)}):")
    print("-" * 60)

    for pack in sorted(packs, key=lambda p: p['name']):
        print(f"\n{pack['display_name'] or pack['name']} (v{pack['version']})")
        print(f"  File: {pack['file']}")
        if pack['description']:
            print(f"  {pack['description'][:60]}...")


def cmd_show(args):
    """Show pack details."""
    packs_dir = get_packs_dir(args)
    pack_file = packs_dir / f"{args.pack_name}.pack.yaml"

    if not pack_file.exists():
        print(f"Pack not found: {pack_file}", file=sys.stderr)
        sys.exit(1)

    pack = load_pack(pack_file)
    if not pack:
        sys.exit(1)

    print(f"Pack: {pack.get('display_name', pack.get('name'))}")
    print(f"Name: {pack.get('name')}")
    print(f"Version: {pack.get('version', '1.0.0')}")
    print(f"Description: {pack.get('description', '')}")
    print()

    filter_def = pack.get('filter', {})
    if filter_def:
        print("Filter Definition:")
        print(yaml.dump(filter_def, default_flow_style=False, indent=2))


def cmd_resolve(args):
    """Resolve pack filter and show matching skills."""
    packs_dir = get_packs_dir(args)
    pack_file = packs_dir / f"{args.pack_name}.pack.yaml"

    if not pack_file.exists():
        print(f"Pack not found: {pack_file}", file=sys.stderr)
        sys.exit(1)

    pack = load_pack(pack_file)
    if not pack:
        sys.exit(1)

    # Get root and scan skills
    root = Path(args.root).resolve() if args.root else get_default_root()
    skills = scan_repository(root)

    # Resolve filter
    filter_def = pack.get('filter', {})
    matched = resolve_filter(filter_def, skills)

    print(f"Pack: {pack.get('display_name', pack.get('name'))}")
    print(f"Matching Skills: {len(matched)}")
    print("-" * 60)

    for skill in sorted(matched, key=lambda s: s['name']):
        ownership = '[A]' if skill['ownership'] == 'anthropic' else '[U]'
        archetype = skill.get('archetype') or '?'
        tags = ', '.join(skill.get('tags', [])) or '-'
        print(f"{ownership} {skill['name']:<30} {archetype:<10} {tags}")


def cmd_create(args):
    """Create a new pack interactively."""
    packs_dir = get_packs_dir(args)
    packs_dir.mkdir(parents=True, exist_ok=True)

    pack_file = packs_dir / f"{args.pack_name}.pack.yaml"

    if pack_file.exists():
        print(f"Pack already exists: {pack_file}", file=sys.stderr)
        sys.exit(1)

    # Create template pack
    pack = {
        'name': args.pack_name,
        'display_name': args.pack_name.replace('-', ' ').title(),
        'description': 'Description of this pack',
        'version': '1.0.0',
        'filter': {
            'match_any': [
                {'tags': ['example-tag']}
            ],
            'exclude': [
                {'ownership': 'anthropic'}
            ]
        }
    }

    # Write pack file
    with open(pack_file, 'w') as f:
        f.write('# ' + pack['display_name'] + '\n')
        f.write('#\n')
        f.write('# Edit the filter below to define which skills are included.\n')
        f.write('# Run `manage_packs.py resolve ' + args.pack_name + '` to preview matching skills.\n')
        f.write('\n')
        yaml.dump(pack, f, default_flow_style=False, sort_keys=False)

    print(f"Created pack: {pack_file}")
    print("\nEdit the file to configure your pack filter.")
    print(f"Preview with: manage_packs.py resolve {args.pack_name}")


def cmd_export(args):
    """Export pack to .skill-pack file."""
    packs_dir = get_packs_dir(args)
    pack_file = packs_dir / f"{args.pack_name}.pack.yaml"

    if not pack_file.exists():
        print(f"Pack not found: {pack_file}", file=sys.stderr)
        sys.exit(1)

    pack = load_pack(pack_file)
    if not pack:
        sys.exit(1)

    # Get root and scan skills
    root = Path(args.root).resolve() if args.root else get_default_root()
    skills = scan_repository(root)

    # Resolve filter
    filter_def = pack.get('filter', {})
    matched = resolve_filter(filter_def, skills)

    if not matched:
        print("No skills match the pack filter. Nothing to export.", file=sys.stderr)
        sys.exit(1)

    # Output directory
    output_dir = Path(args.output) if args.output else root / 'dist'
    output_dir.mkdir(parents=True, exist_ok=True)

    # Create .skill-pack file (ZIP)
    version = pack.get('version', '1.0.0')
    output_file = output_dir / f"{args.pack_name}-{version}.skill-pack"

    print(f"Exporting {len(matched)} skills to: {output_file}")

    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add pack manifest
        manifest = {
            'name': pack.get('name'),
            'display_name': pack.get('display_name'),
            'description': pack.get('description'),
            'version': version,
            'exported_at': datetime.now().isoformat(),
            'skills': [s['name'] for s in matched],
            'filter': filter_def
        }
        zipf.writestr('PACK.json', json.dumps(manifest, indent=2))

        # Add each skill
        for skill in matched:
            skill_path = Path(skill['path'])
            skill_name = skill['name']

            # Add all files in skill directory
            for file_path in skill_path.rglob('*'):
                if file_path.is_file():
                    # Skip dotfiles and cache
                    if any(part.startswith('.') for part in file_path.parts):
                        continue
                    if '__pycache__' in str(file_path):
                        continue

                    arcname = f"skills/{skill_name}/{file_path.relative_to(skill_path)}"
                    zipf.write(file_path, arcname)

            print(f"  Added: {skill_name}")

    print(f"\nExported to: {output_file}")
    print(f"Contains {len(matched)} skills")


def main():
    parser = argparse.ArgumentParser(
        description='Manage skill packs',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Commands:
    list              List all packs
    show <name>       Show pack details
    resolve <name>    Show matching skills for a pack
    create <name>     Create new pack template
    export <name>     Export pack to .skill-pack file
        """
    )

    parser.add_argument('command', choices=['list', 'show', 'resolve', 'create', 'export'],
                        help='Command to run')
    parser.add_argument('pack_name', nargs='?', help='Pack name')
    parser.add_argument('--output', '-o', help='Output directory for export')
    parser.add_argument('--packs', '-p', help='Packs directory')
    parser.add_argument('--root', '-r', help='Repository root directory')

    args = parser.parse_args()

    # Validate pack_name is provided for commands that need it
    if args.command in ['show', 'resolve', 'create', 'export'] and not args.pack_name:
        print(f"Error: {args.command} requires a pack name", file=sys.stderr)
        sys.exit(1)

    # Run command
    if args.command == 'list':
        cmd_list(args)
    elif args.command == 'show':
        cmd_show(args)
    elif args.command == 'resolve':
        cmd_resolve(args)
    elif args.command == 'create':
        cmd_create(args)
    elif args.command == 'export':
        cmd_export(args)


if __name__ == "__main__":
    main()
