#!/bin/bash

# Client Server Manager
# Commands: start, stop, restart, status

# Load client configuration
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/config_loader.sh"
load_client_config
validate_config

DASHBOARD_PORT=3000
API_PORT=3002
EXTRA_PORT=5173

case "$1" in
    "start")
        echo "🚀 Starting $CLIENT_NAME servers..."
        
        # Start dashboard server
        if ! lsof -ti:$DASHBOARD_PORT > /dev/null; then
            python3 -m http.server $DASHBOARD_PORT > /dev/null 2>&1 &
            echo "✅ Dashboard server started on port $DASHBOARD_PORT"
        else
            echo "⚠️  Dashboard server already running on port $DASHBOARD_PORT"
        fi
        
        # Start API server
        if ! lsof -ti:$API_PORT > /dev/null; then
            node scripts/serve-planning-data.js > /dev/null 2>&1 &
            echo "✅ API server started on port $API_PORT"
        else
            echo "⚠️  API server already running on port $API_PORT"
        fi
        
        dashboard_file="$(get_dashboard_filename)"
        echo "🎉 $CLIENT_NAME system ready: http://localhost:$DASHBOARD_PORT/dashboard/$dashboard_file"
        ;;
        
    "stop")
        echo "🛑 Stopping $CLIENT_NAME servers..."
        
        # Kill servers by port
        for port in $DASHBOARD_PORT $API_PORT $EXTRA_PORT; do
            pid=$(lsof -ti:$port 2>/dev/null)
            if [ -n "$pid" ]; then
                kill $pid
                echo "✅ Stopped server on port $port (PID: $pid)"
            fi
        done
        
        echo "🔇 All $CLIENT_NAME servers stopped"
        ;;
        
    "restart")
        $0 stop
        sleep 2
        $0 start
        ;;
        
    "status"|"")
        ./automation/check_servers.sh
        ;;
        
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        echo "  start   - Start dashboard and API servers"
        echo "  stop    - Stop all client servers"
        echo "  restart - Stop and restart servers"
        echo "  status  - Check server health (default)"
        exit 1
        ;;
esac