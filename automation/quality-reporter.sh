#!/bin/bash

# Marketing Engine Quality Reporter
# Generates comprehensive monthly quality reports

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
METRICS_DIR="$PROJECT_ROOT/metrics"
REPORTS_DIR="$PROJECT_ROOT/reports"

# Ensure reports directory exists
mkdir -p "$REPORTS_DIR"

# Default values
YEAR=$(date +%Y)
MONTH=$(date +%m)
OUTPUT_FORMAT="html"
INCLUDE_CHARTS=true
EMAIL_REPORT=false

# Functions
show_help() {
    echo "Marketing Engine Quality Reporter"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -y, --year YEAR          Year for the report (default: current year)"
    echo "  -m, --month MONTH        Month for the report (default: current month)"
    echo "  -f, --format FORMAT      Output format: html, json, pdf (default: html)"
    echo "  -o, --output FILE        Output file path (default: auto-generated)"
    echo "  --no-charts              Exclude charts from HTML reports"
    echo "  --email                  Email the report (requires configuration)"
    echo "  --current                Generate report for current month to date"
    echo "  --previous               Generate report for previous month"
    echo "  --quarterly              Generate quarterly report"
    echo "  --compare MONTH          Compare with specified month"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Current month HTML report"
    echo "  $0 --previous            # Previous month report"
    echo "  $0 -y 2024 -m 3 -f json  # March 2024 JSON report"
    echo "  $0 --quarterly           # Current quarter report"
    echo "  $0 --compare 2           # Compare current month with February"
}

log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        "INFO")
            echo -e "${GREEN}[INFO]${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "DEBUG")
            echo -e "${BLUE}[DEBUG]${NC} $message"
            ;;
    esac

    echo "[$timestamp] $level: $message" >> "$REPORTS_DIR/quality-reporter.log"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -y|--year)
            YEAR="$2"
            shift 2
            ;;
        -m|--month)
            MONTH="$2"
            shift 2
            ;;
        -f|--format)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --no-charts)
            INCLUDE_CHARTS=false
            shift
            ;;
        --email)
            EMAIL_REPORT=true
            shift
            ;;
        --current)
            YEAR=$(date +%Y)
            MONTH=$(date +%m)
            shift
            ;;
        --previous)
            PREV_DATE=$(date -d "last month" +%Y-%m)
            YEAR=${PREV_DATE%-*}
            MONTH=${PREV_DATE#*-}
            shift
            ;;
        --quarterly)
            REPORT_TYPE="quarterly"
            shift
            ;;
        --compare)
            COMPARE_MONTH="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_message "ERROR" "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate inputs
if [[ ! $YEAR =~ ^[0-9]{4}$ ]]; then
    log_message "ERROR" "Invalid year: $YEAR"
    exit 1
fi

if [[ ! $MONTH =~ ^[0-9]{1,2}$ ]] || [[ $MONTH -lt 1 ]] || [[ $MONTH -gt 12 ]]; then
    log_message "ERROR" "Invalid month: $MONTH"
    exit 1
fi

# Normalize month to 2 digits
MONTH=$(printf "%02d" $MONTH)

# Generate default output filename if not specified
if [[ -z "$OUTPUT_FILE" ]]; then
    if [[ "$REPORT_TYPE" == "quarterly" ]]; then
        QUARTER=$(( (MONTH - 1) / 3 + 1 ))
        OUTPUT_FILE="$REPORTS_DIR/quality-report-${YEAR}-Q${QUARTER}.${OUTPUT_FORMAT}"
    else
        OUTPUT_FILE="$REPORTS_DIR/quality-report-${YEAR}-${MONTH}.${OUTPUT_FORMAT}"
    fi
fi

log_message "INFO" "Starting quality report generation"
log_message "INFO" "Period: $YEAR-$MONTH"
log_message "INFO" "Format: $OUTPUT_FORMAT"
log_message "INFO" "Output: $OUTPUT_FILE"

