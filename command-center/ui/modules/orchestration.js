// Sub-agent orchestration visualization (Phase 2)

import Store from './store.js';
import { AGENT_COLORS, agentColor } from './chat.js';
import { registerHandler } from './ws.js';

// Track which agent IDs have already played their spawn animation
const spawnedIds = new Set();

// Panel dismiss state
let panelDismissed = false;

// Inline expansion state (only one expanded at a time)
let expandedAgentId = null;

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

  // Reset dismiss flag when all sub-sessions are gone
  if (!subSessions || subSessions.size === 0) {
    panel.classList.remove('active');
    panelDismissed = false;
    expandedAgentId = null;
    return;
  }

  // Respect user dismiss
  if (panelDismissed) return;

  panel.classList.add('active');

  let runningCount = 0;
  for (const [, sub] of subSessions) { if (sub.status === 'running') runningCount++; }

  let h = '<div class="flex items-center justify-between px-2 py-2 mb-1">' +
    '<span class="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500">Sub-Agents</span>' +
    '<div class="flex items-center gap-2">' +
      '<span class="text-[9px] bg-white/5 px-1.5 py-0.5 rounded-full text-gray-400">' + runningCount + '/' + subSessions.size + '</span>' +
      '<button class="w-5 h-5 flex items-center justify-center rounded text-gray-600 hover:text-white hover:bg-white/5 cursor-pointer transition-colors border-0 bg-transparent text-sm" onclick="window.CC.dismissOrchPanel()" title="Dismiss">&times;</button>' +
    '</div>' +
  '</div>';

  for (const [agentId, sub] of subSessions) {
    const color = AGENT_COLORS[sub.agentType] || '#71717a';
    const isNew = !spawnedIds.has(agentId);
    if (isNew) spawnedIds.add(agentId);
    const isExpanded = expandedAgentId === agentId;

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

    // Description line (from Task tool)
    const descLine = sub.taskDescription
      ? '<div class="text-[10px] text-gray-500 mt-0.5 truncate">' + esc(sub.taskDescription) + '</div>'
      : '';

    // Compact tool + stream (hidden when expanded — shown in detail instead)
    let compactInfo = '';
    if (!isExpanded) {
      if (sub.lastTool && sub.status === 'running') {
        compactInfo += '<div class="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>' + esc(sub.lastTool) + '</div>';
      }
      if (sub.streamPreview) {
        compactInfo += '<div class="text-[10px] text-gray-600 mt-1 truncate">' + esc(sub.streamPreview) + '</div>';
      }
    }

    // Detail section (visible when expanded)
    let detailContent = '';
    if (isExpanded) {
      // Current tool with elapsed
      if (sub.lastTool && sub.status === 'running') {
        detailContent += '<div class="text-[10px] text-gray-400 flex items-center gap-1 mb-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>' + esc(sub.lastTool) + '</div>';
      }

      // Full stream preview (scrollable)
      if (sub.streamPreview) {
        detailContent += '<div class="bg-[#08090C] rounded-md p-2 border border-white/[0.04] mb-2 max-h-[120px] overflow-y-auto"><pre class="text-[10px] text-gray-500 whitespace-pre-wrap break-words">' + esc(sub.streamPreview) + '</pre></div>';
      }

      // Last 3 messages
      const recentMsgs = (sub.messages || []).slice(-3);
      if (recentMsgs.length > 0) {
        detailContent += '<div class="text-[9px] font-bold tracking-wider uppercase text-gray-600 mb-1">Recent</div>';
        for (const m of recentMsgs) {
          if (m.role === 'assistant') {
            let text = '';
            if (typeof m.content === 'string') {
              text = m.content;
            } else if (Array.isArray(m.content)) {
              text = m.content.filter(b => b.type === 'text').map(b => b.text).join(' ');
            }
            const truncated = text.length > 150 ? text.slice(0, 150) + '...' : text;
            detailContent += '<div class="text-[10px] text-gray-400 mb-1 leading-relaxed">' + esc(truncated) + '</div>';
          } else if (m.role === 'tool_result') {
            const txt = typeof m.content === 'string' ? m.content :
              Array.isArray(m.content) ? m.content.filter(b => b.type === 'text').map(b => b.text).join('\n') :
              JSON.stringify(m.content);
            const truncated = txt.length > 100 ? txt.slice(0, 100) + '...' : txt;
            detailContent += '<div class="bg-[#08090C] rounded p-1.5 border border-white/[0.04] mb-1"><pre class="text-[10px] text-gray-600 whitespace-pre-wrap break-words">' + esc(truncated) + '</pre></div>';
          }
        }
      }

      if (!detailContent) {
        detailContent = '<div class="text-[10px] text-gray-600 text-center py-2">No activity yet</div>';
      }
    }

    const spawnClass = isNew ? ' agent-spawn' : '';
    const spawnStyle = isNew ? ' style="--spawn-color:' + color + '"' : '';
    const expandedClass = isExpanded ? ' expanded' : '';

    // Use displayName which prefers taskName over formatted agentType
    const displayName = sub.displayName || sub.agentType;

    h += '<div class="subagent-card glass-panel rounded-lg p-2.5 mb-1.5 ' + sub.status + spawnClass + expandedClass + '" data-agent-id="' + agentId + '"' + spawnStyle + '>' +
      '<div class="flex items-start gap-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors rounded" onclick="window.CC.toggleSubDetail(\'' + agentId + '\')">' +
        '<div class="subagent-token w-6 h-6 rounded-md flex-shrink-0 relative" style="background:' + color + ';box-shadow:0 0 10px ' + color + '40"></div>' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-2">' +
            '<span class="text-xs text-gray-300 truncate">' + esc(displayName) + '</span>' +
            statusIndicator +
          '</div>' +
          descLine +
          compactInfo +
        '</div>' +
      '</div>' +
      '<div class="subagent-detail">' + detailContent + '</div>' +
    '</div>';
  }

  panel.innerHTML = h;
}

