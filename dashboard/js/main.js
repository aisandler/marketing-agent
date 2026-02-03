// Marketing Hub - Main JavaScript
// Editorial Command Center Interactions

// ============================================
// Data Loading & State Management
// ============================================

let activeMonth = 'december';
let activeFilter = 'all';

// Embedded dashboard data (for standalone use without server)
// Replace with your brand's content data or load from data/content-data.json
const dashboardData = {"meta":{"lastUpdated":"2026-01-01","currentDate":"2026-01-01"},"decisions":[{"id":1,"title":"Brand Architecture","description":"Approve positioning and messaging framework","status":"pending","deadline":"2026-01-15","approver":["Partner 1","Partner 2"],"budgetImpact":"$0","priority":"critical"},{"id":2,"title":"Content Calendar Approval","description":"Approve quarterly publishing schedule","status":"pending","deadline":"2026-01-15","approver":["Partner 1","Partner 2"],"budgetImpact":"$0","priority":"high"}],"timeline":[{"date":"2026-01-15","event":"DECISION DEADLINE","type":"critical","description":"Decisions required to proceed"},{"date":"2026-02-01","event":"Content Launch","type":"milestone","description":"First scheduled posts go live"}],"partners":[{"id":"partner1","name":"Partner One","role":"Partner","nextRecording":"2026-01-20","recordingTheme":"Industry Insights","format":"video","comfort":"high","pendingApprovals":0,"publishedContent":0,"status":"active"},{"id":"company","name":"Company","role":"Firm","nextRecording":null,"recordingTheme":null,"format":"text","comfort":"high","pendingApprovals":0,"publishedContent":0,"status":"active"}],"calendar":{"january":[{"date":"2026-01-06","type":"firm-post","partner":null,"topic":"2026 Industry Outlook","platform":["LinkedIn"],"status":"planned","format":"text"},{"date":"2026-01-13","type":"partner-post","partner":"Partner One","topic":"Industry Expertise Spotlight","platform":["LinkedIn"],"status":"planned","format":"text"},{"date":"2026-01-20","type":"firm-post","partner":null,"topic":"Client Success Story","platform":["LinkedIn"],"status":"planned","format":"text"}]},"stats":{"totalPosts":3,"partnerPosts":1,"firmPosts":2,"blogPosts":0,"approved":0,"pending":3,"published":0}};

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

// ============================================
// Initialize Dashboard
// ============================================

function initializeDashboard() {
    if (!dashboardData) return;

    // Update countdown
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute

    // Populate sections
    populateStats();
    populateTimeline();
    populateDecisions();
    populatePartners();
    populateCalendar();

    // Setup navigation
    setupNavigation();

    // Setup calendar interactions
    setupCalendarControls();

    // Add staggered animation to cards
    animateCardEntrance();
}

// ============================================
// Countdown Timer
// ============================================

function updateCountdown() {
    const deadline = new Date(dashboardData.meta.criticalDeadline);
    const now = new Date();
    const diff = deadline - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        if (days > 0) {
            countdownEl.textContent = `(${days} days, ${hours} hours remaining)`;
        } else if (hours > 0) {
            countdownEl.textContent = `(${hours} hours remaining)`;
        } else {
            countdownEl.textContent = `(DEADLINE PASSED)`;
            countdownEl.style.color = '#ef4444';
        }
    }

    // Update days until stat
    const daysUntilEl = document.getElementById('daysUntil');
    if (daysUntilEl) {
        daysUntilEl.textContent = Math.max(0, days);
    }
}

// ============================================
// Populate Stats
// ============================================

function populateStats() {
    const stats = dashboardData.stats;

    document.getElementById('totalPosts').textContent = stats.totalPosts;
    document.getElementById('videoCount').textContent = stats.partnerVideos;
    document.getElementById('pendingCount').textContent = stats.pending;
}

// ============================================
// Populate Timeline
// ============================================

