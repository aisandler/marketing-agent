// Chat rendering - messages, streaming, tool cards, result cards

import Store from './store.js';
import { esc, md } from './markdown.js';
import { injectQuickReplies } from './quick-replies.js';
import { attachPermHandlers, renderPerm, renderAsk } from './permissions.js';

// --- Performance: streaming throttle ---
let _rafId = null;

// --- Performance: message pagination ---
let _messageOffset = 0;

// --- Agent color map ---
export const AGENT_COLORS = {
  cmo: '#a78bfa', analyst: '#22d3ee',
  'content-marketing-strategist': '#34d399', 'lead-writer': '#60a5fa',
  'monthly-content-planner': '#c084fc', 'creative-director': '#f472b6',
  'brand-strategy-consultant': '#818cf8', 'market-research-specialist': '#2dd4bf',
  'crisis-response-specialist': '#f87171', 'seo-optimization-specialist': '#38bdf8',
  'social-media-strategist': '#fb923c', 'conversion-flow-optimizer': '#a3e635',
  'website-analysis-specialist': '#94a3b8', 'marketing-analytics-specialist': '#fbbf24',
  'competitive-intelligence-analyst': '#e879f9', 'email-marketing-specialist': '#4ade80',
  'paid-media-specialist': '#fb7185',
};

// Legacy color name fallback
const COLOR_NAMES = {
  purple: '#a78bfa', cyan: '#22d3ee', blue: '#60a5fa', green: '#4ade80',
  amber: '#fbbf24', red: '#f87171', pink: '#f472b6', indigo: '#818cf8',
  teal: '#2dd4bf', orange: '#fb923c', yellow: '#fbbf24', emerald: '#34d399',
  rose: '#fb7185', lime: '#a3e635', sky: '#38bdf8', violet: '#a78bfa',
};

export function agentColor(agent) {
  if (!agent) return '#71717a';
  return AGENT_COLORS[agent.name] || COLOR_NAMES[agent.color] || '#71717a';
}

