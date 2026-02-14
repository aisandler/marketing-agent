// Context: right panel tab management + all tab renderers
// Tabs: Live (session X-ray) | Context (system overview) | Learned (feedback loop)

import Store from './store.js';
import { fmtDuration } from './chat.js';
import { switchWorkspace } from './keyboard.js';
import { pickAgent } from './sidebar.js';

// --- State ---
let rpActiveTab = 'context'; // default when no session running
let userPinned = false;

// --- Cached data ---
let _ledgerInsights = null;
let _queueItems = null;
let _feedbackData = null;

// --- Context file grouping ---
const FILE_GROUPS = [
  { name: 'Brand & Config', icon: '\u2699', keys: ['1', '2', '4', '5', '6'] },
  { name: 'Content', icon: '\u270E', keys: ['3', '7', '8'] },
  { name: 'Intelligence', icon: '\u26A1', keys: ['9'] },
];

// --- Tab switching ---

export function setupRightPanel() {
  const bar = document.getElementById('rpTabBar');
  if (!bar) return;
  bar.addEventListener('click', e => {
    const btn = e.target.closest('.rp-tab');
    if (!btn) return;
    const tab = btn.dataset.tab;
    if (tab) {
      userPinned = true;
      doSwitchTab(tab);
    }
  });
  doSwitchTab(rpActiveTab);
}

