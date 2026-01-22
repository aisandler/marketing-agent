// CPL Marketing Hub - Main JavaScript
// Editorial Command Center Interactions

// ============================================
// Data Loading & State Management
// ============================================

let activeMonth = 'december';
let activeFilter = 'all';

// Embedded dashboard data (for standalone use without server)
const dashboardData = {"meta":{"lastUpdated":"2025-11-19","currentDate":"2025-11-19","criticalDeadline":"2025-11-25","danaEndDate":"2025-12-05"},"decisions":[{"id":1,"title":"Brand Architecture Revisions","description":"Approve revised positioning: removed 'boutique', renamed 'Honest' to 'Straightforward', added broker empowerment","status":"pending","deadline":"2025-11-25","approver":["Andrew","Alan"],"budgetImpact":"$0","priority":"critical","documentLink":"../deliverables/decision-points-for-approval.md#decision-1"},{"id":2,"title":"Google Search Console Investment","description":"GSC setup + technical SEO fixes to enable content measurement and optimization","status":"pending","deadline":"2025-11-25","approver":["Andrew","Alan"],"budgetImpact":"$1,000-$1,500","priority":"critical","documentLink":"../deliverables/decision-points-for-approval.md#decision-2"},{"id":3,"title":"Video Production Budget","description":"Monthly partner Zoom recordings edited by Lexi into LinkedIn clips","status":"pending","deadline":"2025-11-25","approver":["Andrew","Alan"],"budgetImpact":"$400-$950/mo","priority":"critical","documentLink":"../deliverables/decision-points-for-approval.md#decision-3"},{"id":4,"title":"Q1 2026 Content Calendar","description":"Approve Dec-Feb publishing schedule (41 posts total)","status":"pending","deadline":"2025-11-25","approver":["Andrew","Alan"],"budgetImpact":"$0","priority":"high","documentLink":"../deliverables/decision-points-for-approval.md#decision-4"},{"id":5,"title":"Partner Content Strategy","description":"Approve individual partner participation plans and content themes","status":"pending","deadline":"2025-11-25","approver":["Alex","Alan","Michael C","Michael R"],"budgetImpact":"$0","priority":"high","documentLink":"../deliverables/decision-points-for-approval.md#decision-5"},{"id":6,"title":"Monthly Recording Commitment","description":"Each partner commits to 30-min Zoom recording per month","status":"pending","deadline":"2025-11-25","approver":["Alex","Alan","Michael C","Michael R"],"budgetImpact":"$0 (time commitment)","priority":"high","documentLink":"../deliverables/decision-points-for-approval.md#decision-6"}],"timeline":[{"date":"2025-11-25","event":"DECISION DEADLINE","type":"critical","description":"All 6 decisions required to proceed"},{"date":"2025-11-27","event":"Alex Recording","type":"recording","description":"30-min Zoom: Year in Review theme"},{"date":"2025-12-03","event":"Alan Recording","type":"recording","description":"30-min Zoom: Memorable Deals theme"},{"date":"2025-12-05","event":"Dana's Last Content","type":"critical","description":"Final day of Dana's scheduled content"},{"date":"2025-12-09","event":"Partner Content Launch","type":"milestone","description":"First partner video posts go live"}],"partners":[{"id":"alex","name":"Alex Whiteaker","role":"Partner","nextRecording":"2025-11-27","recordingTheme":"Year in Review & Orchestra Metaphor","format":"video","comfort":"high","pendingApprovals":0,"publishedContent":0,"status":"not-scheduled"},{"id":"alan","name":"Alan Perlowitz","role":"Partner","nextRecording":"2025-12-03","recordingTheme":"Memorable Deals & Financial Expertise","format":"video","comfort":"high","pendingApprovals":0,"publishedContent":0,"status":"not-scheduled"},{"id":"michael-c","name":"Michael Carlos","role":"Partner","nextRecording":"TBD","recordingTheme":"CE Class Content / Broker Education","format":"video-or-ce-class","comfort":"open","pendingApprovals":0,"publishedContent":0,"status":"format-pending"},{"id":"michael-r","name":"Michael Rosenberg","role":"Partner","nextRecording":null,"recordingTheme":"Commercial Banking Insights","format":"written","comfort":"written-preferred","pendingApprovals":0,"publishedContent":0,"status":"discovery-needed"}],"calendar":{"december":[{"date":"2025-12-02","type":"firm-post","partner":null,"topic":"Reflecting on 2025: NYC Real Estate Market Lessons","platform":["LinkedIn"],"status":"scheduled","format":"text"},{"date":"2025-12-04","type":"firm-post","partner":null,"topic":"Broker Appreciation - Thank You 2025","platform":["LinkedIn"],"status":"scheduled","format":"text"},{"date":"2025-12-09","type":"video","partner":"Alex Whiteaker","topic":"The Orchestra Approach to Commercial Real Estate","platform":["LinkedIn"],"status":"pending-recording","duration":"45s","recordingDate":"2025-11-27"},{"date":"2025-12-11","type":"video","partner":"Alex Whiteaker","topic":"Year in Review: Most Memorable Collaboration Story","platform":["LinkedIn"],"status":"pending-recording","duration":"50s","recordingDate":"2025-11-27"},{"date":"2025-12-13","type":"firm-post","partner":null,"topic":"5 Transaction Pitfalls from 2025 (Carousel)","platform":["LinkedIn"],"status":"scheduled","format":"carousel"},{"date":"2025-12-15","type":"video","partner":"Alex Whiteaker","topic":"Navigating Year-End Urgency with Grace","platform":["LinkedIn"],"status":"pending-recording","duration":"40s","recordingDate":"2025-11-27"},{"date":"2025-12-17","type":"video","partner":"Alan Perlowitz","topic":"Most Memorable Deal of 2025","platform":["LinkedIn"],"status":"pending-recording","duration":"55s","recordingDate":"2025-12-03"},{"date":"2025-12-19","type":"blog","partner":"Alex Whiteaker","topic":"The Orchestra Approach to NYC Real Estate (Full Post)","platform":["Blog","Newsletter"],"status":"pending-recording","format":"blog-post"},{"date":"2025-12-22","type":"video","partner":"Alan Perlowitz","topic":"Year-End Tax Considerations for Commercial Clients","platform":["LinkedIn"],"status":"pending-recording","duration":"45s","recordingDate":"2025-12-03"},{"date":"2025-12-26","type":"firm-post","partner":null,"topic":"Happy Holidays from CPL Law Firm","platform":["LinkedIn"],"status":"scheduled","format":"image"},{"date":"2025-12-30","type":"video","partner":"Alan Perlowitz","topic":"Estate Planning Integration Example","platform":["LinkedIn"],"status":"pending-recording","duration":"50s","recordingDate":"2025-12-03"}],"january":[{"date":"2026-01-02","type":"firm-post","partner":null,"topic":"2026 Predictions: NYC Real Estate Outlook","platform":["LinkedIn"],"status":"planned","format":"text"},{"date":"2026-01-06","type":"blog","partner":"Alan Perlowitz","topic":"Financial Expertise in Commercial Real Estate","platform":["Blog","Newsletter"],"status":"planned","format":"blog-post"},{"date":"2026-01-08","type":"firm-post","partner":null,"topic":"New NYC Mayor Impact on Real Estate 2026","platform":["LinkedIn"],"status":"planned","format":"text"},{"date":"2026-01-10","type":"video","partner":"Alex Whiteaker","topic":"Q1 Commercial Market Outlook","platform":["LinkedIn"],"status":"planned","duration":"45s","recordingDate":"2026-01-06"},{"date":"2026-01-13","type":"video","partner":"Alex Whiteaker","topic":"Financial Expertise in Action: Recent Example","platform":["LinkedIn"],"status":"planned","duration":"50s","recordingDate":"2026-01-06"},{"date":"2026-01-15","type":"firm-post","partner":null,"topic":"Goal Setting for NYC Brokers in 2026","platform":["LinkedIn"],"status":"planned","format":"carousel"}],"february":[{"date":"2026-02-03","type":"video","partner":"Michael Carlos","topic":"Transaction Tips for Spring Market","platform":["LinkedIn"],"status":"planned","duration":"40s","recordingDate":"2026-01-20"},{"date":"2026-02-05","type":"firm-post","partner":null,"topic":"Black History Month: Diversity in NYC Real Estate","platform":["LinkedIn"],"status":"planned","format":"text"},{"date":"2026-02-10","type":"video","partner":"Alex Whiteaker","topic":"Complex Deal from Challenging Circumstances","platform":["LinkedIn"],"status":"planned","duration":"55s","recordingDate":"2026-02-03"},{"date":"2026-02-12","type":"firm-post","partner":null,"topic":"Valentine's Day: Love Letter to Our Broker Partners","platform":["LinkedIn"],"status":"planned","format":"text"}]},"stats":{"totalPosts":41,"partnerVideos":28,"firmPosts":12,"blogPosts":3,"newsletters":3,"approved":0,"pending":41,"recording":0,"published":0}};

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
                    ${getContentIcon(dayContent.type)} ${dayContent.partner || 'CPL'}
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