function populateTimeline() {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    dashboardData.timeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${item.type}`;
        timelineItem.style.animationDelay = `${index * 0.1}s`;

        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        timelineItem.innerHTML = `
            <div class="timeline-date">${formattedDate}</div>
            <div class="timeline-content">
                <h3>${item.event}</h3>
                <p>${item.description}</p>
            </div>
            <div class="timeline-badge ${item.type}">${item.type.toUpperCase()}</div>
        `;

        container.appendChild(timelineItem);
    });
}

// ============================================
// Populate Decisions
// ============================================

function populateDecisions() {
    const container = document.getElementById('decisionsGrid');
    container.innerHTML = '';

    dashboardData.decisions.forEach((decision, index) => {
        const card = document.createElement('div');
        card.className = 'decision-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.onclick = () => showDecisionModal(decision);

        card.innerHTML = `
            <div class="decision-header">
                <div class="decision-number">#${decision.id}</div>
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

// ============================================
// Populate Partners
// ============================================

function populatePartners() {
    const container = document.getElementById('partnersGrid');
    container.innerHTML = '';

    dashboardData.partners.forEach((partner, index) => {
        const card = document.createElement('div');
        card.className = 'partner-card';
        card.style.animationDelay = `${index * 0.15}s`;

        const nextRecording = partner.nextRecording
            ? new Date(partner.nextRecording).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Not Scheduled';

        const actionText = partner.status === 'not-scheduled' ? 'SCHEDULE NOW' :
                          partner.status === 'discovery-needed' ? 'SCHEDULE DISCOVERY' :
                          'VIEW DETAILS';

        card.innerHTML = `
            <div class="partner-header">
                <div class="partner-info">
                    <h3>${partner.name}</h3>
                    <div class="partner-role">${partner.role}</div>
                </div>
                <div class="partner-status">${partner.status.replace('-', ' ').toUpperCase()}</div>
            </div>
            <div class="partner-details">
                <div class="partner-detail-item">
                    <span class="partner-detail-label">Next Recording:</span>
                    <span class="partner-detail-value">${nextRecording}</span>
                </div>
                <div class="partner-detail-item">
                    <span class="partner-detail-label">Theme:</span>
                    <span class="partner-detail-value">${partner.recordingTheme}</span>
                </div>
                <div class="partner-detail-item">
                    <span class="partner-detail-label">Format:</span>
                    <span class="partner-detail-value">${partner.format.toUpperCase()}</span>
                </div>
                <div class="partner-detail-item">
                    <span class="partner-detail-label">Published:</span>
                    <span class="partner-detail-value">${partner.publishedContent}</span>
                </div>
            </div>
            <button class="partner-action">${actionText}</button>
        `;

        container.appendChild(card);
    });
}

// ============================================
// Populate Calendar
// ============================================

function populateCalendar() {
    const container = document.getElementById('calendarGrid');
    container.innerHTML = '';

    const monthData = dashboardData.calendar[activeMonth];
    if (!monthData) return;

    // Create calendar structure
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.style.padding = '1rem';
        header.style.textAlign = 'center';
        header.style.fontFamily = 'var(--font-mono)';
        header.style.fontSize = '0.75rem';
        header.style.color = 'var(--color-text-muted)';
        header.textContent = day;
        container.appendChild(header);
    });

    // Get first day of month
    const year = activeMonth === 'december' ? 2025 : 2026;
    const monthNum = activeMonth === 'december' ? 11 : activeMonth === 'january' ? 0 : 1;
    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        emptyDay.style.background = 'transparent';
        container.appendChild(emptyDay);
    }

    // Add days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';

        const dateStr = `${year}-${String(monthNum + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayContent = monthData.find(item => item.date === dateStr);

        if (dayContent && (activeFilter === 'all' || activeFilter === dayContent.type)) {
            dayEl.classList.add('has-content', dayContent.type);
            dayEl.innerHTML = `
                <div class="calendar-date">${day}</div>
                <div class="calendar-content">
                    ${getContentIcon(dayContent.type)} ${dayContent.partner || 'Company'}
                    <br><small>${truncate(dayContent.topic, 30)}</small>
                </div>
            `;
            dayEl.onclick = () => showContentModal(dayContent);
        } else {
            dayEl.innerHTML = `<div class="calendar-date">${day}</div>`;
        }

        container.appendChild(dayEl);
    }
}

function getContentIcon(type) {
    const icons = {
        'video': '🎥',
        'firm-post': '📝',
        'blog': '📄'
    };
    return icons[type] || '📋';
}

function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

// ============================================
// Calendar Controls
// ============================================

function setupCalendarControls() {
    // Month tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMonth = btn.dataset.month;
            populateCalendar();
        });
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            populateCalendar();
        });
    });
}

// ============================================
// Navigation
// ============================================

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active nav
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show corresponding section
            const target = link.getAttribute('href').substring(1);
            document.querySelectorAll('main > section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(target).style.display = 'block';
        });
    });
}

// ============================================
// Modals
// ============================================

function showDecisionModal(decision) {
    const modal = document.getElementById('decisionModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1rem;">
            Decision #${decision.id}: ${decision.title}
        </h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
            ${decision.description}
        </p>

        <div style="background: rgba(245, 158, 11, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--color-accent-amber); margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 0.5rem;">Budget Impact</h3>
            <p style="font-family: var(--font-mono); font-size: 1.5rem; color: var(--color-accent-amber);">${decision.budgetImpact}</p>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 0.5rem;">Approvers</h3>
            <p style="color: var(--color-text-secondary);">${decision.approver.join(', ')}</p>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 0.5rem;">Deadline</h3>
            <p style="font-family: var(--font-mono); color: var(--color-accent-red);">${new Date(decision.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button onclick="window.open('${decision.documentLink}', '_blank')" style="flex: 1; padding: 1rem; background: var(--color-accent-amber); border: none; color: #000; font-family: var(--font-display); font-weight: 700; font-size: 1rem; border-radius: 4px; cursor: pointer;">
                VIEW FULL DETAILS
            </button>
            <button onclick="closeModal()" style="flex: 1; padding: 1rem; background: rgba(255,255,255,0.1); border: none; color: var(--color-text-primary); font-family: var(--font-display); font-weight: 700; font-size: 1rem; border-radius: 4px; cursor: pointer;">
                CLOSE
            </button>
        </div>
    `;

    modal.classList.add('active');
}