function doSwitchTab(tab) {
  rpActiveTab = tab;
  document.querySelectorAll('.rp-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
  document.querySelectorAll('.rp-tab-content').forEach(el => {
    const elTab = el.id.replace('rpTab', '').toLowerCase();
    el.classList.toggle('active', elTab === tab);
  });
  if (tab === 'live') renderLiveTab();
  else if (tab === 'context') renderContextTab();
  else if (tab === 'learned') renderLearnedTab();
}

export function switchRpTab(tab) {
  userPinned = true;
  doSwitchTab(tab);
}

export function onSessionStart() {
  if (!userPinned) doSwitchTab('live');
}

export function onSessionComplete() {
  if (!userPinned) doSwitchTab('context');
  userPinned = false;
}

// --- Data entry point ---

export function renderCtx(intel) {
  if (!intel) return;
  Store.set('intel', intel);
  fetchHealthData();
  doSwitchTab(rpActiveTab);
}

// =============================================
// LIVE TAB — Session X-ray + Vitals
// =============================================

function renderLiveTab() {
  const el = document.getElementById('rpTabLive');
  if (!el) return;

  const activeId = Store.get('activeSessionId');
  if (!activeId) {
    el.innerHTML =
      '<div class="flex flex-col items-center justify-center py-12 text-center">' +
        '<div class="text-gray-600 text-xs mb-2">No active session</div>' +
        '<button class="text-[10px] text-accent hover:underline cursor-pointer bg-transparent border-0" onclick="window.CC.switchRpTab(\'context\')">View system context</button>' +
      '</div>';
    return;
  }

  const s = Store.get('sessions').get(activeId);
  if (!s) { el.innerHTML = ''; return; }

  const color = s.agent?.color || '#7B61FF';
  const statusDot = s.status === 'running' ? 'bg-emerald-400' : s.status === 'starting' ? 'bg-amber-400' : 'bg-gray-500';
  const dur = fmtDuration(Date.now() - s.startedAt);

  let h = '';

  // Agent banner
  h += '<div class="glass-panel rounded-xl p-3 flex items-center gap-2.5">' +
    '<div class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style="background:' + color + '">' +
      (s.agent?.shortTag || s.agent?.name?.charAt(0)?.toUpperCase() || '?') +
    '</div>' +
    '<div class="flex-1 min-w-0">' +
      '<div class="text-xs text-gray-200 font-medium truncate">' + (s.agent?.displayName || s.agent?.name || 'Agent') + '</div>' +
    '</div>' +
    '<span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ' + statusDot + '"></span>' +
    '<span class="text-[10px] text-gray-400 font-mono flex-shrink-0">$' + s.cost.toFixed(4) + '</span>' +
  '</div>';

  // Active tool
  const toolInfo = Store.get('toolProgress')?.get(activeId);
  if (toolInfo) {
    h += '<div class="glass-panel rounded-xl p-3 flex items-center gap-2">' +
      '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" style="animation:pulse 1s infinite"></span>' +
      '<span class="text-xs text-gray-300 font-medium truncate">' + toolInfo.toolName + '</span>' +
      '<span class="text-[10px] text-gray-500 ml-auto flex-shrink-0">' + toolInfo.elapsed.toFixed(0) + 's</span>' +
    '</div>';
  }

  // Files touched
  const fileMap = Store.get('_filesTouched');
  const files = fileMap?.get(activeId);
  if (files && (files.read.size > 0 || files.modified.size > 0)) {
    h += '<div class="glass-panel rounded-xl p-3">';
    if (files.modified.size > 0) {
      h += '<div class="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Modified (' + files.modified.size + ')</div>';
      for (const f of [...files.modified].slice(-8)) {
        h += '<div class="text-[11px] text-gray-400 truncate py-0.5" title="' + f + '">' + f.split('/').pop() + '</div>';
      }
    }
    if (files.read.size > 0) {
      h += '<div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ' + (files.modified.size > 0 ? 'mt-2' : '') + '">Read (' + files.read.size + ')</div>';
      const readArr = [...files.read].slice(-7);
      const overflow = files.read.size - readArr.length;
      for (const f of readArr) {
        h += '<div class="text-[11px] text-gray-500 truncate py-0.5" title="' + f + '">' + f.split('/').pop() + '</div>';
      }
      if (overflow > 0) h += '<div class="text-[10px] text-gray-600 py-0.5">+' + overflow + ' more</div>';
    }
    h += '</div>';
  }

  // Expandable full activity
  const histMap = Store.get('_toolHistory');
  const allTools = histMap?.get(activeId) || [];
  if (allTools.length > 0) {
    h += '<details class="glass-panel rounded-xl overflow-hidden">' +
      '<summary class="px-3 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 cursor-pointer hover:bg-white/[0.03] transition-colors">Full Activity (' + allTools.length + ' tools)</summary>' +
      '<div class="border-t border-white/5 max-h-48 overflow-y-auto">';
    for (const t of allTools.slice(-30).reverse()) {
      h += '<div class="flex items-center gap-2 px-3 py-1 border-b border-white/5 last:border-b-0">' +
        '<span class="text-[10px] text-gray-500 font-mono w-12 flex-shrink-0">' + t.toolName + '</span>' +
        '<span class="text-[10px] text-gray-600 truncate">' + (t.summary || '') + '</span>' +
      '</div>';
    }
    h += '</div></details>';
  }

  // Vitals grid
  h += '<div class="glass-panel rounded-xl p-3">' +
    '<div class="flex items-center gap-2 mb-2.5">' +
      '<span class="w-1.5 h-1.5 rounded-full ' + statusDot + '"></span>' +
      '<span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Vitals</span>' +
    '</div>' +
    '<div class="grid grid-cols-2 gap-2">' +
      vitalTile('Cost', '$' + s.cost.toFixed(4)) +
      vitalTile('Turns', s.turns) +
      vitalTile('Duration', dur) +
      vitalTile('Messages', s.messages.length) +
    '</div>' +
  '</div>';

  el.innerHTML = h;
}

function vitalTile(label, value) {
  return '<div class="rp-vital glass-panel rounded-lg p-2.5 text-center">' +
    '<div class="text-[10px] text-gray-500 mb-0.5">' + label + '</div>' +
    '<div class="text-xs font-bold text-gray-200">' + value + '</div>' +
  '</div>';
}

// =============================================
// CONTEXT TAB — System components + actions
// =============================================

// Marketing action suggestions
const MARKETING_ACTIONS = [
  { label: 'See what competitors are up to', desc: 'Check competitor activity and new campaigns', agent: 'analyst', prompt: 'Do a competitive scan \u2014 what have our competitors been doing recently? Any new campaigns, messaging changes, or positioning shifts?', category: 'competitive' },
  { label: 'Find competitor content gaps', desc: 'Identify topics competitors aren\'t covering', agent: 'analyst', prompt: 'Analyze our competitors\' content and identify gaps \u2014 what topics or angles are they missing that we could own?', category: 'competitive' },
  { label: 'Analyze your top-performing posts', desc: 'See what content resonated most recently', agent: 'analyst', prompt: 'Analyze our top-performing social media posts from the last month. What patterns do you see in the content that performed best?', category: 'performance' },
  { label: 'Review content performance trends', desc: 'Spot what\'s working and what\'s declining', agent: 'analyst', prompt: 'Review our content performance trends. What types of content are trending up vs declining? Any engagement pattern shifts?', category: 'performance' },
  { label: 'Audit email campaign metrics', desc: 'Check open rates, clicks, and engagement', agent: 'analyst', prompt: 'Audit our email marketing performance \u2014 open rates, click-through rates, and engagement trends. What should we optimize?', category: 'performance' },
  { label: 'Plan next month\'s content', desc: 'Build a content calendar for the coming month', agent: 'cmo', prompt: 'Help me plan next month\'s content calendar. Consider seasonal themes, upcoming events, and our content pillars.', category: 'planning' },
  { label: 'Brainstorm fresh content ideas', desc: 'Generate new content angles and topics', agent: 'cmo', prompt: 'I need fresh content ideas. Brainstorm new angles and topics based on our brand pillars, recent trends, and what\'s resonating with our audience.', category: 'planning' },
  { label: 'Plan a seasonal campaign', desc: 'Build a campaign around an upcoming season or event', agent: 'cmo', prompt: 'Help me plan a seasonal marketing campaign. What upcoming holidays, events, or seasonal themes should we capitalize on?', category: 'planning' },
  { label: 'Check keyword opportunities', desc: 'Find new keywords to target', agent: 'analyst', prompt: 'Research keyword opportunities \u2014 are there high-potential keywords we\'re not targeting yet? What search trends should we be aware of?', category: 'seo' },
  { label: 'Review brand positioning', desc: 'Assess how your brand stands in the market', agent: 'cmo', prompt: 'Review our current brand positioning. How are we differentiated from competitors? Is our messaging still resonating with our target audience?', category: 'strategy' },
  { label: 'Identify growth opportunities', desc: 'Find untapped channels or audience segments', agent: 'cmo', prompt: 'Analyze our current marketing mix and identify growth opportunities \u2014 untapped channels, underserved audience segments, or new market potential.', category: 'strategy' },
  { label: 'Collect social intelligence', desc: 'Gather fresh competitor and industry insights', agent: 'cmo', prompt: 'Run social intelligence collection \u2014 gather the latest competitor posts, industry conversations, and trending topics relevant to our brand.', category: 'intel' },
];

function buildMarketingSuggestions(ledger) {
  const now = new Date();
  const day = now.getDate();
  const dow = now.getDay();
  const scored = [];
  const recency = {};
  if (ledger?.agentRecency) {
    for (const ar of ledger.agentRecency) recency[ar.agent.toLowerCase()] = ar.daysAgo;
  }
  for (const action of MARKETING_ACTIONS) {
    let score = 0;
    if (action.category === 'planning' && day >= 20) score += 3;
    if (action.category === 'performance' && day <= 7) score += 3;
    if (action.category === 'competitive' && dow === 1) score += 2;
    if (action.category === 'competitive' || action.category === 'intel') {
      const d = recency['intel'] ?? recency['analyst'];
      if (d === null || d === undefined) score += 2;
      else if (d > 7) score += 2;
    }
    if (action.category === 'performance') {
      const d = recency['analyst'];
      if (d === null || d === undefined) score += 2;
      else if (d > 7) score += 2;
    }
    if (action.category === 'planning') {
      const d = recency['cmo'];
      if (d === null || d === undefined) score += 1;
      else if (d > 7) score += 2;
    }
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    score += ((dayOfYear * 7 + MARKETING_ACTIONS.indexOf(action) * 13) % 10) * 0.1;
    scored.push({ ...action, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function renderContextTab() {
  const el = document.getElementById('rpTabContext');
  if (!el) return;

  const intel = Store.get('intel');
  const healthData = Store.get('contextHealth');
  let h = '';

  // Compact health score bar
  const score = healthData?.score || 0;
  const hColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const hLabel = score >= 70 ? 'Healthy' : score >= 40 ? 'Needs Work' : 'Setup Needed';
  h += '<div class="glass-panel rounded-xl p-3">' +
    '<div class="flex items-center justify-between mb-2">' +
      '<span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">System Health</span>' +
      '<span class="text-xs font-bold" style="color:' + hColor + '">' + Math.round(score) + '/100 \u2014 ' + hLabel + '</span>' +
    '</div>' +
    '<div class="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">' +
      '<div class="h-full rounded-full transition-all duration-700" style="width:' + Math.round(score) + '%;background:' + hColor + '"></div>' +
    '</div>' +
  '</div>';

  // Context files (clickable to navigate to file browser)
  const files = intel?.contextFiles || [];
  if (files.length > 0) {
    const fileMap = new Map(files.map(f => [f.key, f]));
    for (const group of FILE_GROUPS) {
      const gf = group.keys.map(k => fileMap.get(k)).filter(Boolean);
      const ok = gf.filter(f => f.exists).length;
      const total = gf.length;
      const allOk = ok === total;
      h += '<details class="glass-panel rounded-xl overflow-hidden"' + (allOk ? '' : ' open') + '>' +
        '<summary class="px-3 py-2.5 flex items-center justify-between text-xs text-gray-300 font-medium hover:bg-white/[0.03] transition-colors cursor-pointer">' +
          '<span>' + group.icon + ' ' + group.name + '</span>' +
          '<span class="text-[10px] font-bold ' + (allOk ? 'text-emerald-400' : 'text-amber-400') + '">' + ok + '/' + total + '</span>' +
        '</summary><div class="border-t border-white/5">';
      for (const f of gf) {
        const clickable = f.exists ? ' cursor-pointer hover:bg-white/[0.03]' : '';
        const onclick = f.exists ? ' onclick="window.CC.openContextFile(\'' + encodeURIComponent(f.path) + '\')"' : '';
        h += '<div class="flex items-center justify-between py-1.5 px-3 transition-colors' + clickable + '"' + onclick + '>' +
          '<span class="text-[11px] ' + (f.exists ? 'text-gray-400' : 'text-gray-600') + ' truncate mr-2">' + f.label + '</span>' +
          '<span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ' + (f.exists ? 'yes' : 'no') + '">' + (f.exists ? 'OK' : 'Missing') + '</span>' +
        '</div>';
      }
      h += '</div></details>';
    }
  }

  // Intel freshness
  const items = intel?.intel?.items || [];
  if (items.length > 0) {
    const bc = (status) => ({ fresh: 'border-l-emerald-400', stale: 'border-l-amber-400', old: 'border-l-red-400' }[status] || 'border-l-gray-600');
    h += '<div class="glass-panel rounded-xl overflow-hidden">' +
      '<div class="px-3 py-2 border-b border-white/5"><span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Intel Streams</span></div>';
    for (const i of items) {
      h += '<div class="flex items-center justify-between py-2 px-3 border-l-2 ' + bc(i.status) + ' border-b border-white/5 last:border-b-0">' +
        '<span class="text-xs text-gray-400">' + i.label + '</span>' +
        '<span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + i.status + '">' + i.displayLabel + '</span>' +
      '</div>';
    }
    h += '</div>';
  }

  // Marketing action suggestions
  const suggestions = buildMarketingSuggestions(_ledgerInsights);
  if (suggestions.length > 0) {
    h += '<div class="flex flex-col gap-2">' +
      '<div class="px-1"><span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Suggested Actions</span></div>';
    for (const s of suggestions.slice(0, 3)) {
      h += '<button class="glass-panel rounded-xl p-3 text-left cursor-pointer hover:bg-white/5 transition-colors border-0 w-full group" onclick="window.CC.contextFix(\'' +
        encodeURIComponent(s.prompt) + '\',\'' + s.agent + '\')">' +
        '<div class="flex items-center justify-between">' +
          '<span class="text-xs text-gray-300 font-medium">' + s.label + '</span>' +
          '<span class="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity font-bold">Go</span>' +
        '</div>' +
        '<div class="text-[10px] text-gray-500 mt-0.5">' + s.desc + '</div>' +
      '</button>';
    }
    h += '</div>';
  }

  // Task queue
  h += '<div class="flex flex-col gap-1.5">' +
    '<div class="px-1"><span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Tasks</span></div>' +
    '<div class="glass-panel rounded-xl p-3">' +
    '<div class="flex gap-1.5 mb-2">' +
      '<input id="rpQueueInput" class="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-accent/50 transition-colors" placeholder="Add a task..." />' +
      '<button class="px-2 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent text-xs font-bold cursor-pointer hover:bg-accent/20 transition-colors" onclick="window.CC.addQueueItem()">+</button>' +
    '</div>';

  const qItems = _queueItems || [];
  for (const item of qItems.filter(i => !i.done)) h += queueItemRow(item);
  for (const item of qItems.filter(i => i.done)) h += queueItemRow(item);
  if (qItems.length === 0) h += '<div class="text-[10px] text-gray-600 text-center py-2">No tasks yet</div>';
  h += '</div></div>';

  // Refresh
  h += '<div class="flex items-center justify-end mt-1 px-1">' +
    '<button class="text-[10px] text-accent hover:underline cursor-pointer bg-transparent border-0" onclick="window.CC.refreshStatus()">Refresh</button>' +
  '</div>';

  el.innerHTML = h;

  const inp = document.getElementById('rpQueueInput');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addQueueItem(); } });
}

function queueItemRow(item) {
  const doneClass = item.done ? 'line-through text-gray-600' : 'text-gray-300';
  return '<div class="flex items-center gap-2 py-1 group">' +
    '<input type="checkbox" ' + (item.done ? 'checked' : '') + ' class="cursor-pointer accent-accent flex-shrink-0" onchange="window.CC.toggleQueueItem(\'' + item.id + '\', this.checked)" />' +
    '<span class="text-[11px] flex-1 ' + doneClass + '">' + item.text + '</span>' +
    '<button class="text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all cursor-pointer bg-transparent border-0 text-xs flex-shrink-0" onclick="window.CC.deleteQueueItem(\'' + item.id + '\')">&times;</button>' +
  '</div>';
}

// Queue CRUD
export async function addQueueItem() {
  const inp = document.getElementById('rpQueueInput');
  if (!inp || !inp.value.trim()) return;
  const text = inp.value.trim();
  inp.value = '';
  try {
    const res = await fetch('/api/panel-queue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    const item = await res.json();
    if (!_queueItems) _queueItems = [];
    _queueItems.push(item);
    renderContextTab();
  } catch {}
}

export async function toggleQueueItem(id, done) {
  try {
    await fetch('/api/panel-queue/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done }) });
    const item = (_queueItems || []).find(i => i.id === id);
    if (item) item.done = done;
    renderContextTab();
  } catch {}
}

export async function deleteQueueItem(id) {
  try {
    await fetch('/api/panel-queue/' + id, { method: 'DELETE' });
    _queueItems = (_queueItems || []).filter(i => i.id !== id);
    renderContextTab();
  } catch {}
}

// =============================================
// LEARNED TAB — The Feedback Loop
// =============================================

async function fetchFeedbackData() {
  try {
    _feedbackData = await fetch('/api/intel/feedback-loop').then(r => r.json()).catch(() => null);
    if (rpActiveTab === 'learned') renderLearnedTab();
  } catch {}
}

function renderLearnedTab() {
  const el = document.getElementById('rpTabLearned');
  if (!el) return;

  const fb = _feedbackData;
  const ledger = _ledgerInsights;
  let h = '';

  // Header with tagline
  h += '<div class="glass-panel rounded-xl p-4 text-center">' +
    '<div class="text-xs font-bold text-gray-200 mb-1">The system that learns what works.</div>' +
    '<div class="text-[10px] text-gray-500">Every session builds intelligence. Patterns surface here.</div>' +
  '</div>';

  // Check if we have any real data
  const hasPatterns = fb?.hasData;
  const hasLedgerNotes = ledger?.recommendations?.length > 0;
  const hasAnyData = hasPatterns || hasLedgerNotes;

  if (!hasAnyData) {
    // Empty state — the loop hasn't started yet
    h += '<div class="glass-panel rounded-xl p-4">' +
      '<div class="flex flex-col gap-3 text-center py-4">' +
        '<div class="text-2xl">&#x1F501;</div>' +
        '<div class="text-xs text-gray-300 font-medium">The feedback loop hasn\'t started yet</div>' +
        '<div class="text-[10px] text-gray-500 leading-relaxed">' +
          'As you run campaigns, analyze performance, and collect intelligence, this system learns. ' +
          'Patterns emerge. What works surfaces. What doesn\'t gets flagged.' +
        '</div>' +
        '<div class="flex flex-col gap-1.5 mt-2 text-left">' +
          feedbackStep('1', 'Run a campaign or analysis', 'Use /cmo or /analyst to create and execute') +
          feedbackStep('2', 'The system records what happened', 'Performance data, competitive shifts, seasonal patterns') +
          feedbackStep('3', 'Insights surface here', 'What worked, what didn\'t, what to try next') +
        '</div>' +
        '<button class="mt-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg text-accent text-xs font-bold cursor-pointer hover:bg-accent/20 transition-colors" ' +
          'onclick="window.CC.contextFix(\'' + encodeURIComponent('Run a performance analysis. Review what content and campaigns have performed best recently and identify patterns in what works for our brand.') + '\',\'analyst\')">' +
          'Start building intelligence' +
        '</button>' +
      '</div>' +
    '</div>';
  } else {
    // --- Pattern Feed ---
    if (hasPatterns && fb.patterns.length > 0) {
      h += '<div class="flex flex-col gap-1.5">' +
        '<div class="px-1"><span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">What We\'ve Learned</span></div>';

      const typeIcon = (t) => ({ pattern: '\u2728', insight: '\uD83D\uDCA1', competitive: '\u2694\uFE0F', seasonal: '\uD83D\uDCC5' }[t] || '\u2022');
      const typeBorder = (t) => ({ pattern: 'border-l-emerald-400', competitive: 'border-l-blue-400', seasonal: 'border-l-amber-400' }[t] || 'border-l-gray-500');

      for (const p of fb.patterns.slice(0, 8)) {
        h += '<div class="glass-panel rounded-xl p-2.5 border-l-2 ' + typeBorder(p.type) + '">' +
          '<div class="text-[11px] text-gray-300 leading-relaxed">' + p.text + '</div>' +
          '<div class="text-[10px] text-gray-600 mt-1">' + p.source + (p.date ? ' \u00B7 ' + p.date : '') + '</div>' +
        '</div>';
      }
      h += '</div>';
    }

    // --- Scoreboard: intelligence sources ---
    if (fb?.sources) {
      h += '<div class="glass-panel rounded-xl overflow-hidden">' +
        '<div class="px-3 py-2 border-b border-white/5"><span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Intelligence Sources</span></div>';
      for (const src of fb.sources) {
        const hasEntries = src.entryCount > 0;
        const dotColor = hasEntries ? 'bg-emerald-400' : 'bg-gray-600';
        h += '<div class="flex items-center justify-between py-2 px-3 border-b border-white/5 last:border-b-0">' +
          '<div class="flex items-center gap-2">' +
            '<span class="w-1.5 h-1.5 rounded-full ' + dotColor + ' flex-shrink-0"></span>' +
            '<span class="text-xs text-gray-400">' + src.name + '</span>' +
          '</div>' +
          '<div class="flex items-center gap-2">' +
            '<span class="text-[10px] text-gray-500">' + src.entryCount + ' entries</span>' +
            '<span class="text-[10px] text-gray-600">' + src.updated + '</span>' +
          '</div>' +
        '</div>';
      }
      h += '</div>';
    }

    // --- Agent Notes (recommendations from ledger) ---
    if (hasLedgerNotes) {
      h += '<div class="flex flex-col gap-1.5">' +
        '<div class="px-1"><span class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">Agent Recommendations</span></div>';
      for (const r of ledger.recommendations.slice(0, 5)) {
        h += '<div class="glass-panel rounded-xl p-2.5">' +
          '<div class="text-[11px] text-gray-400">' + r.text + '</div>' +
          '<div class="text-[10px] text-gray-600 mt-0.5">' + r.agent + ' \u00B7 ' + r.date + '</div>' +
        '</div>';
      }
      h += '</div>';
    }
  }

  // Refresh insights button (always visible)
  h += '<div class="flex items-center justify-between mt-2 px-1">' +
    '<span class="text-[10px] text-gray-600" id="rpLearnedRefresh"></span>' +
    '<button class="text-[10px] text-accent hover:underline cursor-pointer bg-transparent border-0" onclick="window.CC.refreshLearned()">Refresh Insights</button>' +
  '</div>';

  el.innerHTML = h;
}

function feedbackStep(num, title, desc) {
  return '<div class="flex items-start gap-2.5">' +
    '<span class="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0">' + num + '</span>' +
    '<div><div class="text-[11px] text-gray-300 font-medium">' + title + '</div>' +
    '<div class="text-[10px] text-gray-500">' + desc + '</div></div>' +
  '</div>';
}

export async function refreshLearned() {
  const ts = document.getElementById('rpLearnedRefresh');
  if (ts) ts.textContent = 'Refreshing...';
  await fetchFeedbackData();
  if (ts) ts.textContent = 'Refreshed just now';
}

// =============================================
// SHARED UTILITIES
// =============================================

// Data fetchers
async function fetchNextData() {
  try {
    const [ledger, queue] = await Promise.all([
      fetch('/api/intel/ledger-insights').then(r => r.json()).catch(() => null),
      fetch('/api/panel-queue').then(r => r.json()).catch(() => ({ items: [] })),
    ]);
    _ledgerInsights = ledger;
    _queueItems = queue.items || [];
    if (rpActiveTab === 'context') renderContextTab();
  } catch {}
}

async function fetchHealthData() {
  try {
    const res = await fetch('/api/context/health');
    const data = await res.json();
    Store.set('contextHealth', data);
  } catch {}
}

export async function refreshStatus() {
  try {
    const [intelRes, healthRes] = await Promise.all([
      fetch('/api/intel').then(r => r.json()),
      fetch('/api/context/health').then(r => r.json()),
    ]);
    Store.set('intel', intelRes);
    Store.set('contextHealth', healthRes);
    renderContextTab();
  } catch {}
}

export function updStats() {
  if (rpActiveTab === 'live') renderLiveTab();
}

// Open a context file in the file browser workspace
export function openContextFile(encodedPath) {
  const path = decodeURIComponent(encodedPath);
  switchWorkspace('files');
  // Try to open the file if the file browser exposes it
  if (window.CC.openFile) {
    setTimeout(() => window.CC.openFile(path), 200);
  }
}

// Tool activity tracking
export function trackToolUse(sessionId, toolName, input) {
  let fileMap = Store.get('_filesTouched');
  if (!fileMap) { fileMap = new Map(); Store.set('_filesTouched', fileMap); }
  if (!fileMap.has(sessionId)) fileMap.set(sessionId, { read: new Set(), modified: new Set() });
  const files = fileMap.get(sessionId);
  const path = input?.file_path || input?.path || '';
  if (path) {
    if (toolName === 'Write' || toolName === 'Edit') files.modified.add(path);
    else if (toolName === 'Read') files.read.add(path);
  }
  let histMap = Store.get('_toolHistory');
  if (!histMap) { histMap = new Map(); Store.set('_toolHistory', histMap); }
  if (!histMap.has(sessionId)) histMap.set(sessionId, []);
  histMap.get(sessionId).push({ toolName, summary: toolSummaryCompact(toolName, input), ts: Date.now() });
  if (rpActiveTab === 'live') renderLiveTab();
}

function toolSummaryCompact(name, input) {
  const p = input || {};
  if (name === 'Read' || name === 'Write' || name === 'Edit') return (p.file_path || '').split('/').pop() || '';
  if (name === 'Bash') return (p.command || '').slice(0, 50);
  if (name === 'Grep') return (p.pattern || '').slice(0, 40);
  if (name === 'Glob') return (p.pattern || '').slice(0, 40);
  if (name === 'Task') return p.description || '';
  return '';
}

// Init helpers
export function initNextData() {
  fetchNextData();
  fetchFeedbackData();
}

// Context fix action (launch an agent with a prompt)
export function contextFix(encodedPrompt, agentName) {
  const prompt = decodeURIComponent(encodedPrompt);
  switchWorkspace('operations');
  const inp = document.getElementById('inputText');
  if (inp) { inp.value = prompt; inp.focus(); }
  pickAgent(agentName || 'cmo');
}

// =============================================
// CONTEXT DASHBOARD WORKSPACE (separate from right panel)
// =============================================

export async function renderContextDashboard() {
  const container = document.getElementById('contextDashboard');
  if (!container) return;
  container.innerHTML = '<div class="text-sm text-gray-500 p-8">Loading context health...</div>';
  try {
    const res = await fetch('/api/context/health');
    const data = await res.json();
    Store.set('contextHealth', data);
    renderHealthView(container, data);
  } catch {
    const intel = Store.get('intel');
    if (intel) renderFallbackView(container, intel);
    else container.innerHTML = '<div class="text-sm text-gray-500 p-8">Unable to load context health.</div>';
  }
}

function renderHealthView(container, data) {
  const score = data.score || 0;
  const circ = 2 * Math.PI * 54;
  const offset = circ - (score / 100) * circ;
  const sc = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  let h = '<div class="flex flex-col items-center py-6">' +
    '<svg viewBox="0 0 120 120" width="140" height="140">' +
      '<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>' +
      '<circle cx="60" cy="60" r="54" fill="none" stroke="' + sc + '" stroke-width="6" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '" stroke-linecap="round" transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 1s ease"/>' +
      '<text x="60" y="55" text-anchor="middle" fill="#f5f5f7" font-size="28" font-weight="700" font-family="Inter, sans-serif">' + Math.round(score) + '</text>' +
      '<text x="60" y="72" text-anchor="middle" fill="#71717a" font-size="10" font-weight="500">HEALTH</text>' +
    '</svg>' +
    '<div class="mt-2 text-sm font-medium ' + (score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400') + '">' + (score >= 70 ? 'Healthy' : score >= 40 ? 'Needs Attention' : 'Setup Required') + '</div></div>';
  h += '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Configuration</h3><div class="grid grid-cols-2 gap-2">';
  for (const item of (data.items || [])) {
    const cls = item.status === 'ok' ? 'ok' : item.status === 'stale' ? 'stale' : 'missing';
    const click = item.status !== 'ok' && item.fixAction ? ' onclick="window.CC.contextFix(\'' + encodeURIComponent(item.fixAction) + '\',\'' + (item.fixAgent || 'cmo') + '\')" style="cursor:pointer"' : '';
    h += '<div class="glass-panel rounded-lg p-3"' + click + '><div class="text-xs text-gray-300 mb-1">' + item.label + '</div>' +
      '<span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + cls + '">' + (item.status === 'ok' ? 'OK' : item.status === 'stale' ? (item.daysAgo || '?') + 'd ago' : 'Missing') + '</span>' +
      (item.status !== 'ok' ? '<div class="text-[10px] text-accent mt-1">Click to fix</div>' : '') + '</div>';
  }
  h += '</div></div>';
  if (data.actions?.length > 0) {
    h += '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Recommended Actions</h3><div class="flex flex-col gap-2">';
    for (const a of data.actions) {
      h += '<button class="glass-panel rounded-lg p-3 text-left cursor-pointer hover:bg-white/5 transition-colors border-0 w-full" onclick="window.CC.contextFix(\'' + encodeURIComponent(a.prompt) + '\',\'' + a.agentName + '\')">' +
        '<div class="text-xs text-gray-300 font-medium">' + a.label + '</div><div class="text-[10px] text-gray-500 mt-0.5">' + a.description + '</div></button>';
    }
    h += '</div></div>';
  }
  container.innerHTML = h;
}

function renderFallbackView(container, intel) {
  let h = '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Brand Status</h3>' +
    '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">Onboarded</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + (intel.isOnboarded ? 'yes' : 'no') + '">' + (intel.isOnboarded ? 'Yes' : 'No') + '</span></div></div>';
  h += '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Intel Freshness</h3>';
  for (const i of (intel.intel?.items || [])) h += '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">' + i.label + '</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + i.status + '">' + i.displayLabel + '</span></div>';
  h += '</div><div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Context Files</h3>';
  for (const f of (intel.contextFiles || [])) h += '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">' + f.label + '</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + (f.exists ? 'yes' : 'no') + '">' + (f.exists ? 'OK' : 'Missing') + '</span></div>';
  h += '</div>';
  container.innerHTML = h;
}
