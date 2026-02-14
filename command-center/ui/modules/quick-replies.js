// Quick-reply detection for numbered/lettered agent options

import Store from './store.js';
import { esc } from './markdown.js';

// Pattern: A) ..., B) ..., or A. ..., B. ...
const LETTER_RE = /^([A-Z])[).]\s+(.+)/;

export function injectQuickReplies(container) {
  if (!container) return;
  if (container.querySelector('.ask-card')) return;

  // --- Ordered lists with bold labels (existing CMO/analyst pathway detection) ---
  container.querySelectorAll('.msg-content > ol, .msg-content ol').forEach(ol => {
    if (ol.parentElement.tagName === 'LI') return;
    if (ol.dataset.qr) return;

    const items = Array.from(ol.children).filter(c => c.tagName === 'LI');
    if (items.length < 2) return;

    let boldCount = 0;
    for (const li of items) {
      if (li.querySelector('strong, b')) boldCount++;
    }
    if (boldCount / items.length < 0.6) return;

    const wrap = document.createElement('div');
    wrap.className = 'quick-replies flex flex-wrap gap-2 mt-3' + (items.length > 8 ? ' max-h-[200px] overflow-y-auto' : '');

    for (const li of items) {
      const strong = li.querySelector('strong, b');
      if (!strong) continue;

      const label = strong.textContent.trim();
      const clone = li.cloneNode(true);
      const boldEl = clone.querySelector('strong, b');
      if (boldEl) boldEl.remove();
      let desc = clone.textContent.trim().replace(/^[\s\-\u2014:]+/, '').trim();

      const btn = document.createElement('button');
      btn.className = 'qr-btn glass-panel rounded-lg p-2.5 text-left cursor-pointer border border-white/5 hover:border-white/15 transition-all relative flex-1 min-w-[140px]';
      btn.innerHTML = '<div class="qr-label text-xs text-gray-200 font-semibold">' + esc(label) + '</div>' +
        (desc ? '<div class="qr-desc text-[10px] text-gray-500 mt-0.5 line-clamp-2">' + esc(desc) + '</div>' : '');
      btn.onclick = function () { quickReply(label, this); };
      wrap.appendChild(btn);
    }

    ol.dataset.qr = '1';
    ol.style.display = 'none';
    ol.insertAdjacentElement('afterend', wrap);
  });

  // --- Unordered lists with lettered options (A), B), C)...) ---
  container.querySelectorAll('.msg-content > ul, .msg-content ul').forEach(ul => {
    if (ul.parentElement.tagName === 'LI') return;
    if (ul.dataset.qr) return;

    const items = Array.from(ul.children).filter(c => c.tagName === 'LI');
    if (items.length < 2) return;

    let matchCount = 0;
    const parsed = [];
    for (const li of items) {
      const text = li.textContent.trim();
      const m = text.match(LETTER_RE);
      if (m) {
        matchCount++;
        parsed.push({ letter: m[1], desc: m[2], li });
      }
    }
    if (matchCount < 2 || matchCount / items.length < 0.6) return;

    const wrap = document.createElement('div');
    wrap.className = 'quick-replies flex flex-wrap gap-2 mt-3' + (parsed.length > 8 ? ' max-h-[200px] overflow-y-auto' : '');

    for (const { letter, desc } of parsed) {
      const btn = document.createElement('button');
      btn.className = 'qr-btn glass-panel rounded-lg p-2.5 text-left cursor-pointer border border-white/5 hover:border-white/15 transition-all relative flex-1 min-w-[140px]';
      btn.innerHTML = '<div class="qr-label text-xs text-gray-200 font-semibold">' + esc(letter) + '</div>' +
        '<div class="qr-desc text-[10px] text-gray-500 mt-0.5 line-clamp-2">' + esc(desc) + '</div>';
      btn.onclick = function () { quickReply(letter, this); };
      wrap.appendChild(btn);
    }

    ul.dataset.qr = '1';
    ul.style.display = 'none';
    ul.insertAdjacentElement('afterend', wrap);
  });
}

function quickReply(text, clickedBtn) {
  const inp = document.getElementById('inputText');
  if (inp) inp.value = text;
  window.CC.doSend();

  const container = clickedBtn.closest('.quick-replies');
  if (container) {
    container.querySelectorAll('.qr-btn').forEach(b => b.classList.add('sent'));
    clickedBtn.classList.remove('sent');
    clickedBtn.classList.add('sent-active');
  }
}
