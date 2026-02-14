// Session tab management and live cards

import Store from './store.js';
import { agentColor, fmtDuration, fmtToolResult, renderChat, renderStream, resetMessageOffset } from './chat.js';
import { wsSend, registerHandler } from './ws.js';
import { toast } from './toast.js';
import { renderAgentFlyout, renderQuickAgents } from './sidebar.js';
import { renderCtx, updStats } from './context.js';
import { updInput } from './input.js';
import { logEvent } from './activity.js';

function toolSummary(b) {
  const p = b.input || {};
  if (b.name === 'Read' || b.name === 'Write' || b.name === 'Edit') return (p.file_path || '').split('/').pop();
  if (b.name === 'Bash') return (p.command || '').slice(0, 60);
  if (b.name === 'Task') return p.description || '';
  return '';
}

// --- Rendering ---

export function renderTabs() {
  const el = document.getElementById('sessionTabs');
  if (!el) return;
  const sessions = Store.get('sessions');
  if (sessions.size === 0) {
    el.innerHTML = '<span class="text-[11px] text-gray-600">No active sessions</span>';
    return;
  }
  const activeId = Store.get('activeSessionId');
  let h = '';
  for (const [id, s] of sessions) {
    const isActive = id === activeId;
    const baseCls = 'session-tab group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs cursor-pointer border transition-all';
    const activeCls = isActive
      ? ' border-accent/50 bg-panel text-white'
      : ' border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5';
    h += '<div class="' + baseCls + activeCls + (isActive ? ' active' : '') + '" onclick="window.CC.switchTo(\'' + id + '\')">' +
      '<span class="session-dot w-1.5 h-1.5 rounded-full flex-shrink-0 ' + s.status + '"></span>' +
      '<span class="truncate max-w-[120px]">' + (s.agent.displayName || s.agent.name) + '</span>' +
      '<span class="close-btn ml-1 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity" onclick="event.stopPropagation();window.CC.closeSess(\'' + id + '\')">&times;</span>' +
    '</div>';
  }
  el.innerHTML = h;
}

export function renderLiveCards() {
  const el = document.getElementById('liveCards');
  if (!el) return;
  const sessions = Store.get('sessions');
  const toolProgress = Store.get('toolProgress');
  if (sessions.size === 0) {
    el.innerHTML = '<div class="p-3 text-[10px] text-gray-600">No active sessions</div>';
    return;
  }
  let h = '';
  for (const [id, s] of sessions) {
    const color = agentColor(s.agent);
    const prog = toolProgress.get(id);
    const detail = prog ? prog.toolName + ' (' + prog.elapsed.toFixed(0) + 's)' :
      '$' + s.cost.toFixed(4) + ' \u00B7 ' + s.turns + ' turns';
    h += '<div class="live-card flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group" onclick="window.CC.switchTo(\'' + id + '\')">' +
      '<div class="live-dot w-2 h-2 rounded-full flex-shrink-0 ' + s.status + '"></div>' +
      '<div class="flex-1 min-w-0">' +
        '<div class="live-card-name text-xs text-gray-300 truncate">' + (s.agent.displayName || s.agent.name) + '</div>' +
        '<div class="live-card-detail text-[10px] text-gray-600 truncate">' + detail + '</div>' +
      '</div>' +
      '<span class="live-dismiss text-gray-600 opacity-0 group-hover:opacity-100 hover:text-white transition-all cursor-pointer text-sm" onclick="event.stopPropagation();window.CC.closeSess(\'' + id + '\')">&times;</span>' +
    '</div>';
  }
  el.innerHTML = h;
}

// --- Session actions ---

function migrate(msg) {
  const sessions = Store.get('sessions');
  if (sessions.has(msg.sessionId)) return;
  for (const [id, s] of sessions) {
    if (s.status === 'starting') {
      sessions.set(msg.sessionId, s);
      sessions.delete(id);
      if (Store.get('activeSessionId') === id) Store.set('activeSessionId', msg.sessionId);
      return;
    }
  }
}

export function startSess(agentName, prompt) {
  wsSend({ type: 'start_session', agentName, prompt });
  const agents = Store.get('agents') || [];
  const agent = agents.find(a => a.name === agentName) || { name: agentName, displayName: agentName, color: 'purple' };
  const id = agentName + '-' + Date.now().toString(36);
  Store.get('sessions').set(id, {
    agent, messages: [{ role: 'user', content: prompt }],
    status: 'starting', cost: 0, turns: 0, startedAt: Date.now(), streamBuf: '',
  });
  Store.batch({ activeSessionId: id, _pendingAgent: null });
  logEvent('session_start', { agentName: agent.displayName || agentName });
  logEvent('message_sent', { agentName: agent.displayName || agentName, text: prompt });
  renderAll();
}

export function switchTo(id) {
  resetMessageOffset();
  Store.set('activeSessionId', id);
  renderAll();
  updStats();
}

export function closeSess(id) {
  const sessions = Store.get('sessions');
  const s = sessions.get(id);
  if (s && (s.status === 'running' || s.status === 'starting')) {
    wsSend({ type: 'interrupt_session', sessionId: id });
  }
  sessions.delete(id);
  if (Store.get('activeSessionId') === id) {
    const keys = [...sessions.keys()];
    Store.set('activeSessionId', keys.length > 0 ? keys[keys.length - 1] : null);
  }
  renderAll();
  updStats();
}

