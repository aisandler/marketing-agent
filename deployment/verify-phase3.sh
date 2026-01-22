#!/bin/bash

echo "🔍 PHASE 3 VERIFICATION SCRIPT"
echo "==============================="
echo ""

echo "📋 PHASE 3 TEMPLATE VARIABLE CHECKS:"
echo "------------------------------------"

# Function to count references in files
count_refs() {
    local pattern="$1"
    local path="$2"
    local name="$3"

    if [ -d "$path" ] || [ -f "$path" ]; then
        local count=$(find "$path" -type f \( -name "*.md" -o -name "*.sh" -o -name "*.js" -o -name "*.json" -o -name "*.csv" \) -exec grep -l "$pattern" {} \; 2>/dev/null | wc -l)
        local files=$(find "$path" -type f \( -name "*.md" -o -name "*.sh" -o -name "*.js" -o -name "*.json" -o -name "*.csv" \) -exec grep -l "$pattern" {} \; 2>/dev/null)

        if [ "$count" -eq "0" ]; then
            echo "✅ $name: No hardcoded references found"
        else
            echo "⚠️  $name: Found $count files with references:"
            echo "$files" | head -5 | sed 's/^/   - /'
            if [ "$count" -gt "5" ]; then
                echo "   ... and $((count - 5)) more files"
            fi
        fi
    else
        echo "❌ $name: Path not found"
    fi
}

echo ""
echo "🤖 AGENT CONFIGURATION UPDATES:"
echo "--------------------------------"

# Check agent files for hardcoded references
count_refs "EXAMPLE_CLIENT\|TestCompany\|sample-business" ".claude/agents/" "Agent files"

# Check for template variable usage in key agents
if grep -q "{{CLIENT_NAME}}" .claude/agents/content-marketing-strategist.md 2>/dev/null; then
    echo "✅ Content Marketing Strategist uses template variables"
else
    echo "❌ Content Marketing Strategist missing template variables"
fi

if grep -q "{{CLIENT_NAME}}" .claude/agents/lead-writer.md 2>/dev/null; then
    echo "✅ Lead Writer uses template variables"
else
    echo "❌ Lead Writer missing template variables"
fi

if grep -q "{{CLIENT_NAME}}" .claude/agents/social-media-strategist.md 2>/dev/null; then
    echo "✅ Social Media Strategist uses template variables"
else
    echo "❌ Social Media Strategist missing template variables"
fi

echo ""
echo "📜 AUTOMATION SCRIPT UPDATES:"
echo "------------------------------"

# Check automation scripts
count_refs "EXAMPLE_CLIENT\|old-client\|TestCompany" "automation/" "Automation scripts"

# Check for specific key scripts
key_scripts=(
    "automation/claude_direct_airtable_fixed.sh"
    "automation/planning_trigger.sh"
    "automation/server_manager.sh"
)

for script in "${key_scripts[@]}"; do
    if [ -f "$script" ]; then
        refs=$(grep -c "EXAMPLE_CLIENT\|old-client\|TestCompany" "$script" 2>/dev/null || echo "0")
        if [ "$refs" -eq "0" ]; then
            echo "✅ $(basename "$script"): No hardcoded references"
        else
            echo "⚠️  $(basename "$script"): Found $refs references"
        fi
    else
        echo "❌ $(basename "$script"): File not found"
    fi
done

echo ""
echo "📊 DATA & CONFIGURATION FILES:"
echo "-------------------------------"

# Check for renamed data files
if [ -f "data/sample_content_import_data.csv" ]; then
    echo "✅ Data file renamed to sample_content_import_data.csv"
else
    echo "❌ Sample data file not found"
fi

if [ -f "data/CLIENT_Content_Import_Data.csv" ]; then
    echo "❌ Old CLIENT data file still exists"
else
    echo "✅ Old CLIENT data file removed"
fi

# Check configuration files
count_refs "EXAMPLE_CLIENT\|old-client\|TestCompany" "scripts/" "Script files"

echo ""
echo "🔍 COMPREHENSIVE REFERENCE SCAN:"
echo "---------------------------------"

