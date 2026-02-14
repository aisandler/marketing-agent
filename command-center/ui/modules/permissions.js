// Permission and AskUserQuestion card handling

import Store from './store.js';
import { esc } from './markdown.js';
import { wsSend } from './ws.js';

export function renderPerm(m) {
  const inp = JSON.stringify(m.input, null, 2);
  const dis = m.resolved ? ' disabled' : '';
  return '<div class="permission-card self-start max-w-3xl w-full glass-panel rounded-lg overflow-hidden border border-amber-500/20" data-request-id="' + m.requestId + '">' +
    '<div class="bg-[#141518] border-b border-white/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-amber-400">Permission Required: ' + m.toolName + '</div>' +
    '<div class="p-4">' +
      '<pre class="text-xs text-gray-400 overflow-auto whitespace-pre-wrap bg-[#08090C] p-3 rounded-md border border-white/[0.04] mb-3">' + esc(inp) + '</pre>' +
      '<div class="permission-actions flex gap-2">' +
        '<button class="btn-allow px-4 py-2 text-xs font-bold rounded-lg bg-accent text-white cursor-pointer border-0 hover:brightness-110 transition-all disabled:opacity-40"' + dis + ' data-action="allow" data-rid="' + m.requestId + '">Allow</button>' +
        '<button class="btn-deny px-4 py-2 text-xs font-bold rounded-lg bg-transparent text-gray-400 cursor-pointer border border-white/10 hover:border-white/20 hover:text-white transition-all disabled:opacity-40"' + dis + ' data-action="deny" data-rid="' + m.requestId + '">Deny</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

export function renderAsk(m) {
  const qs = m.input.questions || [];
  const dis = m.resolved ? ' disabled' : '';
  let h = '<div class="ask-card self-start max-w-3xl w-full glass-panel rounded-lg overflow-hidden border border-glow/20" data-request-id="' + m.requestId + '">' +
    '<div class="bg-[#141518] border-b border-white/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-glow">Choose Your Path</div>' +
    '<div class="p-4">';

  for (const q of qs) {
    h += '<div class="text-sm text-gray-300 mb-3 font-medium">' + esc(q.question) + '</div>' +
      '<div class="ask-options flex flex-col gap-2 mb-4" data-question="' + esc(q.question) + '">';
    for (const o of (q.options || [])) {
      h += '<div class="ask-option glass-panel rounded-lg p-3 cursor-pointer border border-white/5 hover:border-white/15 transition-all relative" data-label="' + esc(o.label) + '" onclick="window.CC.selOpt(this)">' +
        '<div class="ask-option-label text-xs text-gray-200 font-semibold">' + esc(o.label) + '</div>' +
        (o.description ? '<div class="ask-option-desc text-[11px] text-gray-500 mt-0.5">' + esc(o.description) + '</div>' : '') +
      '</div>';
    }
    h += '</div>';
  }

  h += '<button class="ask-submit px-4 py-2 text-xs font-bold rounded-lg bg-glow text-white cursor-pointer border-0 hover:brightness-110 transition-all disabled:opacity-40"' + dis + ' data-rid="' + m.requestId + '" onclick="window.CC.submitAsk(this)">Submit</button>';
  return h + '</div></div>';
}

export function attachPermHandlers() {
  document.querySelectorAll('.permission-actions button').forEach(btn => {
    btn.onclick = function () {
      const rid = this.dataset.rid;
      const allow = this.dataset.action === 'allow';
      const activeId = Store.get('activeSessionId');
      wsSend({ type: 'permission_response', sessionId: activeId, requestId: rid, allow });
      this.closest('.permission-card').querySelectorAll('button').forEach(b => b.disabled = true);
      const s = Store.get('sessions').get(activeId);
      if (s) { const m = s.messages.find(x => x.requestId === rid); if (m) m.resolved = true; }
    };
  });
}

export function selOpt(el) {
  el.parentElement.querySelectorAll('.ask-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

export function submitAsk(btn) {
  const card = btn.closest('.ask-card');
  const rid = btn.dataset.rid;
  const answers = {};
  card.querySelectorAll('.ask-options').forEach(g => {
    const q = g.dataset.question;
    const sel = g.querySelector('.ask-option.selected');
    if (sel) answers[q] = sel.dataset.label;
  });

  const activeId = Store.get('activeSessionId');
  const s = Store.get('sessions').get(activeId);
  const m = s?.messages.find(x => x.requestId === rid);
  const updatedInput = m ? { ...m.input, answers } : { answers };

  wsSend({ type: 'permission_response', sessionId: activeId, requestId: rid, allow: true, updatedInput });
  btn.disabled = true;
  card.querySelectorAll('.ask-option').forEach(o => o.style.pointerEvents = 'none');
  if (m) m.resolved = true;
}
