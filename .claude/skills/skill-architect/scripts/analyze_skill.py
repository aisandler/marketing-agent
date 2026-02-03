#!/usr/bin/env python3
"""
Skill Analyzer - Analyzes skills for consistency and suggests improvements

Usage:
    analyze_skill.py <path/to/skill>

Performs:
    - Structure validation
    - Archetype detection
    - Description quality analysis
    - Consistency checking
    - Improvement suggestions
"""

import sys
import re
from pathlib import Path
import yaml


# Archetype detection patterns
ARCHETYPE_INDICATORS = {
    'guidance': {
        'patterns': ['design thinking', 'philosophy', 'guidelines', 'anti-patterns', 'aesthetic'],
        'directories': [],
        'keywords': ['creative', 'distinctive', 'avoid']
    },
    'toolkit': {
        'patterns': ['requirements', 'core workflow', 'utilities', 'dependencies', 'pip install'],
        'directories': ['core', 'scripts'],
        'keywords': ['utilities', 'toolkit', 'tools']
    },
    'router': {
        'patterns': ['load the appropriate', 'from the request', 'examples/'],
        'directories': ['examples'],
        'keywords': ['set of resources', 'when asked to']
    },
    'document': {
        'patterns': ['workflow decision tree', 'quick start', 'reading workflow', 'creation workflow'],
        'directories': ['scripts'],
        'keywords': ['comprehensive', 'processing', '.docx', '.pdf', '.xlsx', '.pptx']
    },
    'meta': {
        'patterns': ['phase 1', 'phase 2', 'overview', 'core principles'],
        'directories': ['scripts', 'references'],
        'keywords': ['guide for', 'workflow', 'phases']
    }
}


