#!/bin/bash

# Client Content Planning Trigger Script
# Usage: Called when user says "let's plan" in Claude Code

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config

echo "🎯 Starting Content Planning Session for $CLIENT_NAME..."

# Navigate to project directory
cd "/Users/adamsandler/projects/Marketing-team-base"

# Kill any conflicting processes on both ports and cleanup background processes
echo "🧹 Cleaning up any existing servers and background processes..."

# Clean up server processes
pkill -f "python3 -m http.server 3000" 2>/dev/null || true
pkill -f "serve-planning-data.js" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true

# Clean up any background curl/planning processes that might be polling the API
pkill -f "curl.*localhost:3002.*planning-state" 2>/dev/null || true
pkill -f "planning_trigger.sh" 2>/dev/null || true
pkill -f "claude_gui_sync.sh" 2>/dev/null || true

# Clean up any lingering automation scripts
pkill -f "automation/.*\.sh" 2>/dev/null || true

echo "🧹 Background process cleanup complete"

# Wait for ports to be free
sleep 2

# Start planning data API server (port 3002)
echo "🚀 Starting planning data API server..."
node scripts/serve-planning-data.js > "/tmp/${CLIENT_NAME,,}_api.log" 2>&1 &
API_PID=$!

# Wait for API server to be ready
echo "⏳ Waiting for API server to start..."
for i in {1..10}; do
    if curl -s http://localhost:3002/api/planning-state > /dev/null 2>&1; then
        echo "✅ Planning data API server is ready!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ API server failed to start. Check /tmp/${CLIENT_NAME,,}_api.log"
        exit 1
    fi
    sleep 1
done

# Start HTTP server for dashboard (port 3000)
echo "🚀 Starting planning dashboard server..."
python3 -m http.server 3000 > "/tmp/${CLIENT_NAME,,}_dashboard.log" 2>&1 &
DASHBOARD_PID=$!

# Wait for dashboard server to be ready
echo "⏳ Waiting for dashboard server to start..."
for i in {1..10}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Dashboard server is ready!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Dashboard server failed to start. Check /tmp/${CLIENT_NAME,,}_dashboard.log"
        exit 1
    fi
    sleep 1
done

# Verify dashboard file exists
dashboard_file="$(get_dashboard_filename)"
if [ -f "dashboard/$dashboard_file" ]; then
    echo "📄 Dashboard file found: $dashboard_file"
    # Open specific dashboard file
    echo "🌐 Opening planning dashboard..."
    open "http://localhost:3000/dashboard/$dashboard_file"
else
    echo "📄 Dashboard file not found, opening root"
    # Open root URL
    echo "🌐 Opening planning dashboard..."
    open "http://localhost:3000"
fi

dashboard_file="$(get_dashboard_filename)"
echo "📋 $CLIENT_NAME Content Planning Dashboard Ready!"
echo "   → Dashboard: http://localhost:3000/dashboard/$dashboard_file"
echo "   → API Server: http://localhost:3002/api/planning-state"
echo "   → Both servers running and ready for content planning!"
echo ""

# Display optimized workflow instructions
industry_content=$(get_industry_content)
echo "🎯 OPTIMIZED CONTENT WORKFLOW FOR $CLIENT_NAME:"
echo ""
echo "STEP 1: Choose Your Generation Path"
echo "  → LOCAL (Claude Code): Strategy, research, urgent, text-only"
echo "  → SYSTEMATIC (External): Images required, complex content, automation workflows"
echo ""
echo "STEP 2: Apply Decision Criteria (use CONTENT_GENERATION_GUIDE.md)"
echo "  • Images required? (+2 points → Systematic)"
echo "  • Search volume >500? (+2 points → Systematic)"
echo "  • Urgent same-day? (+2 points → Local)"
echo "  • Score +4 or higher = SYSTEMATIC | +3 or lower = LOCAL"
echo ""
echo "STEP 3: Execute"
echo "  → IF LOCAL: Create in Claude Code, add to Airtable for tracking"
echo "  → IF SYSTEMATIC: Create brief using template, route to external system"
echo ""
echo "STEP 4: Monitor Costs"
echo "  → Budget: \$40/month | Target: 300%+ ROI"
echo "  → Check: node automation/cost_tracker.js"
echo ""
echo "📁 Quick Reference Files:"
echo "  • CONTENT_GENERATION_GUIDE.md - Complete decision framework & templates"
echo "  • IMMEDIATE_IMPLEMENTATION_PLAN.md - Step-by-step guide"
echo ""
echo "⚡ Test Integration: ./automation/test_integration.sh"
echo "💰 Track Costs: node automation/cost_tracker.js"
echo ""
echo "Ready to optimize your $industry_content content workflow! 🚀"