function renderAll() {
  renderTabs();
  renderLiveCards();
  renderChat();
  updInput();
}

// --- WS Message Handlers ---

export function setupSessionHandlers() {
  registerHandler('sync_state', msg => {
    Store.batch({
      agents: msg.agents || [],
      teams: msg.teams || [],
    });
    renderAgentFlyout();
    renderQuickAgents();
    renderCtx(msg.intel);

    const sessions = Store.get('sessions');
    for (const s of (msg.sessions || [])) {
      if (!sessions.has(s.id)) {
        const agents = Store.get('agents') || [];
        sessions.set(s.id, {
          agent: agents.find(a => a.name === s.agentName) || { name: s.agentName, displayName: s.agentDisplayName, color: s.agentColor },
          messages: [], status: s.status, cost: s.cost, turns: s.turns,
          startedAt: s.startedAt, streamBuf: '',
        });
      }
    }
    renderTabs();
    renderLiveCards();
  });

  registerHandler('session_status', msg => {
    migrate(msg);
    const s = Store.get('sessions').get(msg.sessionId);
    if (s) {
      s.status = msg.status;
      logEvent('session_status', { agentName: s.agent.displayName || msg.agentName, status: msg.status });
      renderTabs(); renderLiveCards(); updInput();
      if (msg.sessionId === Store.get('activeSessionId')) {
        renderChat();
        updStats();
        document.title = s.agent.displayName + ' \u2014 Command Center';
      }
    }
  });

  registerHandler('text_delta', msg => {
    migrate(msg);
    const s = Store.get('sessions').get(msg.sessionId);
    if (!s) return;
    s.streamBuf += msg.text;
    if (msg.sessionId === Store.get('activeSessionId')) renderStream(s);
  });

  registerHandler('assistant_message', msg => {
    migrate(msg);
    const s = Store.get('sessions').get(msg.sessionId);
    if (!s) return;
    s.streamBuf = '';
    s.messages.push({ role: 'assistant', content: msg.content });
    logEvent('message_received', { agentName: s.agent.displayName || s.agent.name, blocks: msg.content?.length || 0 });
    for (const b of (msg.content || [])) {
      if (b.type === 'tool_use') {
        logEvent('tool_use', { agentName: s.agent.displayName || s.agent.name, toolName: b.name, summary: toolSummary(b) });
      }
    }
    if (msg.sessionId === Store.get('activeSessionId')) {
      const area = document.getElementById('chatArea');
      const el = area?.querySelector('.streaming-msg');
      if (el) el.remove();
      renderChat();
    }
  });

  registerHandler('tool_result', msg => {
    migrate(msg);
    const s = Store.get('sessions').get(msg.sessionId);
    if (!s) return;
    s.messages.push({ role: 'tool_result', toolId: msg.toolId, content: msg.content });
    if (msg.sessionId === Store.get('activeSessionId')) {
      const card = document.querySelector('[data-tool-id="' + msg.toolId + '"]');
      if (card) {
        const st = card.querySelector('.tool-status');
        if (st) { st.textContent = 'Done'; st.className = 'tool-status text-[9px] font-bold px-1.5 py-0.5 rounded done'; }
        const body = card.querySelector('.tool-body');
        if (body) {
          const txt = fmtToolResult(msg.content);
          if (txt) {
            const lbl = document.createElement('div');
            lbl.className = 'text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-2 mb-1';
            lbl.textContent = 'Result';
            body.appendChild(lbl);
            const pre = document.createElement('pre');
            pre.className = 'text-xs text-gray-400 overflow-auto whitespace-pre-wrap';
            pre.textContent = txt;
            body.appendChild(pre);
          }
        }
      }
    }
  });

  registerHandler('permission_request', msg => {
    migrate(msg);
    const s = Store.get('sessions').get(msg.sessionId);
    if (!s) return;
    s.messages.push({
      role: 'permission_request', requestId: msg.requestId,
      toolName: msg.toolName, input: msg.input, resolved: false,
    });
    if (Store.get('activeSessionId') !== msg.sessionId) {
      Store.set('activeSessionId', msg.sessionId);
      renderTabs();
    }
    renderChat();
    toast('Permission needed: ' + msg.toolName, 'info');
  });

  registerHandler('session_result', msg => {
    migrate(msg);
    const s = Store.get('sessions').get(msg.sessionId);
    if (!s) return;
    s.cost = msg.cost; s.turns = msg.turns;
    s.messages.push({
      role: 'result', cost: msg.cost, turns: msg.turns,
      durationMs: msg.durationMs, result: msg.result, isError: msg.isError,
    });
    logEvent(msg.isError ? 'session_error' : 'session_result', {
      agentName: s.agent.displayName || s.agent.name,
      cost: msg.cost, turns: msg.turns, message: msg.result,
    });
    if (msg.sessionId === Store.get('activeSessionId')) { renderChat(); updStats(); }
    renderTabs(); renderLiveCards();
  });

  registerHandler('tool_progress', msg => {
    Store.get('toolProgress').set(msg.sessionId, { toolName: msg.toolName, elapsed: msg.elapsedSeconds });
    renderLiveCards();
  });
}