class SkillAnalyzer:
    def __init__(self, skill_path):
        self.skill_path = Path(skill_path).resolve()
        self.skill_md_path = self.skill_path / 'SKILL.md'
        self.issues = []
        self.warnings = []
        self.suggestions = []
        self.scores = {
            'structure': 0,
            'description': 0,
            'content': 0
        }

    def analyze(self):
        """Run all analysis checks."""
        print(f"Analyzing skill: {self.skill_path.name}")
        print("=" * 50)

        # Check basic structure
        if not self._check_structure():
            return False

        # Load and parse SKILL.md
        if not self._load_skill_md():
            return False

        # Analyze components
        self._analyze_frontmatter()
        self._analyze_description()
        self._analyze_content()
        self._detect_archetype()
        self._check_archetype_consistency()

        # Generate report
        self._print_report()

        return len(self.issues) == 0

    def _check_structure(self):
        """Check basic directory structure."""
        if not self.skill_path.exists():
            self.issues.append(f"Skill directory not found: {self.skill_path}")
            return False

        if not self.skill_path.is_dir():
            self.issues.append(f"Path is not a directory: {self.skill_path}")
            return False

        if not self.skill_md_path.exists():
            self.issues.append("SKILL.md not found (required)")
            return False

        self.scores['structure'] += 3
        return True

    def _load_skill_md(self):
        """Load and parse SKILL.md content."""
        try:
            self.content = self.skill_md_path.read_text()
            self.lines = self.content.split('\n')
            self.line_count = len(self.lines)
        except Exception as e:
            self.issues.append(f"Error reading SKILL.md: {e}")
            return False

        # Parse frontmatter
        if not self.content.startswith('---'):
            self.issues.append("SKILL.md must start with YAML frontmatter (---)")
            return False

        try:
            # Find end of frontmatter
            second_delimiter = self.content.find('---', 3)
            if second_delimiter == -1:
                self.issues.append("YAML frontmatter not properly closed (missing ---)")
                return False

            frontmatter_text = self.content[3:second_delimiter].strip()
            self.frontmatter = yaml.safe_load(frontmatter_text)
            self.body = self.content[second_delimiter + 3:].strip()

        except yaml.YAMLError as e:
            self.issues.append(f"Invalid YAML frontmatter: {e}")
            return False

        return True

    def _analyze_frontmatter(self):
        """Analyze frontmatter fields."""
        # Check required fields
        if 'name' not in self.frontmatter:
            self.issues.append("Missing required field: name")
        else:
            name = self.frontmatter['name']
            if not re.match(r'^[a-z0-9-]+$', name):
                self.issues.append("Name must be hyphen-case (lowercase, digits, hyphens only)")
            elif len(name) > 64:
                self.issues.append("Name must be 64 characters or less")
            else:
                self.scores['structure'] += 2

            # Check name matches directory
            if name != self.skill_path.name:
                self.warnings.append(f"Name '{name}' doesn't match directory '{self.skill_path.name}'")

        if 'description' not in self.frontmatter:
            self.issues.append("Missing required field: description")
        else:
            self.description = self.frontmatter['description']
            if len(self.description) > 1024:
                self.issues.append("Description exceeds 1024 characters")
            if '<' in self.description or '>' in self.description:
                self.issues.append("Description contains angle brackets (not allowed)")

        # Check for unexpected fields
        allowed_fields = {'name', 'description', 'license', 'allowed-tools', 'metadata', 'tags', 'archetype'}
        unexpected = set(self.frontmatter.keys()) - allowed_fields
        if unexpected:
            self.warnings.append(f"Unexpected frontmatter fields: {unexpected}")

        # Validate tags if present
        self._validate_tags()

        # Validate archetype if present
        self._validate_archetype()

    def _validate_tags(self):
        """Validate tags field."""
        tags = self.frontmatter.get('tags', [])
        if not tags:
            return

        if not isinstance(tags, list):
            self.issues.append(f"Tags must be a list, got {type(tags).__name__}")
            return

        self.tags = tags
        valid_tag_count = 0
        for tag in tags:
            if not isinstance(tag, str):
                self.issues.append(f"Each tag must be a string, got {type(tag).__name__}")
            elif not re.match(r'^[a-z0-9-]+$', tag):
                self.warnings.append(f"Tag '{tag}' should be lowercase hyphen-case")
            elif len(tag) > 32:
                self.warnings.append(f"Tag '{tag}' exceeds 32 characters")
            else:
                valid_tag_count += 1

        if valid_tag_count > 0:
            self.scores['structure'] += 1  # Bonus for having valid tags

    def _validate_archetype(self):
        """Validate archetype field."""
        archetype = self.frontmatter.get('archetype')
        if not archetype:
            return

        valid_archetypes = {'guidance', 'toolkit', 'router', 'document', 'meta'}
        if archetype not in valid_archetypes:
            self.issues.append(f"Invalid archetype '{archetype}'. Must be one of: {', '.join(sorted(valid_archetypes))}")
        else:
            self.declared_archetype = archetype
            self.scores['structure'] += 1  # Bonus for declaring archetype

    def _analyze_description(self):
        """Analyze description quality."""
        if not hasattr(self, 'description'):
            return

        desc = self.description.lower()
        score = 0

        # Check for WHAT component
        what_indicators = ['create', 'build', 'generate', 'provide', 'help', 'guide', 'toolkit', 'utilities']
        if any(indicator in desc for indicator in what_indicators):
            score += 2
        else:
            self.suggestions.append("Description should include WHAT the skill does")

        # Check for WHEN component
        when_indicators = ['use when', 'use this', 'when asked', 'when user', 'when working']
        if any(indicator in desc for indicator in when_indicators):
            score += 3
        else:
            self.suggestions.append("Description should include WHEN to use it (triggers)")

        # Check for specific triggers/keywords
        if len(desc.split()) >= 20:
            score += 2
        else:
            self.suggestions.append("Description may be too short - add more specific triggers")

        # Check for file extensions if relevant
        if any(ext in desc for ext in ['.pdf', '.docx', '.xlsx', '.pptx', '.csv', '.json']):
            score += 1

        # Check for example trigger phrases
        if '"' in self.description or "'" in self.description:
            score += 1
            # Might have example phrases

        self.scores['description'] = min(score, 10)

    def _analyze_content(self):
        """Analyze SKILL.md body content."""
        score = 0

        # Check line count
        if self.line_count <= 500:
            score += 2
        else:
            self.warnings.append(f"SKILL.md has {self.line_count} lines (recommended: <500)")

        # Check for TODOs
        todo_count = self.content.lower().count('todo')
        if todo_count > 0:
            self.warnings.append(f"Found {todo_count} TODO placeholder(s)")
        else:
            score += 2

        # Check for code examples
        if '```' in self.content:
            score += 2

        # Check for headings structure
        h2_count = self.content.count('\n## ')
        if h2_count >= 2:
            score += 2

        # Check for reference links
        if 'references/' in self.content or 'examples/' in self.content:
            score += 1

        self.scores['content'] = min(score, 10)

    def _detect_archetype(self):
        """Detect the likely archetype of the skill."""
        content_lower = self.content.lower()
        desc_lower = self.description.lower() if hasattr(self, 'description') else ''

        archetype_scores = {}

        for archetype, indicators in ARCHETYPE_INDICATORS.items():
            score = 0

            # Check content patterns
            for pattern in indicators['patterns']:
                if pattern in content_lower:
                    score += 2

            # Check directories
            for dir_name in indicators['directories']:
                if (self.skill_path / dir_name).exists():
                    score += 3

            # Check description keywords
            for keyword in indicators['keywords']:
                if keyword in desc_lower:
                    score += 1

            archetype_scores[archetype] = score

        # Determine best match
        if archetype_scores:
            self.detected_archetype = max(archetype_scores, key=archetype_scores.get)
            self.archetype_confidence = archetype_scores[self.detected_archetype]

            if self.archetype_confidence < 3:
                self.detected_archetype = None
                self.archetype_confidence = 0

    def _check_archetype_consistency(self):
        """Check consistency with detected archetype."""
        if not hasattr(self, 'detected_archetype') or self.detected_archetype is None:
            return

        archetype = self.detected_archetype
        content_lower = self.content.lower()

        # Archetype-specific checks
        if archetype == 'guidance':
            if 'anti-pattern' not in content_lower and 'never' not in content_lower:
                self.suggestions.append("Guidance skills should have anti-patterns section")
            if 'design' not in content_lower and 'philosophy' not in content_lower:
                self.suggestions.append("Guidance skills should establish design direction")

        elif archetype == 'toolkit':
            if 'dependencies' not in content_lower and 'pip install' not in content_lower:
                self.suggestions.append("Toolkit skills should list dependencies")
            if not (self.skill_path / 'core').exists() and not (self.skill_path / 'scripts').exists():
                self.suggestions.append("Toolkit skills should have core/ or scripts/ directory")

        elif archetype == 'router':
            if not (self.skill_path / 'examples').exists():
                self.suggestions.append("Router skills should have examples/ directory")
            if self.line_count > 100:
                self.suggestions.append("Router skills should have minimal SKILL.md (<100 lines)")

        elif archetype == 'document':
            if 'decision tree' not in content_lower and 'workflow' not in content_lower:
                self.suggestions.append("Document skills should have workflow decision tree")
            if 'quick start' not in content_lower:
                self.suggestions.append("Document skills should have quick start section")

        elif archetype == 'meta':
            if 'phase' not in content_lower:
                self.suggestions.append("Meta skills should have phased workflow")
            if 'principles' not in content_lower:
                self.suggestions.append("Meta skills should have core principles section")

    def _print_report(self):
        """Print analysis report."""
        print()

        # Tags
        if hasattr(self, 'tags') and self.tags:
            print(f"Tags: {', '.join(self.tags)}")
        else:
            print("Tags: (none)")

        # Archetype info
        if hasattr(self, 'declared_archetype') and self.declared_archetype:
            print(f"Declared Archetype: {self.declared_archetype}")
            if hasattr(self, 'detected_archetype') and self.detected_archetype:
                if self.declared_archetype != self.detected_archetype:
                    self.warnings.append(f"Declared archetype '{self.declared_archetype}' differs from detected '{self.detected_archetype}'")
        elif hasattr(self, 'detected_archetype') and self.detected_archetype:
            print(f"Detected Archetype: {self.detected_archetype} (confidence: {self.archetype_confidence})")
            self.suggestions.append(f"Consider adding 'archetype: {self.detected_archetype}' to frontmatter")
        else:
            print("Archetype: unknown")
        print()

        # Scores
        total_score = sum(self.scores.values())
        max_score = 30
        print(f"Consistency Score: {total_score}/{max_score}")
        print(f"  Structure:   {self.scores['structure']}/10")
        print(f"  Description: {self.scores['description']}/10")
        print(f"  Content:     {self.scores['content']}/10")
        print()

        # Issues (errors)
        if self.issues:
            print("ISSUES (must fix):")
            for issue in self.issues:
                print(f"  - {issue}")
            print()

        # Warnings
        if self.warnings:
            print("WARNINGS:")
            for warning in self.warnings:
                print(f"  - {warning}")
            print()

        # Suggestions
        if self.suggestions:
            print("SUGGESTIONS:")
            for suggestion in self.suggestions:
                print(f"  - {suggestion}")
            print()

        # Summary
        if not self.issues and not self.warnings:
            print("All checks passed!")
        elif self.issues:
            print(f"Fix {len(self.issues)} issue(s) before packaging.")


def main():
    if len(sys.argv) < 2:
        print("Usage: analyze_skill.py <path/to/skill>")
        print("\nAnalyzes a skill for consistency and suggests improvements.")
        sys.exit(1)

    skill_path = sys.argv[1]
    analyzer = SkillAnalyzer(skill_path)

    success = analyzer.analyze()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
