// Input bar - textarea, send/stop buttons

import Store from './store.js';
import { wsSend } from './ws.js';
import { startSess } from './sessions.js';
import { renderChat } from './chat.js';

export function updInput() {
  const inp = document.getElementById('inputText');
  const send = document.getElementById('btnSend');
  const stop = document.getElementById('btnStop');
  if (!inp || !send || !stop) return;

  const pending = Store.get('_pendingAgent');
  if (pending) {
    inp.disabled = false;
    inp.placeholder = pending.isOrchestrator
      ? 'Message ' + pending.displayName + '...'
      : 'Task for ' + pending.displayName + '...';
    send.disabled = !inp.value.trim();
    stop.style.display = 'none';
    return;
  }

  const activeId = Store.get('activeSessionId');
  if (!activeId) {
    inp.disabled = true;
    send.disabled = true;
    stop.style.display = 'none';
    inp.placeholder = 'Select an agent to start...';
    return;
  }

  const s = Store.get('sessions').get(activeId);
  if (!s) return;

  const running = s.status === 'running' || s.status === 'starting';
  const waiting = s.status === 'waiting_permission';
  const idle = s.status === 'idle';
  const done = s.status === 'completed';

  inp.disabled = running;
  send.disabled = !inp.value.trim() || running || waiting;
  stop.style.display = running ? '' : 'none';

  if (done) inp.placeholder = 'Session ended. Pick an agent to start a new one...';
  else if (idle) inp.placeholder = 'Send a follow-up message...';
  else if (waiting) inp.placeholder = 'Respond to the permission request above...';
  else if (running) inp.placeholder = (s.agent.displayName || s.agent.name) + ' is working...';
  else inp.placeholder = 'Type a message...';
}

function autoSize(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
}

export function doSend() {
  const inp = document.getElementById('inputText');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;

  const pending = Store.get('_pendingAgent');
  if (pending) {
    startSess(pending.name, text);
    inp.value = ''; autoSize(inp);
    return;
  }

  const activeId = Store.get('activeSessionId');
  if (!activeId) return;
  const s = Store.get('sessions').get(activeId);
  if (!s) return;

  if (s.status === 'completed') {
    startSess(s.agent.name, text);
    inp.value = ''; autoSize(inp);
    return;
  }

  wsSend({ type: 'user_message', sessionId: activeId, message: text });
  s.messages.push({ role: 'user', content: text });
  renderChat();
  inp.value = ''; autoSize(inp);
}

export function doStop() {
  const activeId = Store.get('activeSessionId');
  if (!activeId) return;
  wsSend({ type: 'interrupt_session', sessionId: activeId });
}

export function setupInput() {
  const inp = document.getElementById('inputText');
  if (!inp) return;

  inp.addEventListener('input', () => {
    autoSize(inp);
    const send = document.getElementById('btnSend');
    if (send) send.disabled = !inp.value.trim();
  });

  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  });

  document.getElementById('btnSend')?.addEventListener('click', doSend);
  document.getElementById('btnStop')?.addEventListener('click', doStop);

  // React to state changes that affect input
  Store.on('_pendingAgent', updInput);
  Store.on('activeSessionId', updInput);
}
