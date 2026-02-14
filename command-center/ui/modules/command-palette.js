// Command Palette (Cmd+K) — fuzzy search for agents, workspaces, actions

import Store from './store.js';
import { agentColor } from './chat.js';
import { pickAgent } from './sidebar.js';
import { switchWorkspace } from './keyboard.js';

let selectedIdx = 0;
let filteredItems = [];

function getItems() {
  const items = [];

  const agents = Store.get('agents') || [];
  for (const a of agents) {
    items.push({
      id: 'agent:' + a.name,
      icon: '<div class="w-2.5 h-2.5 rounded-full" style="background:' + agentColor(a) + '"></div>',
      name: a.displayName,
      desc: a.description || '',
      shortcut: a.hotkey || '',
      category: 'Agents',
      action: () => { pickAgent(a.name); closePalette(); },
    });
  }

  const workspaces = [
    { name: 'operations', label: 'Operations', icon: '\u{2699}\u{FE0F}', key: '\u2318 1' },
    { name: 'context', label: 'Context Dashboard', icon: '\u{1F4CA}', key: '\u2318 2' },
    { name: 'studio', label: 'Image Studio', icon: '\u{1F5BC}\u{FE0F}', key: '\u2318 3' },
    { name: 'files', label: 'File Browser', icon: '\u{1F4C1}', key: '\u2318 4' },
    { name: 'activity', label: 'Activity Log', icon: '\u{26A1}', key: '\u2318 5' },
    { name: 'settings', label: 'Settings', icon: '\u{2699}\u{FE0F}', key: '\u2318 6' },
  ];
  for (const w of workspaces) {
    items.push({
      id: 'ws:' + w.name,
      icon: '<span class="text-sm">' + w.icon + '</span>',
      name: w.label,
      desc: 'Switch to ' + w.label + ' workspace',
      shortcut: w.key,
      category: 'Navigation',
      action: () => { switchWorkspace(w.name); closePalette(); },
    });
  }

  items.push({
    id: 'action:flyout',
    icon: '<span class="text-sm">\u{1F465}</span>',
    name: 'Open Agent Panel',
    desc: 'Browse all available agents',
    shortcut: 'A',
    category: 'Actions',
    action: () => {
      const { toggleFlyout } = Store.get('_modules') || {};
      if (toggleFlyout) toggleFlyout(true);
      closePalette();
    },
  });

  items.push({
    id: 'action:focus',
    icon: '<span class="text-sm">\u{2328}\u{FE0F}</span>',
    name: 'Focus Input',
    desc: 'Jump to the message input',
    shortcut: '/',
    category: 'Actions',
    action: () => {
      if (Store.get('activeWorkspace') !== 'operations') switchWorkspace('operations');
      document.getElementById('inputText')?.focus();
      closePalette();
    },
  });

  return items;
}

function fuzzyScore(query, text) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const idx = t.indexOf(q);
  if (idx !== -1) {
    if (idx === 0) return 100;
    if (t[idx - 1] === ' ') return 90;
    return 80;
  }
  let qi = 0, lastMatch = -1, gaps = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      if (lastMatch >= 0) gaps += (i - lastMatch - 1);
      lastMatch = i;
      qi++;
    }
  }
  if (qi < q.length) return 0;
  const avgGap = gaps / q.length;
  if (avgGap > 3) return 0;
  return Math.max(1, 50 - gaps * 5);
}