function showContentModal(content) {
    const modal = document.getElementById('decisionModal');
    const modalBody = document.getElementById('modalBody');

    const date = new Date(content.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    modalBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
            <span style="font-size: 3rem;">${getContentIcon(content.type)}</span>
            <div>
                <h2 style="font-family: var(--font-display); font-size: 1.75rem; margin-bottom: 0.25rem;">
                    ${content.topic}
                </h2>
                <p style="color: var(--color-text-secondary); font-size: 0.938rem;">${date}</p>
            </div>
        </div>

        ${content.partner ? `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0.5rem;">Partner</h3>
            <p style="color: var(--color-text-primary);">${content.partner}</p>
        </div>
        ` : ''}

        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0.5rem;">Type</h3>
            <p style="color: var(--color-text-primary); text-transform: capitalize;">${content.type.replace('-', ' ')}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0.5rem;">Platform</h3>
            <p style="color: var(--color-text-primary);">${content.platform.join(', ')}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0.5rem;">Status</h3>
            <p style="font-family: var(--font-mono); color: var(--color-accent-amber); text-transform: uppercase;">${content.status.replace('-', ' ')}</p>
        </div>

        ${content.duration ? `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0.5rem;">Duration</h3>
            <p style="color: var(--color-text-primary);">${content.duration}</p>
        </div>
        ` : ''}

        ${content.recordingDate ? `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0.5rem;">Recording Date</h3>
            <p style="color: var(--color-text-primary);">${new Date(content.recordingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        ` : ''}

        <button onclick="closeModal()" style="width: 100%; padding: 1rem; background: rgba(255,255,255,0.1); border: none; color: var(--color-text-primary); font-family: var(--font-display); font-weight: 700; font-size: 1rem; border-radius: 4px; cursor: pointer; margin-top: 2rem;">
            CLOSE
        </button>
    `;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('decisionModal').classList.remove('active');
}

// ============================================
// Utility Functions
// ============================================

function scrollToDecisions() {
    document.getElementById('decisions').scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    const alertBanner = document.getElementById('criticalAlert');
    alertBanner.querySelector('.alert-text strong').textContent = message;
    alertBanner.style.background = 'var(--color-accent-red)';
}

function animateCardEntrance() {
    const cards = document.querySelectorAll('.stat-card, .decision-card, .partner-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
