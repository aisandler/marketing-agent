#!/bin/bash

# Client Server Health Check Script
# Verifies that both dashboard and API servers are running correctly

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config

echo "🔍 $(get_system_name) Server Health Check..."
echo ""

# Check dashboard server (port 3000)
echo "📊 Checking Dashboard Server (port 3000)..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dashboard server is running"
    dashboard_file="$(get_dashboard_filename)"
    if curl -s "http://localhost:3000/dashboard/$dashboard_file" > /dev/null 2>&1; then
        echo "✅ Dashboard HTML file is accessible"
    else
        echo "❌ Dashboard HTML file not found"
    fi
else
    echo "❌ Dashboard server is not running"
fi

echo ""

# Check API server (port 3002)
echo "📡 Checking Planning Data API Server (port 3002)..."
if curl -s http://localhost:3002/api/planning-state > /dev/null 2>&1; then
    echo "✅ Planning data API server is running"
    
    # Check if there's actual data
    response=$(curl -s http://localhost:3002/api/planning-state)
    if [[ $response == *"content_records"* ]]; then
        echo "✅ Planning state data is available"
        count=$(echo "$response" | grep -o '"content_records":\[' | wc -l)
        if [ $count -gt 0 ]; then
            records=$(echo "$response" | grep -o '"id":' | wc -l)
            echo "✅ Found $records content records in planning state"
        fi
    else
        echo "⚠️  API server running but no planning state data found"
    fi
else
    echo "❌ Planning data API server is not running"
fi

echo ""

# Check processes
echo "🔧 Process Status:"
dashboard_pid=$(lsof -ti:3000 2>/dev/null)
api_pid=$(lsof -ti:3002 2>/dev/null)

if [ -n "$dashboard_pid" ]; then
    echo "✅ Dashboard server PID: $dashboard_pid"
else
    echo "❌ No process found on port 3000"
fi

if [ -n "$api_pid" ]; then
    echo "✅ API server PID: $api_pid"
else
    echo "❌ No process found on port 3002"
fi

echo ""

# Overall status
if curl -s http://localhost:3000 > /dev/null 2>&1 && curl -s http://localhost:3002/api/planning-state > /dev/null 2>&1; then
    dashboard_file="$(get_dashboard_filename)"
    echo "🎉 $(get_system_name) is fully operational!"
    echo "   → Dashboard: http://localhost:3000/dashboard/$dashboard_file"
    echo "   → Ready for content planning workflow"
else
    echo "⚠️  $(get_system_name) needs attention - run ./automation/planning_trigger.sh to restart"
fi