function renderPalette() {
  let overlay = document.getElementById('commandPaletteOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'commandPaletteOverlay';
    overlay.className = 'command-palette-overlay';
    overlay.innerHTML =
      '<div class="w-[520px] glass-panel rounded-xl overflow-hidden shadow-2xl border border-white/10">' +
        '<div class="flex items-center gap-3 px-4 py-3 border-b border-white/5">' +
          '<span class="text-gray-500">\u{1F50D}</span>' +
          '<input type="text" id="cpInput" class="flex-1 bg-transparent border-0 outline-none text-sm text-gray-200 placeholder:text-gray-600" placeholder="Search agents, workspaces, actions..." autocomplete="off" />' +
        '</div>' +
        '<div id="cpResults" class="max-h-[320px] overflow-y-auto p-1"></div>' +
        '<div class="flex items-center gap-4 px-4 py-2 border-t border-white/5 text-[10px] text-gray-600">' +
          '<span><kbd class="px-1 py-0.5 bg-white/5 rounded text-[9px] border border-white/10">\u2191\u2193</kbd> Navigate</span>' +
          '<span><kbd class="px-1 py-0.5 bg-white/5 rounded text-[9px] border border-white/10">\u21B5</kbd> Select</span>' +
          '<span><kbd class="px-1 py-0.5 bg-white/5 rounded text-[9px] border border-white/10">Esc</kbd> Close</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closePalette();
    });

    const input = overlay.querySelector('#cpInput');
    input.addEventListener('input', () => updateResults(input.value));
    input.addEventListener('keydown', handleKeydown);
  }
  return overlay;
}

function updateResults(query) {
  const items = getItems();
  if (!query) {
    filteredItems = items;
  } else {
    const scored = items.map(item => {
      const nameScore = fuzzyScore(query, item.name);
      const descScore = fuzzyScore(query, item.desc) * 0.5;
      const catScore = fuzzyScore(query, item.category) * 0.3;
      return { item, score: Math.max(nameScore, descScore, catScore) };
    });
    filteredItems = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.item);
  }
  selectedIdx = 0;
  renderResults();
}

function renderResults() {
  const el = document.getElementById('cpResults');
  if (!el) return;

  if (filteredItems.length === 0) {
    el.innerHTML = '<div class="p-4 text-xs text-gray-600 text-center">No results found</div>';
    return;
  }

  let lastCat = '';
  let h = '';
  for (let i = 0; i < filteredItems.length; i++) {
    const item = filteredItems[i];
    if (item.category !== lastCat) {
      lastCat = item.category;
      h += '<div class="px-3 pt-2 pb-1 text-[9px] font-bold tracking-[0.12em] uppercase text-gray-600">' + item.category + '</div>';
    }
    const selCls = i === selectedIdx ? ' bg-white/5' : '';
    h += '<div class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors' + selCls + '" data-idx="' + i + '" onmouseenter="this.parentElement.querySelectorAll(\'[data-idx]\').forEach(r=>r.classList.remove(\'bg-white/5\'));this.classList.add(\'bg-white/5\')" onclick="window.CC.cpSelect(' + i + ')">' +
      '<div class="flex items-center justify-center w-6">' + item.icon + '</div>' +
      '<div class="flex-1 min-w-0">' +
        '<div class="text-xs text-gray-300">' + item.name + '</div>' +
        (item.desc ? '<div class="text-[10px] text-gray-600 truncate">' + item.desc + '</div>' : '') +
      '</div>' +
      (item.shortcut ? '<span class="text-[10px] text-gray-600 font-mono bg-white/5 px-1.5 py-0.5 rounded">' + item.shortcut + '</span>' : '') +
    '</div>';
  }
  el.innerHTML = h;

  const selected = el.querySelector('[data-idx="' + selectedIdx + '"]');
  if (selected) selected.scrollIntoView({ block: 'nearest' });
}

function handleKeydown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIdx = Math.min(selectedIdx + 1, filteredItems.length - 1);
    renderResults();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIdx = Math.max(selectedIdx - 1, 0);
    renderResults();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    selectItem(selectedIdx);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closePalette();
  }
}

function selectItem(idx) {
  const item = filteredItems[idx];
  if (item?.action) item.action();
}

export function openPalette() {
  const overlay = renderPalette();
  overlay.classList.add('open');
  Store.set('commandPaletteOpen', true);
  const input = document.getElementById('cpInput');
  if (input) { input.value = ''; input.focus(); }
  updateResults('');
}

export function closePalette() {
  const overlay = document.getElementById('commandPaletteOverlay');
  if (overlay) overlay.classList.remove('open');
  Store.set('commandPaletteOpen', false);
}

export function togglePalette() {
  if (Store.get('commandPaletteOpen')) closePalette();
  else openPalette();
}

export function cpSelect(idx) {
  selectItem(idx);
}

export function setupCommandPalette() {
  renderPalette();
}