# Check if performance tracker exists
PERFORMANCE_TRACKER="$METRICS_DIR/performance-tracker.js"
if [[ ! -f "$PERFORMANCE_TRACKER" ]]; then
    log_message "ERROR" "Performance tracker not found: $PERFORMANCE_TRACKER"
    exit 1
fi

# Check if health checker exists
HEALTH_CHECKER="$METRICS_DIR/agent-health-checker.js"
if [[ ! -f "$HEALTH_CHECKER" ]]; then
    log_message "ERROR" "Health checker not found: $HEALTH_CHECKER"
    exit 1
fi

# Generate report data
log_message "INFO" "Collecting performance metrics..."
PERFORMANCE_DATA=$(node "$PERFORMANCE_TRACKER" report $YEAR $MONTH 2>/dev/null)
if [[ $? -ne 0 ]] || [[ -z "$PERFORMANCE_DATA" ]]; then
    log_message "WARN" "No performance data available for $YEAR-$MONTH"
    PERFORMANCE_DATA='{"period":"'$YEAR-$MONTH'","error":"No data available"}'
fi

log_message "INFO" "Running health check..."
HEALTH_DATA=$(node "$HEALTH_CHECKER" check 2>/dev/null && node "$HEALTH_CHECKER" report 2>/dev/null)
if [[ $? -ne 0 ]] || [[ -z "$HEALTH_DATA" ]]; then
    log_message "WARN" "Health check failed or no data available"
    HEALTH_DATA='{"overall_status":"unknown","error":"Health check failed"}'
fi

# Get alerting data if available
ALERTING_SYSTEM="$METRICS_DIR/alerting-system.js"
ALERTING_DATA=""
if [[ -f "$ALERTING_SYSTEM" ]]; then
    log_message "INFO" "Collecting alerting data..."
    ALERTING_DATA=$(node "$ALERTING_SYSTEM" summary 2>/dev/null)
fi

# Generate report based on format
case $OUTPUT_FORMAT in
    "html")
        generate_html_report
        ;;
    "json")
        generate_json_report
        ;;
    "pdf")
        generate_pdf_report
        ;;
    *)
        log_message "ERROR" "Unsupported format: $OUTPUT_FORMAT"
        exit 1
        ;;
esac

log_message "INFO" "Quality report generated: $OUTPUT_FILE"

# Email report if requested
if [[ "$EMAIL_REPORT" == "true" ]]; then
    send_email_report
fi

# Show summary
show_report_summary

exit 0