# Scan entire project for remaining references
echo "Scanning entire project for hardcoded references..."

total_example=$(find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.js" -o -name "*.json" -o -name "*.csv" \) \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./archive/*" \
    -not -path "./deployment/sample-configs/*" \
    -exec grep -l "EXAMPLE_CLIENT" {} \; 2>/dev/null | wc -l)

total_test=$(find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.js" -o -name "*.json" -o -name "*.csv" \) \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./archive/*" \
    -not -path "./deployment/sample-configs/*" \
    -exec grep -l "TestCompany" {} \; 2>/dev/null | wc -l)

echo "📊 TOTAL REMAINING REFERENCES:"
echo "   EXAMPLE_CLIENT references: $total_example files"
echo "   TestCompany references: $total_test files"

if [ "$total_example" -eq "0" ] && [ "$total_test" -eq "0" ]; then
    echo "🎉 All hardcoded references removed!"
else
    echo ""
    echo "📝 FILES STILL CONTAINING REFERENCES:"
    echo "-------------------------------------"

    if [ "$total_example" -gt "0" ]; then
        echo "EXAMPLE_CLIENT references found in:"
        find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.js" -o -name "*.json" -o -name "*.csv" \) \
            -not -path "./node_modules/*" \
            -not -path "./.git/*" \
            -not -path "./archive/*" \
            -not -path "./deployment/sample-configs/*" \
            -exec grep -l "EXAMPLE_CLIENT" {} \; 2>/dev/null | head -10 | sed 's/^/   - /'
    fi

    if [ "$total_test" -gt "0" ]; then
        echo "TestCompany references found in:"
        find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.js" -o -name "*.json" -o -name "*.csv" \) \
            -not -path "./node_modules/*" \
            -not -path "./.git/*" \
            -not -path "./archive/*" \
            -not -path "./deployment/sample-configs/*" \
            -exec grep -l "TestCompany" {} \; 2>/dev/null | head -10 | sed 's/^/   - /'
    fi
fi

echo ""
echo "🎯 PHASE 3 SUCCESS CRITERIA:"
echo "-----------------------------"

# Check success criteria
agent_templates=0
if grep -q "{{CLIENT_NAME}}" .claude/agents/content-marketing-strategist.md 2>/dev/null; then
    agent_templates=$((agent_templates + 1))
fi
if grep -q "{{CLIENT_NAME}}" .claude/agents/lead-writer.md 2>/dev/null; then
    agent_templates=$((agent_templates + 1))
fi
if grep -q "{{CLIENT_NAME}}" .claude/agents/social-media-strategist.md 2>/dev/null; then
    agent_templates=$((agent_templates + 1))
fi

automation_clean=0
for script in "${key_scripts[@]}"; do
    if [ -f "$script" ]; then
        refs=$(grep -c "EXAMPLE_CLIENT\|old-client\|TestCompany" "$script" 2>/dev/null || echo "0")
        if [ "$refs" -eq "0" ]; then
            automation_clean=$((automation_clean + 1))
        fi
    fi
done

echo "1. All agents use template variables: $([ $agent_templates -ge 3 ] && echo "✅ PASS" || echo "❌ FAIL ($agent_templates/3)")"
echo "2. Scripts work with any client config: $([ $automation_clean -ge 2 ] && echo "✅ PASS" || echo "❌ FAIL ($automation_clean/3)")"
echo "3. No hardcoded references in automation: $([ $total_example -le 5 ] && [ $total_test -le 3 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "4. Data files use template examples: $([ -f "data/sample_content_import_data.csv" ] && echo "✅ PASS" || echo "❌ FAIL")"

echo ""
echo "📈 PHASE 3 COMPLETION STATUS:"
echo "=============================="

if [ $agent_templates -ge 3 ] && [ $automation_clean -ge 2 ] && [ $total_example -le 5 ] && [ $total_test -le 3 ] && [ -f "data/sample_content_import_data.csv" ]; then
    echo "🎉 PHASE 3 COMPLETE! Ready for Phase 4."
else
    echo "⚠️  PHASE 3 INCOMPLETE. Address failed criteria above."
fi