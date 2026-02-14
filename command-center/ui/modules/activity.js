// Activity workspace — session event log with timeline

import Store from './store.js';
import { fmtDuration, agentColor } from './chat.js';
import { esc } from './markdown.js';

// Global event log — persists across session lifecycle
const events = [];
const MAX_EVENTS = 200;

export function logEvent(type, data) {
  events.unshift({ type, data, ts: Date.now() });
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
  if (Store.get('activeWorkspace') === 'activity') renderActivity();
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  return Math.floor(s / 3600) + 'h ago';
}

const EVENT_ICONS = {
  session_start: '\u{1F680}',
  session_status: '\u{1F7E2}',
  session_result: '\u{2705}',
  session_error: '\u{274C}',
  message_sent: '\u{1F4AC}',
  message_received: '\u{1F916}',
  tool_use: '\u{2699}\u{FE0F}',
  permission: '\u{1F512}',
  subagent_start: '\u{1F4E6}',
  subagent_stop: '\u{1F4E5}',
};

function eventIcon(type) { return EVENT_ICONS[type] || '\u{25CF}'; }

export function renderActivity() {
  const container = document.getElementById('activityView');
  if (!container) return;

  let h = '<div class="flex items-center justify-between mb-4">' +
    '<h3 class="text-sm font-semibold text-gray-300">Activity Log</h3>' +
    '<div class="flex items-center gap-3">' +
      '<span class="text-[10px] text-gray-600">' + events.length + ' events</span>' +
      (events.length > 0 ? '<button class="text-[10px] text-gray-500 hover:text-gray-300 cursor-pointer bg-white/5 border border-white/5 rounded px-2 py-0.5 transition-colors" onclick="window.CC.clearActivity()">Clear</button>' : '') +
    '</div>' +
  '</div>';

  // Current sessions summary
  const sessions = Store.get('sessions');
  if (sessions.size > 0) {
    h += '<div class="flex flex-col gap-1.5 mb-4">';
    for (const [id, s] of sessions) {
      const color = agentColor(s.agent);
      const dur = fmtDuration(Date.now() - s.startedAt);
      h += '<div class="glass-panel rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-white/[0.03] transition-colors" onclick="window.CC.switchTo(\'' + id + '\')">' +
        '<div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:' + color + '"></div>' +
        '<div class="flex-1 min-w-0">' +
          '<span class="text-xs text-gray-300">' + (s.agent.displayName || s.agent.name) + '</span>' +
          '<span class="text-[10px] text-gray-600 ml-2">' + s.status + ' \u00B7 $' + s.cost.toFixed(4) + ' \u00B7 ' + dur + ' \u00B7 ' + s.messages.length + ' msgs</span>' +
        '</div>' +
      '</div>';
    }
    h += '</div>';
  }

  // Event timeline
  if (events.length === 0) {
    h += '<div class="flex flex-col items-center justify-center gap-3 py-12 text-gray-600">' +
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' +
      '</svg>' +
      '<p class="text-xs">No activity yet. Start an agent session to see events here.</p>' +
    '</div>';
  } else {
    h += '<div class="flex flex-col gap-0.5">';
    for (const ev of events) {
      h += '<div class="flex items-start gap-2.5 py-1.5 px-2 rounded hover:bg-white/[0.02] transition-colors">' +
        '<span class="text-sm flex-shrink-0 mt-0.5">' + eventIcon(ev.type) + '</span>' +
        '<div class="flex-1 min-w-0">' +
          '<span class="text-xs text-gray-300">' + formatEvent(ev) + '</span>' +
          '<span class="text-[10px] text-gray-600 ml-2">' + timeAgo(ev.ts) + '</span>' +
        '</div>' +
      '</div>';
    }
    h += '</div>';
  }

  container.innerHTML = h;
}

function formatEvent(ev) {
  const d = ev.data || {};
  switch (ev.type) {
    case 'session_start': return '<strong class="text-gray-200">' + esc(d.agentName || '') + '</strong> session started';
    case 'session_status': return '<strong class="text-gray-200">' + esc(d.agentName || '') + '</strong> \u2192 ' + esc(d.status || '');
    case 'session_result': return '<strong class="text-gray-200">' + esc(d.agentName || '') + '</strong> completed \u00B7 $' + (d.cost || 0).toFixed(4) + ' \u00B7 ' + (d.turns || 0) + ' turns';
    case 'session_error': return '<strong class="text-gray-200">' + esc(d.agentName || '') + '</strong> error: ' + esc(d.message || '');
    case 'message_sent': return 'You \u2192 <strong class="text-gray-200">' + esc(d.agentName || '') + '</strong>: ' + esc((d.text || '').slice(0, 80));
    case 'message_received': return '<strong class="text-gray-200">' + esc(d.agentName || '') + '</strong> responded (' + (d.blocks || 0) + ' blocks)';
    case 'tool_use': return '<strong class="text-gray-200">' + esc(d.agentName || '') + '</strong> used ' + esc(d.toolName || '') + (d.summary ? ': ' + esc(d.summary.slice(0, 60)) : '');
    case 'permission': return 'Permission request: <strong class="text-gray-200">' + esc(d.toolName || '') + '</strong>';
    case 'subagent_start': return 'Sub-agent spawned: <strong class="text-gray-200">' + esc(d.agentType || '') + '</strong>';
    case 'subagent_stop': return 'Sub-agent completed: <strong class="text-gray-200">' + esc(d.agentType || '') + '</strong>';
    default: return esc(ev.type);
  }
}

export function clearActivity() {
  events.length = 0;
  renderActivity();
}

export function setupActivity() {
  Store.on('activeWorkspace', ws => {
    if (ws === 'activity') renderActivity();
  });

  setInterval(() => {
    if (Store.get('activeWorkspace') === 'activity' && events.length > 0) renderActivity();
  }, 2000);
}