# Report generation functions
generate_html_report() {
    log_message "INFO" "Generating HTML report..."

    cat > "$OUTPUT_FILE" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marketing Engine Quality Report - $YEAR-$MONTH</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            min-height: 100vh;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 10px;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .section {
            margin-bottom: 40px;
            background: #f9f9f9;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .section h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border-left: 4px solid #3498db;
        }

        .metric-card.success {
            border-left-color: #27ae60;
        }

        .metric-card.warning {
            border-left-color: #f39c12;
        }

        .metric-card.danger {
            border-left-color: #e74c3c;
        }

        .metric-title {
            font-size: 0.9em;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #2c3e50;
        }

        .recommendations {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
        }

        .recommendation-item {
            margin-bottom: 10px;
            padding: 10px;
            background: white;
            border-radius: 5px;
            border-left: 3px solid #f39c12;
        }

        .status-indicator {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-healthy {
            background: #d5f4e6;
            color: #27ae60;
        }

        .status-warning {
            background: #fef5e7;
            color: #f39c12;
        }

        .status-critical {
            background: #fadbd8;
            color: #e74c3c;
        }

        .chart-placeholder {
            background: #ecf0f1;
            height: 300px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7f8c8d;
            font-size: 1.1em;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
            border-top: 1px solid #ecf0f1;
            margin-top: 40px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .data-table th,
        .data-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }

        .data-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .header {
                padding: 20px;
            }

            .header h1 {
                font-size: 1.8em;
            }

            .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Marketing Engine Quality Report</h1>
            <p>Performance Analysis for $YEAR-$MONTH</p>
            <p>Generated on $(date)</p>
        </div>
EOF

    # Add performance metrics section
    echo "$PERFORMANCE_DATA" | node -e "
        const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));

        console.log(\`
        <div class='section'>
            <h2>📈 Performance Metrics</h2>
            <div class='metrics-grid'>
                <div class='metric-card \${data.summary && parseFloat(data.summary.overall_success_rate) >= 90 ? 'success' : 'warning'}'>
                    <div class='metric-title'>Overall Success Rate</div>
                    <div class='metric-value'>\${data.summary ? data.summary.overall_success_rate : 'N/A'}</div>
                </div>
                <div class='metric-card'>
                    <div class='metric-title'>Total Generations</div>
                    <div class='metric-value'>\${data.summary ? data.summary.total_generations : 'N/A'}</div>
                </div>
                <div class='metric-card'>
                    <div class='metric-title'>Average Generation Time</div>
                    <div class='metric-value'>\${data.summary ? data.summary.avg_generation_time : 'N/A'}</div>
                </div>
                <div class='metric-card \${data.summary && parseFloat(data.summary.error_rate) <= 5 ? 'success' : 'warning'}'>
                    <div class='metric-title'>Error Rate</div>
                    <div class='metric-value'>\${data.summary ? data.summary.error_rate : 'N/A'}</div>
                </div>
                <div class='metric-card'>
                    <div class='metric-title'>Validation Pass Rate</div>
                    <div class='metric-value'>\${data.summary ? data.summary.validation_pass_rate : 'N/A'}</div>
                </div>
                <div class='metric-card'>
                    <div class='metric-title'>Approval Rate</div>
                    <div class='metric-value'>\${data.summary ? data.summary.approval_rate : 'N/A'}</div>
                </div>
            </div>
        </div>\`);
    " >> "$OUTPUT_FILE"

    # Add system health section
    echo "$HEALTH_DATA" | node -e "
        const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));

        const getStatusClass = (status) => {
            switch(status) {
                case 'healthy': return 'success';
                case 'warning': case 'degraded': return 'warning';
                case 'critical': case 'error': return 'danger';
                default: return '';
            }
        };

        const getStatusIndicator = (status) => {
            const className = status === 'healthy' ? 'status-healthy' :
                            status === 'warning' || status === 'degraded' ? 'status-warning' :
                            'status-critical';
            return \`<span class='\${className} status-indicator'>\${status}</span>\`;
        };

        console.log(\`
        <div class='section'>
            <h2>🏥 System Health</h2>
            <p><strong>Overall Status:</strong> \${getStatusIndicator(data.overall_status || 'unknown')}</p>
            <p><strong>Last Check:</strong> \${data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unknown'}</p>

            <h3>Component Status</h3>
            <table class='data-table'>
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
        \`);

        if (data.system_health) {
            Object.entries(data.system_health).forEach(([component, health]) => {
                const status = health.status || health.running !== undefined ? (health.running ? 'healthy' : 'down') : 'unknown';
                const details = health.response_time ? \`Response: \${health.response_time}ms\` :
                              health.files_present ? \`Files: \${health.files_present}/\${health.total_files}\` :
                              health.error || 'OK';

                console.log(\`
                    <tr>
                        <td>\${component.replace(/_/g, ' ').toUpperCase()}</td>
                        <td>\${getStatusIndicator(status)}</td>
                        <td>\${details}</td>
                    </tr>
                \`);
            });
        }

        console.log(\`
                </tbody>
            </table>
        </div>\`);
    " >> "$OUTPUT_FILE"

    # Add alerting summary if available
    if [[ -n "$ALERTING_DATA" ]]; then
        echo "$ALERTING_DATA" | node -e "
            const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));

            console.log(\`
            <div class='section'>
                <h2>🚨 Alerting Summary</h2>
                <div class='metrics-grid'>
                    <div class='metric-card \${data.active_alerts === 0 ? 'success' : 'warning'}'>
                        <div class='metric-title'>Active Alerts</div>
                        <div class='metric-value'>\${data.active_alerts || 0}</div>
                    </div>
                    <div class='metric-card \${data.critical_alerts === 0 ? 'success' : 'danger'}'>
                        <div class='metric-title'>Critical Alerts</div>
                        <div class='metric-value'>\${data.critical_alerts || 0}</div>
                    </div>
                    <div class='metric-card'>
                        <div class='metric-title'>Warning Alerts</div>
                        <div class='metric-value'>\${data.warning_alerts || 0}</div>
                    </div>
                    <div class='metric-card'>
                        <div class='metric-title'>Avg Resolution Time</div>
                        <div class='metric-value'>\${data.average_resolution_minutes || 0}m</div>
                    </div>
                </div>
            </div>\`);
        " >> "$OUTPUT_FILE"
    fi

    # Add recommendations section
    echo "$HEALTH_DATA" | node -e "
        const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));

        if (data.recommendations && data.recommendations.length > 0) {
            console.log(\`
            <div class='section'>
                <h2>💡 Recommendations</h2>
                <div class='recommendations'>\`);

            data.recommendations.forEach(rec => {
                console.log(\`
                    <div class='recommendation-item'>
                        <strong>\${rec.priority.toUpperCase()}:</strong> \${rec.message}
                        <br><small><strong>Action:</strong> \${rec.action}</small>
                    </div>\`);
            });

            console.log(\`
                </div>
            </div>\`);
        }
    " >> "$OUTPUT_FILE"

    # Add footer
    cat >> "$OUTPUT_FILE" << EOF
        <div class="footer">
            <p>Report generated by Marketing Engine Quality Reporter</p>
            <p>$(date)</p>
        </div>
    </div>
</body>
</html>
EOF
}

generate_json_report() {
    log_message "INFO" "Generating JSON report..."

    # Combine all data into a single JSON report
    node -e "
        const performanceData = $PERFORMANCE_DATA;
        const healthData = $HEALTH_DATA;
        const alertingData = $ALERTING_DATA || {};

        const report = {
            report_info: {
                period: '$YEAR-$MONTH',
                generated_at: new Date().toISOString(),
                format: 'json',
                version: '1.0'
            },
            performance_metrics: performanceData,
            system_health: healthData,
            alerting_summary: alertingData
        };

        console.log(JSON.stringify(report, null, 2));
    " > "$OUTPUT_FILE"
}

generate_pdf_report() {
    log_message "INFO" "Generating PDF report..."

    # First generate HTML then convert to PDF (requires wkhtmltopdf or similar)
    local temp_html="${OUTPUT_FILE%.pdf}.temp.html"
    OUTPUT_FILE="$temp_html" generate_html_report

    if command -v wkhtmltopdf &> /dev/null; then
        wkhtmltopdf "$temp_html" "${OUTPUT_FILE%.temp.html}"
        rm "$temp_html"
        log_message "INFO" "PDF generated using wkhtmltopdf"
    else
        log_message "WARN" "wkhtmltopdf not found. HTML file saved as ${temp_html}"
        mv "$temp_html" "${OUTPUT_FILE%.pdf}.html"
        OUTPUT_FILE="${OUTPUT_FILE%.pdf}.html"
    fi
}

send_email_report() {
    log_message "INFO" "Email functionality not yet implemented"
    # TODO: Implement email sending functionality
}

show_report_summary() {
    echo ""
    echo -e "${GREEN}📊 Quality Report Summary${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Period: $YEAR-$MONTH"
    echo "Format: $OUTPUT_FORMAT"
    echo "Output: $OUTPUT_FILE"
    echo "Size: $(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)"
    echo ""

    if [[ "$OUTPUT_FORMAT" == "html" ]]; then
        echo "To view the report:"
        echo "  open \"$OUTPUT_FILE\""
        echo ""
    fi
}