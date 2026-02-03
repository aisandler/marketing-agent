// Brand Hub - Interactive JavaScript
// Embedded data for standalone operation - replace with your brand's content

let activeMonth = 'january';
let activeFilter = 'all';

// Embedded dashboard data - customize for your brand via /cmo
const dashboardData = {"meta":{"lastUpdated":"2026-01-01","currentDate":"2026-01-01"},"channelWorkflow":{"partnerContent":{"process":"1. Partner creates content or records session\n2. Team edits and formats\n3. Partner posts to their account\n4. Company account reposts","whoManages":"Content team + Partner"},"companyPosts":{"process":"Created by team, posted to company account","whoManages":"Content team"},"blogPosts":{"process":"Published on website, sent via newsletter, shared on social","whoManages":"Content team"}},"contentPillars":{"pillar1":"Thought Leadership","pillar2":"Customer Success","pillar3":"Educational Content"},"decisions":[{"id":1,"title":"Brand Architecture","description":"Approve positioning and messaging framework","status":"pending","deadline":"2026-01-15","approver":["Partner 1","Partner 2"],"budgetImpact":"$0","priority":"critical"},{"id":2,"title":"Content Calendar Approval","description":"Approve quarterly publishing schedule","status":"pending","deadline":"2026-01-15","approver":["Partner 1","Partner 2"],"budgetImpact":"$0","priority":"high"}],"timeline":[{"date":"2026-01-15","event":"DECISION DEADLINE","type":"critical","description":"Decisions required to proceed"},{"date":"2026-02-01","event":"Content Launch","type":"milestone","description":"First scheduled posts go live"}],"partners":[{"id":"partner1","name":"Partner One","role":"Partner","status":"active"},{"id":"company","name":"Company","role":"Firm","status":"active"}],"calendar":{"january":[{"date":"2026-01-06","type":"firm-post","partner":null,"topic":"2026 Industry Outlook","platform":["LinkedIn"],"status":"planned","format":"text","pillar":"Thought Leadership"},{"date":"2026-01-08","type":"partner-post","partner":"Partner One","topic":"Expert Insights","platform":["LinkedIn"],"status":"planned","format":"text","pillar":"Thought Leadership"},{"date":"2026-01-13","type":"firm-post","partner":null,"topic":"Client Success Story","platform":["LinkedIn"],"status":"planned","format":"text","pillar":"Customer Success"},{"date":"2026-01-15","type":"partner-post","partner":"Partner One","topic":"How-To Guide","platform":["LinkedIn"],"status":"planned","format":"text","pillar":"Educational Content"}]},"stats":{"totalPosts":4,"partnerPosts":2,"firmPosts":2,"blogPosts":0,"approved":0,"pending":4,"published":0}};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    // Populate sections
    populateCalendar();
    populateDecisions();

    // Setup interactions
    setupMonthTabs();
    setupFilters();
}

// Deadline Countdown
function updateDeadlineCountdown() {
    const deadline = new Date(dashboardData.meta.criticalDeadline);
    const now = new Date();
    const diff = deadline - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const countdownEl = document.getElementById('deadlineCountdown');
    if (countdownEl) {
        if (days > 0) {
            countdownEl.textContent = `${days} days remaining`;
        } else if (hours > 0) {
            countdownEl.textContent = `${hours} hours remaining`;
        } else {
            countdownEl.textContent = 'DEADLINE PASSED';
        }
    }
}

