// Context dashboard workspace + right panel context rendering

import Store from './store.js';
import { fmtDuration } from './chat.js';
import { switchWorkspace } from './keyboard.js';
import { pickAgent } from './sidebar.js';

// --- Right panel context rendering (always visible) ---

export function renderCtx(intel) {
  if (!intel) return;
  Store.set('intel', intel);

  // Fetch health score for fuel gauge
  fetchHealthGauge();

  const ob = document.getElementById('ctxOnboarded');
  if (ob) {
    ob.textContent = intel.isOnboarded ? 'Yes' : 'No';
    ob.className = 'ctx-badge text-[10px] font-bold px-2 py-0.5 rounded inline-block ' + (intel.isOnboarded ? 'yes' : 'no');
  }

  const ie = document.getElementById('ctxIntel');
  if (ie) {
    ie.innerHTML = (intel.intel?.items || []).map(i =>
      '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">' + i.label +
      '</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + i.status + '">' + i.displayLabel + '</span></div>'
    ).join('') +
      (intel.intel?.ledgerCount !== undefined
        ? '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">Ledger Entries</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded fresh">' + intel.intel.ledgerCount + '</span></div>'
        : '');
  }

  const cf = document.getElementById('ctxFiles');
  if (cf) {
    cf.innerHTML = (intel.contextFiles || []).map(f =>
      '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">' + f.label +
      '</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + (f.exists ? 'yes' : 'no') + '">' + (f.exists ? 'OK' : 'Missing') + '</span></div>'
    ).join('');
  }
}

export function updStats() {
  const el = document.getElementById('ctxStats');
  if (!el) return;
  const activeId = Store.get('activeSessionId');
  if (!activeId) {
    el.innerHTML = '<div class="text-xs text-gray-600 py-1">No active session</div>';
    return;
  }
  const s = Store.get('sessions').get(activeId);
  if (!s) return;
  const dur = fmtDuration(Date.now() - s.startedAt);
  el.innerHTML =
    '<div class="flex items-center justify-between py-1"><span class="text-xs text-gray-500">Status</span><span class="text-xs text-gray-300 font-medium">' + s.status + '</span></div>' +
    '<div class="flex items-center justify-between py-1"><span class="text-xs text-gray-500">Cost</span><span class="text-xs text-gray-300 font-medium">$' + s.cost.toFixed(4) + '</span></div>' +
    '<div class="flex items-center justify-between py-1"><span class="text-xs text-gray-500">Turns</span><span class="text-xs text-gray-300 font-medium">' + s.turns + '</span></div>' +
    '<div class="flex items-center justify-between py-1"><span class="text-xs text-gray-500">Duration</span><span class="text-xs text-gray-300 font-medium">' + dur + '</span></div>' +
    '<div class="flex items-center justify-between py-1"><span class="text-xs text-gray-500">Messages</span><span class="text-xs text-gray-300 font-medium">' + s.messages.length + '</span></div>';
}

// --- Context Dashboard workspace ---

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
    if (intel) {
      renderFallbackView(container, intel);
    } else {
      container.innerHTML = '<div class="text-sm text-gray-500 p-8">Unable to load context health. Start the server and try again.</div>';
    }
  }
}