function agentTag(agent) {
  return agent.shortTag || (agent.name || 'AG').split('-').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// --- Tool helpers ---
const TOOL_ICONS = {
  Read: '\u{1F4C4}', Write: '\u{270F}\u{FE0F}', Edit: '\u{270F}\u{FE0F}',
  Bash: '\u{1F4BB}', Glob: '\u{1F50D}', Grep: '\u{1F50E}',
  WebFetch: '\u{1F310}', WebSearch: '\u{1F310}', Task: '\u{1F680}',
  AskUserQuestion: '\u{2753}',
};

function tIcon(n) { return TOOL_ICONS[n] || '\u{2699}\u{FE0F}'; }

function tSummary(name, inp) {
  const p = inp || {};
  if (name === 'Read' || name === 'Write' || name === 'Edit')
    return (p.file_path || '').split('/').pop();
  if (name === 'Bash') return (p.command || '').slice(0, 60);
  if (name === 'Glob') return p.pattern || '';
  if (name === 'Grep') return p.pattern || '';
  if (name === 'WebFetch') return p.url || '';
  if (name === 'WebSearch') return p.query || '';
  if (name === 'Task') return p.description || '';
  return '';
}

export function fmtDuration(ms) {
  if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
  return Math.floor(ms / 60000) + 'm ' + Math.floor((ms % 60000) / 1000) + 's';
}

export function fmtToolResult(content) {
  if (!content) return '';
  if (typeof content === 'string') return content.length > 500 ? content.slice(0, 500) + '...' : content;
  if (Array.isArray(content)) {
    const t = content.filter(b => b.type === 'text').map(b => b.text).join('\n');
    return t.length > 500 ? t.slice(0, 500) + '...' : t;
  }
  return JSON.stringify(content, null, 2).slice(0, 500);
}

// --- Rendering ---

export function emptyStateHtml() {
  const agents = Store.get('agents') || [];
  const qbtns = agents.filter(a => a.isOrchestrator).map(a => {
    const color = agentColor(a);
    return '<button class="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border hover:brightness-125" ' +
      'onclick="window.CC.pickAgent(\'' + a.name + '\')" ' +
      'style="border-color:' + color + ';color:' + color + ';background:transparent">' +
      a.displayName + '</button>';
  }).join('');

  return '<div class="empty-state flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">' +
    '<div class="text-5xl font-bold bg-gradient-to-r from-glow to-accent bg-clip-text text-transparent">Command Center</div>' +
    '<div class="flex gap-1.5">' +
      '<span class="w-2 h-2 rounded-sm bg-orange-500 shadow-[0_0_8px_currentColor]"></span>' +
      '<span class="w-2 h-2 rounded-sm bg-violet-500 shadow-[0_0_8px_currentColor]"></span>' +
      '<span class="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_currentColor]"></span>' +
      '<span class="w-2 h-2 rounded-sm bg-emerald-500 shadow-[0_0_8px_currentColor]"></span>' +
    '</div>' +
    '<p class="text-sm max-w-md text-center leading-relaxed">Select an agent from the sidebar or press <kbd class="px-1.5 py-0.5 bg-white/5 rounded text-[11px] border border-white/10">A</kbd> to open the agent panel.</p>' +
    (qbtns ? '<div class="flex gap-2 mt-2 flex-wrap justify-center">' + qbtns + '</div>' : '') +
  '</div>';
}

export function resetMessageOffset() { _messageOffset = 0; }

export function renderChat() {
  const area = document.getElementById('chatArea');
  if (!area) return;

  const activeId = Store.get('activeSessionId');
  const sessions = Store.get('sessions');

  if (!activeId || !sessions.has(activeId)) {
    area.innerHTML = emptyStateHtml();
    return;
  }

  const s = sessions.get(activeId);
  let h = '';

  // --- Session timeline strip ---
  h += renderTimeline(s);

  // --- Message pagination: cap to last 50 + offset ---
  const PAGE_SIZE = 50;
  const msgs = s.messages;
  const startIdx = Math.max(0, msgs.length - PAGE_SIZE - _messageOffset);
  if (startIdx > 0) {
    h += '<div class="text-center py-3"><button class="text-xs text-gray-500 hover:text-gray-300 cursor-pointer bg-white/5 border border-white/5 rounded-full px-4 py-1.5 transition-colors" onclick="window.CC.loadEarlierMessages()">Load earlier messages (' + startIdx + ' hidden)</button></div>';
  }

  for (let i = startIdx; i < msgs.length; i++) {
    const m = msgs[i];
    if (m.role === 'user') {
      h += '<div class="message user self-end max-w-2xl w-full">' +
        '<div class="text-gray-200 p-5 rounded-2xl rounded-tr-sm shadow-lg" style="background:rgba(42,43,48,0.70);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.08);box-shadow:0 4px 20px rgba(0,0,0,0.2)">' +
          '<p class="leading-relaxed">' + esc(m.content) + '</p>' +
        '</div>' +
        '<div class="flex justify-end mt-1.5 text-[10px] text-gray-600">You</div>' +
      '</div>';
    } else if (m.role === 'assistant') {
      h += renderAssistant(m.content, s.agent);
    } else if (m.role === 'permission_request') {
      h += (m.toolName === 'AskUserQuestion') ? renderAsk(m) : renderPerm(m);
    }
  }

  // Streaming buffer
  if (s.streamBuf) {
    h += renderStreamingMsg(s);
  }

  // Thinking indicator — shown when running but no stream content yet
  const isActive = s.status === 'running' || s.status === 'starting';
  if (isActive && !s.streamBuf) {
    const color = agentColor(s.agent);
    h += '<div class="thinking-indicator flex items-center gap-3 p-4 self-start">' +
      '<div class="agent-token thinking w-8 h-8 rounded-lg" style="background:' + color + ';box-shadow:0 0 16px ' + color + '50"></div>' +
      '<span class="text-xs text-gray-500">' + (s.agent.displayName || s.agent.name) + ' is thinking\u2026</span>' +
    '</div>';
  }

  area.innerHTML = h;
  attachPermHandlers();
  area.querySelectorAll('.message.assistant').forEach(msg => injectQuickReplies(msg));
  area.scrollTop = area.scrollHeight;
}

function renderStreamingMsg(s) {
  const color = agentColor(s.agent);
  return '<div class="message assistant streaming-msg self-start max-w-4xl w-full">' +
    '<div class="flex items-start gap-4">' +
      agentAvatar(color) +
      '<div class="flex-1 min-w-0">' +
        '<div class="glass-panel rounded-lg overflow-hidden">' +
          agentCardHeader(s.agent, color) +
          '<div class="p-5 text-gray-300 leading-relaxed msg-content streaming-cursor">' + md(s.streamBuf) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

export function renderStream(s) {
  const area = document.getElementById('chatArea');
  if (!area) return;

  // Cancel any pending RAF from previous delta
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }

  // Schedule DOM update on next animation frame (caps to 60fps)
  _rafId = requestAnimationFrame(() => {
    _rafId = null;
    let el = area.querySelector('.streaming-msg');
    if (!el) {
      const empty = area.querySelector('.empty-state');
      if (empty) empty.remove();
      el = document.createElement('div');
      el.className = 'message assistant streaming-msg self-start max-w-4xl w-full';
      const color = agentColor(s.agent);
      el.innerHTML = '<div class="flex items-start gap-4">' +
        agentAvatar(color) +
        '<div class="flex-1 min-w-0">' +
          '<div class="glass-panel rounded-lg overflow-hidden">' +
            agentCardHeader(s.agent, color) +
            '<div class="p-5 text-gray-300 leading-relaxed msg-content streaming-cursor"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
      area.appendChild(el);
    }

    const contentEl = el.querySelector('.msg-content');
    contentEl.innerHTML = md(s.streamBuf);
    area.scrollTop = area.scrollHeight;
  });
}

export function loadEarlierMessages() {
  _messageOffset += 50;
  renderChat();
}

// --- Shared HTML fragments ---

function agentAvatar(color) {
  return '<div class="agent-token w-8 h-8 rounded-lg flex-shrink-0 mt-1" style="background:' + color + ';box-shadow:0 0 16px ' + color + '50, 0 2px 6px rgba(0,0,0,0.3)"></div>';
}

function agentCardHeader(agent, color) {
  const role = agentRole(agent.name);
  return '<div class="border-b border-white/5 px-4 py-2.5 flex items-center justify-between" style="background:rgba(20,21,24,0.60)">' +
    '<div class="flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase" style="color:' + color + '">' +
      '<div class="w-1.5 h-1.5 rounded-full" style="background:' + color + ';box-shadow:0 0 6px ' + color + '">' + '</div>' +
      (agent.displayName || agent.name) +
    '</div>' +
    (role ? '<span class="text-[9px] text-gray-600 font-medium tracking-wide uppercase">' + role + '</span>' : '') +
  '</div>';
}

const AGENT_ROLES = {
  cmo: 'Orchestrator', analyst: 'Orchestrator',
  'content-marketing-strategist': 'Content', 'lead-writer': 'Content',
  'monthly-content-planner': 'Content', 'creative-director': 'Content',
  'brand-strategy-consultant': 'Strategy', 'market-research-specialist': 'Strategy',
  'crisis-response-specialist': 'Strategy',
  'seo-optimization-specialist': 'Digital', 'social-media-strategist': 'Digital',
  'conversion-flow-optimizer': 'Digital', 'website-analysis-specialist': 'Digital',
  'marketing-analytics-specialist': 'Analytics', 'competitive-intelligence-analyst': 'Analytics',
  'email-marketing-specialist': 'Campaigns', 'paid-media-specialist': 'Campaigns',
};

function agentRole(name) { return AGENT_ROLES[name] || ''; }

function renderAssistant(content, agent) {
  const color = agentColor(agent);

  let h = '<div class="message assistant self-start max-w-4xl w-full">' +
    '<div class="flex items-start gap-4">' +
      agentAvatar(color) +
      '<div class="flex-1 min-w-0">' +
        '<div class="glass-panel rounded-lg overflow-hidden">' +
          agentCardHeader(agent, color) +
          '<div class="p-5 text-gray-300 leading-relaxed msg-content">';

  for (const b of content) {
    if (b.type === 'text') h += md(b.text);
    else if (b.type === 'tool_use') h += renderTool(b);
  }

  return h + '</div></div>' +
  '</div></div></div>';
}

function renderTool(b) {
  const sum = tSummary(b.name, b.input);
  const inp = JSON.stringify(b.input, null, 2);
  return '<div class="tool-card bg-transparent rounded border border-white/5 overflow-hidden my-2" data-tool-id="' + b.id + '">' +
    '<div class="tool-header flex items-center gap-2 p-2.5 bg-white/[0.03] cursor-pointer" onclick="window.CC.toggleTool(this)">' +
      '<span class="text-xs">' + tIcon(b.name) + '</span>' +
      '<span class="tool-name text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">' + b.name + '</span>' +
      '<span class="text-xs text-gray-400 flex-1 truncate">' + esc(sum) + '</span>' +
      '<span class="tool-status text-[9px] font-bold px-1.5 py-0.5 rounded running">Running</span>' +
    '</div>' +
    '<div class="tool-body p-3 border-t border-white/5"><pre class="text-xs text-gray-400 overflow-auto whitespace-pre-wrap">' + esc(inp) + '</pre></div>' +
  '</div>';
}

function renderResultCard(m) {
  const cls = m.isError ? ' border-red-500/20' : ' border-green-500/20';
  return '<div class="glass-panel rounded-lg overflow-hidden my-2 border' + cls + '">' +
    '<div class="px-4 py-2 bg-[#141518] border-b border-white/5 text-xs font-bold uppercase tracking-wider ' +
      (m.isError ? 'text-red-400' : 'text-green-400') + '">' + (m.isError ? 'Session Error' : 'Session Complete') + '</div>' +
    '<div class="p-4 flex gap-6 text-xs text-gray-400">' +
      '<div>Cost: <span class="text-white font-semibold">$' + m.cost.toFixed(4) + '</span></div>' +
      '<div>Turns: <span class="text-white font-semibold">' + m.turns + '</span></div>' +
      '<div>Duration: <span class="text-white font-semibold">' + fmtDuration(m.durationMs) + '</span></div>' +
    '</div></div>';
}

// --- Session timeline strip ---
function renderTimeline(s) {
  if (!s || s.messages.length < 3) return '';

  const tools = [];
  for (let i = 0; i < s.messages.length; i++) {
    const m = s.messages[i];
    if (m.role === 'assistant' && Array.isArray(m.content)) {
      for (const b of m.content) {
        if (b.type === 'tool_use') tools.push({ idx: i, name: b.name });
      }
    }
  }

  if (tools.length === 0) return '';

  const total = s.messages.length;
  let ticks = '';
  for (const t of tools) {
    const pct = (t.idx / total) * 100;
    const color = TOOL_TICK_COLORS[t.name] || '#71717a';
    ticks += '<div class="absolute top-0 h-full w-1 rounded-full" style="left:' + pct.toFixed(1) + '%;background:' + color + '" title="' + t.name + '"></div>';
  }

  return '<div class="relative h-1 bg-white/5 rounded-full mx-4 mb-2 flex-shrink-0">' + ticks + '</div>';
}

const TOOL_TICK_COLORS = {
  Read: '#60a5fa', Write: '#34d399', Edit: '#34d399',
  Bash: '#f59e0b', Glob: '#a78bfa', Grep: '#a78bfa',
  WebFetch: '#22d3ee', WebSearch: '#22d3ee', Task: '#f472b6',
};

// Toggle tool card expand/collapse
export function toggleTool(hdr) {
  hdr.nextElementSibling.classList.toggle('expanded');
}