// Populate Calendar
function populateCalendar() {
    const container = document.getElementById('calendarContainer');
    container.innerHTML = '';

    const monthData = dashboardData.calendar[activeMonth];
    if (!monthData) return;

    // Filter by active filter
    const filteredData = activeFilter === 'all'
        ? monthData
        : monthData.filter(item => item.type === activeFilter);

    // Get the first and last day of the month - parse directly to avoid timezone issues
    const firstDateStr = filteredData[0]?.date || `2025-${activeMonth === 'december' ? '12' : activeMonth === 'january' ? '01' : '02'}-01`;
    const [year, monthNum] = firstDateStr.split('-').map(Number);
    const month = monthNum - 1; // JavaScript months are 0-indexed

    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create map of dates to content
    const contentByDate = {};
    filteredData.forEach(item => {
        // Parse date manually to avoid timezone issues
        const [y, m, d] = item.date.split('-').map(Number);
        const dayNum = d;
        if (!contentByDate[dayNum]) {
            contentByDate[dayNum] = [];
        }
        contentByDate[dayNum].push(item);
    });

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);

        // Add content for this day if exists
        if (contentByDate[day]) {
            dayCell.classList.add('has-content');

            contentByDate[day].forEach(item => {
                const contentItem = document.createElement('div');
                contentItem.className = `calendar-content-item ${item.type}`;
                contentItem.innerHTML = `
                    <div class="content-type-badge">${item.type.replace('-', ' ')}</div>
                    <div class="content-topic">${item.topic}</div>
                    ${item.pillar ? `<div class="content-pillar">${item.pillar}</div>` : ''}
                    <div class="content-meta">
                        ${item.partner ? `<div class="content-partner">${item.partner}</div>` : '<div class="content-partner">Company</div>'}
                        ${item.postingChannel ? `<div class="content-channel">${item.postingChannel}</div>` : ''}
                    </div>
                `;

                // Make clickable for details
                contentItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showContentDetails(item);
                });

                dayCell.appendChild(contentItem);
            });
        }

        calendarGrid.appendChild(dayCell);
    }

    container.appendChild(calendarGrid);
}

// Show content details in modal/expanded view
function showContentDetails(item) {
    const modal = document.createElement('div');
    modal.className = 'content-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${item.topic}</h3>
            <div class="modal-details">
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${item.type.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${item.status.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Platform:</span>
                    <span class="detail-value">${item.platform.join(', ')}</span>
                </div>
                ${item.partner ? `
                <div class="detail-row">
                    <span class="detail-label">Partner:</span>
                    <span class="detail-value">${item.partner}</span>
                </div>
                ` : ''}
                ${item.postingChannel ? `
                <div class="detail-row">
                    <span class="detail-label">Posting Channel:</span>
                    <span class="detail-value">${item.postingChannel}</span>
                </div>
                ` : ''}
                ${item.duration ? `
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${item.duration}</span>
                </div>
                ` : ''}
                ${item.recordingDate ? `
                <div class="detail-row">
                    <span class="detail-label">Recording Date:</span>
                    <span class="detail-value">${new Date(item.recordingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                ` : ''}
                ${item.format ? `
                <div class="detail-row">
                    <span class="detail-label">Format:</span>
                    <span class="detail-value">${item.format.replace('-', ' ').toUpperCase()}</span>
                </div>
                ` : ''}
                ${item.whoToPost ? `
                <div class="detail-row">
                    <span class="detail-label">Who Posts:</span>
                    <span class="detail-value">${item.whoToPost}</span>
                </div>
                ` : ''}
                ${item.pillar ? `
                <div class="detail-row">
                    <span class="detail-label">Content Pillar:</span>
                    <span class="detail-value" style="font-weight: 600; color: var(--color-primary);">${item.pillar}</span>
                </div>
                ` : ''}
                ${item.brief ? `
                <div class="detail-row" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border);">
                    <span class="detail-label">Brief:</span>
                    <span class="detail-value" style="font-style: italic;">${item.brief}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal handlers
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

// Populate Decisions
function populateDecisions() {
    const container = document.getElementById('decisionsGrid');
    container.innerHTML = '';

    dashboardData.decisions.forEach(decision => {
        const card = document.createElement('div');
        card.className = 'decision-card';

        card.innerHTML = `
            <div class="decision-header">
                <div class="decision-number">Decision #${decision.id}</div>
                <div class="decision-status">${decision.status.toUpperCase()}</div>
            </div>
            <h3 class="decision-title">${decision.title}</h3>
            <p class="decision-description">${decision.description}</p>
            <div class="decision-meta">
                <div class="decision-budget">${decision.budgetImpact}</div>
                <div class="decision-approvers">${decision.approver.join(', ')}</div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Setup Month Tabs
function setupMonthTabs() {
    document.querySelectorAll('.month-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.month-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active month
            activeMonth = tab.dataset.month;

            // Repopulate calendar
            populateCalendar();
        });
    });
}

// Setup Filters
function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active filter
            activeFilter = btn.dataset.filter;

            // Repopulate calendar
            populateCalendar();
        });
    });
}

// Update last updated date
const lastUpdatedEl = document.getElementById('lastUpdated');
if (lastUpdatedEl) {
    lastUpdatedEl.textContent = dashboardData.meta.lastUpdated;
}
