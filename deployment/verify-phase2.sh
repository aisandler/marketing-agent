#!/bin/bash

echo "🔍 PHASE 2 VERIFICATION SCRIPT"
echo "==============================="
echo ""

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 exists"
        return 0
    else
        echo "❌ $1 missing"
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1 exists"
        return 0
    else
        echo "❌ $1 missing"
        return 1
    fi
}

echo "📋 PHASE 2 FILE NAMING CHECKS:"
echo "------------------------------"

# Check dashboard files were renamed
check_file "dashboard/client-interactive-dashboard.html"
if [ -f "dashboard/old-client-dashboard.html" ]; then
    echo "❌ Old dashboard file still exists: dashboard/old-client-dashboard.html"
else
    echo "✅ Old dashboard file removed"
fi

# Check documentation files were renamed
echo ""
echo "📝 Documentation File Renames:"
check_file "docs/active/CLIENT_BRAND_GUIDELINES_TEMPLATE.md"
check_file "docs/strategy/CONTENT_STRATEGY_TEMPLATE.md"
check_file "docs/reference/WEBHOOK_API_DOCUMENTATION.md"
check_file "automation/api/CLIENT_File_Management_API_Reference.md"
check_file "docs/CLIENT_CONTEXT_REFERENCE_MAP.md"
check_file "docs/operations/CLIENT_CONTENT_PRIORITIES.md"
check_file "docs/reference/CLIENT_AIRTABLE_SCHEMA.md"
check_file "docs/reference/CLIENT_COLLABORATION_DASHBOARD.md"
check_file "docs/reference/CLIENT_Webhook_Integration_Plan.md"
check_file "docs/strategy/CLIENT_COMPREHENSIVE_BRAND_ANALYSIS.md"
check_file "docs/templates/client_local_seo_content_template.md"

echo ""
echo "📁 CONTENT DIRECTORY STRUCTURE:"
echo "--------------------------------"

# Check content directories
check_dir "content/client-samples"
check_dir "content/templates"

# Check client-context was moved
if [ -d "docs/client-context" ]; then
    echo "❌ Old client-context directory still exists"
else
    echo "✅ client-context directory removed from docs/"
fi

# Check if content was moved to client-samples
if [ -d "content/client-samples/branding" ]; then
    echo "✅ Content moved to client-samples successfully"
else
    echo "❌ Content not found in client-samples"
fi

echo ""
echo "🔍 TEMPLATE VARIABLE CHECKS:"
echo "-----------------------------"

# Check for remaining CLIENT references in dashboard
client_count=$(grep -c "CLIENT" dashboard/client-interactive-dashboard.html 2>/dev/null || echo "0")
if [ "$client_count" -eq "0" ]; then
    echo "✅ No CLIENT references in dashboard"
else
    echo "⚠️  Found $client_count CLIENT references in dashboard"
    grep -n "CLIENT" dashboard/client-interactive-dashboard.html | head -5
fi

# Check dashboard index.html for template variables
client_var_count=$(grep -c "{{CLIENT_NAME}}" dashboard/index.html 2>/dev/null || echo "0")
if [ "$client_var_count" -gt "0" ]; then
    echo "✅ Template variables found in dashboard/index.html"
else
    echo "❌ No template variables in dashboard/index.html"
fi

echo ""
echo "🎯 PHASE 2 SUCCESS CRITERIA:"
echo "-----------------------------"

# Count successful checks
total_checks=0
passed_checks=0

# File checks
files=(
    "dashboard/client-interactive-dashboard.html"
    "docs/active/CLIENT_BRAND_GUIDELINES_TEMPLATE.md"
    "docs/strategy/CONTENT_STRATEGY_TEMPLATE.md"
    "docs/reference/WEBHOOK_API_DOCUMENTATION.md"
)

for file in "${files[@]}"; do
    total_checks=$((total_checks + 1))
    if [ -f "$file" ]; then
        passed_checks=$((passed_checks + 1))
    fi
done

# Directory checks
dirs=(
    "content/client-samples"
    "content/templates"
)

for dir in "${dirs[@]}"; do
    total_checks=$((total_checks + 1))
    if [ -d "$dir" ]; then
        passed_checks=$((passed_checks + 1))
    fi
done

echo "1. Files renamed to generic conventions: $([ $passed_checks -ge 4 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "2. Content directory restructured: $([ -d "content/client-samples" ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "3. Dashboard uses template variables: $([ $client_var_count -gt 0 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "4. Old CLIENT files removed: $([ ! -f "dashboard/old-client-dashboard.html" ] && echo "✅ PASS" || echo "❌ FAIL")"

echo ""
echo "📈 PHASE 2 COMPLETION STATUS:"
echo "=============================="
echo "✅ Completed: $passed_checks/$total_checks checks"

if [ $passed_checks -eq $total_checks ] && [ $client_var_count -gt 0 ]; then
    echo "🎉 PHASE 2 COMPLETE! Ready for Phase 3."
else
    echo "⚠️  PHASE 2 INCOMPLETE. Review failed checks above."
fi