// Clean up all sub-sessions for a given parent session
export function clearSubSessionsForSession(sessionId) {
  const subSessions = Store.get('subSessions');
  for (const [agentId, sub] of subSessions) {
    if (sub.sessionId === sessionId) {
      subSessions.delete(agentId);
    }
  }
  spawnedIds.clear();
  expandedAgentId = null;
  renderOrchestrationPanel();
}

// Clear all sub-sessions (used on reconnect/sync)
export function clearAllSubSessions() {
  Store.get('subSessions').clear();
  spawnedIds.clear();
  expandedAgentId = null;
  renderOrchestrationPanel();
}

// Dismiss the orchestration panel (user clicked x)
export function dismissOrchestrationPanel() {
  panelDismissed = true;
  const panel = document.getElementById('orchestrationPanel');
  if (panel) panel.classList.remove('active');
}

// Toggle inline detail for a sub-agent card
export function toggleSubDetail(agentId) {
  expandedAgentId = expandedAgentId === agentId ? null : agentId;
  renderOrchestrationPanel();
}

export function setupOrchestration() {
  registerHandler('subagent_start', msg => {
    // Auto-reshow panel on new spawn
    panelDismissed = false;

    const subSessions = Store.get('subSessions');
    // Use taskName as display name if available, fall back to formatted agentType
    const displayName = msg.taskName || formatAgentName(msg.agentType);
    subSessions.set(msg.agentId, {
      sessionId: msg.sessionId,
      agentType: msg.agentType,
      displayName,
      taskDescription: msg.taskDescription || '',
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
      // Collapse if this agent was expanded
      if (expandedAgentId === msg.agentId) expandedAgentId = null;
      renderOrchestrationPanel();
      // Auto-remove completed sub-agents after 8 seconds
      setTimeout(() => {
        const current = Store.get('subSessions').get(msg.agentId);
        if (current && current.status === 'completed') {
          Store.get('subSessions').delete(msg.agentId);
          renderOrchestrationPanel();
        }
      }, 8000);
    }
  });

  registerHandler('subagent_text_delta', msg => {
    const sub = Store.get('subSessions').get(msg.agentId);
    if (sub) {
      sub.streamPreview = (sub.streamPreview + msg.text).slice(-200);
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

function formatAgentName(type) {
  return (type || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
