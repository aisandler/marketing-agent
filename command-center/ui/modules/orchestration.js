// Sub-agent orchestration visualization (Phase 2)

import Store from './store.js';
import { AGENT_COLORS, agentColor } from './chat.js';
import { registerHandler } from './ws.js';

// Track which agent IDs have already played their spawn animation
const spawnedIds = new Set();

// Throttle rendering to avoid layout thrash during fast deltas
let renderRAF = 0;
function scheduleRender() {
  if (renderRAF) return;
  renderRAF = requestAnimationFrame(() => {
    renderRAF = 0;
    renderOrchestrationPanel();
  });
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

export function renderOrchestrationPanel() {
  const subSessions = Store.get('subSessions');
  const panel = document.getElementById('orchestrationPanel');
  if (!panel) return;

  if (!subSessions || subSessions.size === 0) {
    panel.classList.remove('active');
    return;
  }

  panel.classList.add('active');

  let h = '<div class="flex items-center justify-between px-2 py-2 mb-1">' +
    '<span class="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500">Sub-Agents</span>' +
    '<span class="text-[9px] bg-white/5 px-1.5 py-0.5 rounded-full text-gray-400">' + subSessions.size + '</span>' +
  '</div>';

  for (const [agentId, sub] of subSessions) {
    const color = AGENT_COLORS[sub.agentType] || '#71717a';
    const abbrev = (sub.agentType || 'AG').split('-').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const isNew = !spawnedIds.has(agentId);
    if (isNew) spawnedIds.add(agentId);

    let statusIndicator = '';
    if (sub.status === 'running') {
      statusIndicator = '<div class="subagent-status text-[9px] font-bold px-1.5 py-0.5 rounded running">Running</div>';
    } else if (sub.status === 'completed') {
      statusIndicator = '<div class="subagent-status text-[9px] font-bold px-1.5 py-0.5 rounded completed">Done</div>';
    } else if (sub.status === 'starting') {
      statusIndicator = '<div class="subagent-status text-[9px] font-bold px-1.5 py-0.5 rounded starting">Starting</div>';
    } else if (sub.status === 'error') {
      statusIndicator = '<div class="subagent-status text-[9px] font-bold px-1.5 py-0.5 rounded error">Error</div>';
    }

    const toolLine = sub.lastTool && sub.status === 'running'
      ? '<div class="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>' + esc(sub.lastTool) + '</div>'
      : '';

    const preview = sub.streamPreview
      ? '<div class="text-[10px] text-gray-600 mt-1 truncate">' + esc(sub.streamPreview) + '</div>'
      : '';

    const spawnClass = isNew ? ' agent-spawn' : '';
    const spawnStyle = isNew ? ' style="--spawn-color:' + color + '"' : '';

    h += '<div class="subagent-card glass-panel rounded-lg p-2.5 mb-1.5 flex items-start gap-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors ' + sub.status + spawnClass + '" data-agent-id="' + agentId + '"' + spawnStyle +
      ' onclick="window.CC.openSubSlide(\'' + agentId + '\')">' +
      '<div class="subagent-token w-6 h-6 rounded-md flex-shrink-0 relative" style="background:' + color + ';box-shadow:0 0 10px ' + color + '40"></div>' +
      '<div class="flex-1 min-w-0">' +
        '<div class="flex items-center gap-2">' +
          '<span class="text-xs text-gray-300 truncate">' + esc(sub.displayName || sub.agentType) + '</span>' +
          statusIndicator +
        '</div>' +
        toolLine +
        preview +
      '</div>' +
    '</div>';
  }

  panel.innerHTML = h;
}

export function setupOrchestration() {
  registerHandler('subagent_start', msg => {
    const subSessions = Store.get('subSessions');
    subSessions.set(msg.agentId, {
      agentType: msg.agentType,
      displayName: formatAgentName(msg.agentType),
      parentToolUseId: msg.parentToolUseId,
      status: 'running',
      streamPreview: '',
      lastTool: '',
      messages: [],
      startedAt: Date.now(),
    });
    renderOrchestrationPanel();
  });

  registerHandler('subagent_stop', msg => {
    const sub = Store.get('subSessions').get(msg.agentId);
    if (sub) {
      sub.status = 'completed';
      sub.completedAt = Date.now();
      renderOrchestrationPanel();
    }
  });

  registerHandler('subagent_text_delta', msg => {
    const sub = Store.get('subSessions').get(msg.agentId);
    if (sub) {
      sub.streamPreview = (sub.streamPreview + msg.text).slice(-80);
      scheduleRender();
    }
  });

  registerHandler('subagent_tool_progress', msg => {
    const sub = Store.get('subSessions').get(msg.agentId);
    if (sub) {
      sub.lastTool = msg.toolName + ' (' + msg.elapsedSeconds.toFixed(0) + 's)';
      scheduleRender();
    }
  });

  registerHandler('subagent_assistant_message', msg => {
    const sub = Store.get('subSessions').get(msg.agentId);
    if (sub) {
      sub.messages.push({ role: 'assistant', content: msg.content });
      sub.streamPreview = '';
    }
  });

  registerHandler('subagent_tool_result', msg => {
    const sub = Store.get('subSessions').get(msg.agentId);
    if (sub) {
      sub.messages.push({ role: 'tool_result', toolId: msg.toolId, content: msg.content });
    }
  });
}

// --- Sub-agent slide-over panel ---

export function openSubSlide(agentId) {
  const sub = Store.get('subSessions').get(agentId);
  if (!sub) return;

  let panel = document.getElementById('subSlidePanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'subSlidePanel';
    panel.className = 'sub-slide';
    document.body.appendChild(panel);
  }

  const color = AGENT_COLORS[sub.agentType] || '#71717a';
  const abbrev = (sub.agentType || 'AG').split('-').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  let h = '<div class="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-deep flex-shrink-0">' +
    '<div class="w-7 h-7 rounded-lg" style="background:' + color + ';box-shadow:0 0 12px ' + color + '40"></div>' +
    '<div class="text-sm text-gray-200 font-semibold flex-1">' + esc(sub.displayName || sub.agentType) + '</div>' +
    '<button class="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:text-white hover:bg-white/5 cursor-pointer transition-colors border-0 bg-transparent text-lg" onclick="window.CC.closeSubSlide()">&times;</button>' +
  '</div>';
  h += '<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3">';

  if (sub.messages.length === 0) {
    h += '<div class="text-xs text-gray-600 text-center py-6">No messages yet</div>';
  }

  for (const m of sub.messages) {
    if (m.role === 'assistant') {
      h += '<div class="glass-panel rounded-lg p-3">';
      if (typeof m.content === 'string') {
        h += '<div class="text-xs text-gray-300 leading-relaxed">' + esc(m.content) + '</div>';
      } else if (Array.isArray(m.content)) {
        for (const b of m.content) {
          if (b.type === 'text') h += '<div class="text-xs text-gray-300 leading-relaxed">' + esc(b.text) + '</div>';
          else if (b.type === 'tool_use') h += '<div class="text-[10px] text-gray-500 bg-white/[0.03] px-2 py-1 rounded mt-1">' + esc(b.name) + '</div>';
        }
      }
      h += '</div>';
    } else if (m.role === 'tool_result') {
      const txt = typeof m.content === 'string' ? m.content :
        Array.isArray(m.content) ? m.content.filter(b => b.type === 'text').map(b => b.text).join('\n') :
        JSON.stringify(m.content);
      const truncated = txt.length > 300 ? txt.slice(0, 300) + '...' : txt;
      h += '<div class="bg-[#08090C] rounded-md p-2 border border-white/[0.04]"><pre class="text-[10px] text-gray-500 overflow-auto whitespace-pre-wrap">' + esc(truncated) + '</pre></div>';
    }
  }

  h += '</div>';
  panel.innerHTML = h;

  requestAnimationFrame(() => panel.classList.add('open'));
  Store.set('subSlideAgentId', agentId);
}

export function closeSubSlide() {
  const panel = document.getElementById('subSlidePanel');
  if (panel) {
    panel.classList.remove('open');
    setTimeout(() => panel.remove(), 300);
  }
  Store.set('subSlideAgentId', null);
}

function formatAgentName(type) {
  return (type || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
