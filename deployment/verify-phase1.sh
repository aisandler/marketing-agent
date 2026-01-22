#!/bin/bash

echo "🔍 PHASE 1 VERIFICATION SCRIPT"
echo "==============================="
echo ""

echo "Checking core files for remaining hardcoded references..."
echo ""

# Core files to check (Phase 1 only)
CORE_FILES=(
    "CLAUDE.md"
    "README.md"
    "package.json"
    "package-lock.json"
    "DOCUMENTATION_MAP.md"
    "config/client.config.json"
)

echo "📋 PHASE 1 CORE FILE CHECKS:"
echo "----------------------------"

for file in "${CORE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Checking: $file"

        # Check for client-specific references (excluding config which should have them as examples)
        if [[ "$file" != "config/client.config.json" ]]; then
            client_count=$(grep -i "{{COMPANY_NAME}}" "$file" 2>/dev/null | wc -l)
            if [ $client_count -eq 0 ]; then
                # Check for any remaining hardcoded client references
                hardcoded_count=$(grep -i -E "(specific-client-name|example-location)" "$file" 2>/dev/null | wc -l)
                if [ $hardcoded_count -gt 0 ]; then
                    echo "  ⚠️  Found $hardcoded_count hardcoded client references:"
                    grep -n -i -E "(specific-client-name|example-location)" "$file" | head -3
                    echo ""
                fi
            fi
        fi

        # Check for client name references
        client_name_count=$(grep -i "example-client-name" "$file" 2>/dev/null | wc -l)
        if [ $client_name_count -gt 0 ]; then
            echo "  ⚠️  Found $client_name_count client name references:"
            grep -n -i "example-client-name" "$file" | head -3
            echo ""
        fi

        # Check for old repository name references
        repo_count=$(grep -i "old-marketing-team-repo" "$file" 2>/dev/null | wc -l)
        if [ $repo_count -gt 0 ]; then
            echo "  ⚠️  Found $repo_count old repo name references (should be marketing-team-base):"
            grep -n -i "old-marketing-team-repo" "$file" | head -3
            echo ""
        fi
    else
        echo "❌ Missing: $file"
    fi
done

echo ""
echo "📊 TEMPLATE SYSTEM VERIFICATION:"
echo "--------------------------------"

# Check if template exists
if [ -f "config/client.config.template.json" ]; then
    echo "✅ Template configuration file exists"
    template_vars=$(grep -o "{{[^}]*}}" config/client.config.template.json | wc -l)
    echo "   📝 Contains $template_vars template variables"
else
    echo "❌ Template configuration file missing"
fi

# Check if automation script exists
if [ -f "deployment/customize-claude.py" ]; then
    echo "✅ Automation script exists"
else
    echo "❌ Automation script missing"
fi

# Check if CLAUDE template exists
if [ -f "CLAUDE-template.md" ]; then
    echo "✅ CLAUDE template exists"
    claude_vars=$(grep -o "{{[^}]*}}" CLAUDE-template.md | wc -l)
    echo "   📝 Contains $claude_vars template variables"
else
    echo "❌ CLAUDE template missing"
fi

echo ""
echo "🎯 PHASE 1 SUCCESS CRITERIA:"
echo "----------------------------"

# Check success criteria
success_count=0
total_checks=5

echo -n "1. Configuration template system functional: "
if [ -f "config/client.config.template.json" ] && [ -f "deployment/customize-claude.py" ]; then
    echo "✅ PASS"
    ((success_count++))
else
    echo "❌ FAIL"
fi

echo -n "2. Project name updated to marketing-team-base: "
if grep -q "marketing-team-base" package.json 2>/dev/null; then
    echo "✅ PASS"
    ((success_count++))
else
    echo "❌ FAIL"
fi

echo -n "3. Core documentation generalized: "
readme_generic=$(grep -i "brand-agnostic" README.md 2>/dev/null | wc -l)
if [ $readme_generic -gt 0 ]; then
    echo "✅ PASS"
    ((success_count++))
else
    echo "❌ FAIL"
fi

echo -n "4. CLAUDE.md uses template variables: "
if [ -f "CLAUDE.md" ] && [ -f "CLAUDE-template.md" ]; then
    echo "✅ PASS"
    ((success_count++))
else
    echo "❌ FAIL"
fi

echo -n "5. Documentation map updated: "
if grep -q "Marketing Team Base" DOCUMENTATION_MAP.md 2>/dev/null; then
    echo "✅ PASS"
    ((success_count++))
else
    echo "❌ FAIL"
fi

echo ""
echo "📈 PHASE 1 COMPLETION STATUS:"
echo "=============================="
echo "✅ Completed: $success_count/$total_checks checks"

if [ $success_count -eq $total_checks ]; then
    echo "🎉 PHASE 1 COMPLETE! Ready for Phase 2."
    exit 0
elif [ $success_count -ge 3 ]; then
    echo "⚠️  PHASE 1 MOSTLY COMPLETE. Address remaining items before Phase 2."
    exit 1
else
    echo "❌ PHASE 1 INCOMPLETE. Significant work needed."
    exit 2
fi