function renderHealthView(container, data) {
  const score = data.score || 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  let h = '';

  // Health score hero
  h += '<div class="flex flex-col items-center py-6">' +
    '<svg viewBox="0 0 120 120" width="140" height="140">' +
      '<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>' +
      '<circle cx="60" cy="60" r="54" fill="none" stroke="' + scoreColor + '" stroke-width="6" ' +
        'stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" ' +
        'stroke-linecap="round" transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 1s ease"/>' +
      '<text x="60" y="55" text-anchor="middle" fill="#f5f5f7" font-size="28" font-weight="700" font-family="Inter, sans-serif">' + Math.round(score) + '</text>' +
      '<text x="60" y="72" text-anchor="middle" fill="#71717a" font-size="10" font-weight="500">HEALTH</text>' +
    '</svg>' +
    '<div class="mt-2 text-sm font-medium ' + (score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400') + '">' +
      (score >= 70 ? 'Healthy' : score >= 40 ? 'Needs Attention' : 'Setup Required') +
    '</div>' +
  '</div>';

  // Configuration grid
  h += '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Configuration</h3><div class="grid grid-cols-2 gap-2">';
  for (const item of (data.items || [])) {
    const statusClass = item.status === 'ok' ? 'ok' : item.status === 'stale' ? 'stale' : 'missing';
    const clickAttr = item.status !== 'ok' && item.fixAction
      ? ' onclick="window.CC.contextFix(\'' + encodeURIComponent(item.fixAction) + '\',\'' + (item.fixAgent || 'cmo') + '\')" style="cursor:pointer"'
      : '';
    h += '<div class="glass-panel rounded-lg p-3' + '"' + clickAttr + '>' +
      '<div class="text-xs text-gray-300 mb-1">' + item.label + '</div>' +
      '<span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + statusClass + '">' +
        (item.status === 'ok' ? 'OK' : item.status === 'stale' ? (item.daysAgo || '?') + 'd ago' : 'Missing') +
      '</span>' +
      (item.status !== 'ok' ? '<div class="text-[10px] text-accent mt-1">Click to fix</div>' : '') +
    '</div>';
  }
  h += '</div></div>';

  // Actions
  if (data.actions && data.actions.length > 0) {
    h += '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Recommended Actions</h3><div class="flex flex-col gap-2">';
    for (const action of data.actions) {
      h += '<button class="glass-panel rounded-lg p-3 text-left cursor-pointer hover:bg-white/5 transition-colors border-0 w-full" onclick="window.CC.contextFix(\'' +
        encodeURIComponent(action.prompt) + '\',\'' + action.agentName + '\')">' +
        '<div class="text-xs text-gray-300 font-medium">' + action.label + '</div>' +
        '<div class="text-[10px] text-gray-500 mt-0.5">' + action.description + '</div>' +
      '</button>';
    }
    h += '</div></div>';
  }

  container.innerHTML = h;
}

function renderFallbackView(container, intel) {
  let h = '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Brand Status</h3>';
  h += '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">Onboarded</span>' +
    '<span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + (intel.isOnboarded ? 'yes' : 'no') + '">' +
    (intel.isOnboarded ? 'Yes' : 'No') + '</span></div>';
  h += '</div>';

  h += '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Intel Freshness</h3>';
  for (const i of (intel.intel?.items || [])) {
    h += '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">' + i.label +
      '</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + i.status + '">' + i.displayLabel + '</span></div>';
  }
  h += '</div>';

  h += '<div class="px-2 mb-6"><h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Context Files</h3>';
  for (const f of (intel.contextFiles || [])) {
    h += '<div class="flex items-center justify-between py-1.5"><span class="text-xs text-gray-400">' + f.label +
      '</span><span class="ctx-badge text-[10px] font-bold px-2 py-0.5 rounded ' + (f.exists ? 'yes' : 'no') + '">' + (f.exists ? 'OK' : 'Missing') + '</span></div>';
  }
  h += '</div>';

  container.innerHTML = h;
}

// --- Fuel gauge (compact health arc in right panel) ---

async function fetchHealthGauge() {
  const el = document.getElementById('ctxHealthGauge');
  if (!el) return;
  try {
    const res = await fetch('/api/context/health');
    const data = await res.json();
    renderFuelGauge(el, data.score || 0);
  } catch {
    el.innerHTML = '';
  }
}

function renderFuelGauge(el, score) {
  const r = 28;
  const circumHalf = Math.PI * r;
  const offset = circumHalf - (score / 100) * circumHalf;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  el.innerHTML =
    '<svg viewBox="0 0 70 42" width="70" height="42">' +
      '<path d="M 7 38 A 28 28 0 0 1 63 38" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M 7 38 A 28 28 0 0 1 63 38" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round" ' +
        'stroke-dasharray="' + circumHalf.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '" ' +
        'style="transition: stroke-dashoffset 0.8s ease"/>' +
      '<text x="35" y="36" text-anchor="middle" fill="#f5f5f7" font-size="13" font-weight="700" font-family="Inter, sans-serif">' + Math.round(score) + '</text>' +
    '</svg>';
}

// Context fix action: switch to operations and start a session
export function contextFix(encodedPrompt, agentName) {
  const prompt = decodeURIComponent(encodedPrompt);
  switchWorkspace('operations');
  const inp = document.getElementById('inputText');
  if (inp) {
    inp.value = prompt;
    inp.focus();
  }
  pickAgent(agentName || 'cmo');
}
