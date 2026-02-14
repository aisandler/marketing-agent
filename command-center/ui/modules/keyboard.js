// Global keyboard shortcuts

import Store from './store.js';
import { toggleFlyout, pickAgent } from './sidebar.js';
import { saveFile } from './files.js';
import { togglePalette, closePalette } from './command-palette.js';

const WORKSPACE_KEYS = { '1': 'operations', '2': 'context', '3': 'studio', '4': 'files', '5': 'activity', '6': 'settings' };

export function switchWorkspace(name) {
  Store.set('activeWorkspace', name);
  // Update icon rail active state
  document.querySelectorAll('.rail-btn[data-workspace]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.workspace === name);
  });
  // Show/hide workspace panels (classes: .workspace-operations, .workspace-context, etc.)
  const panels = ['operations', 'context', 'studio', 'files', 'activity', 'settings'];
  for (const p of panels) {
    const el = document.querySelector('.workspace-' + p);
    if (el) el.classList.toggle('active', p === name);
  }
  // Show/hide input bar (only in operations mode)
  const inputBar = document.querySelector('.input-bar');
  if (inputBar) inputBar.style.display = (name === 'operations') ? '' : 'none';
}

export function setupKeyboard() {
  const inputEl = document.getElementById('inputText');

  document.addEventListener('keydown', e => {
    // Escape: close command palette, cancel pending agent, or close flyout
    if (e.key === 'Escape') {
      if (Store.get('commandPaletteOpen')) { closePalette(); return; }
      if (Store.get('_pendingAgent')) {
        Store.set('_pendingAgent', null);
        if (inputEl) { inputEl.value = ''; }
      }
      if (Store.get('agentFlyoutOpen')) toggleFlyout(false);
      return;
    }

    // Skip hotkeys when typing in input
    if (document.activeElement === inputEl) return;
    if (document.activeElement?.tagName === 'TEXTAREA') return;
    if (document.activeElement?.tagName === 'INPUT') return;

    // A to toggle agent flyout
    if (e.key === 'a' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      toggleFlyout();
      return;
    }

    // Agent hotkeys
    const agents = Store.get('agents') || [];
    const agent = agents.find(x => x.hotkey?.toLowerCase() === e.key.toLowerCase());
    if (agent && !e.metaKey && !e.ctrlKey && !e.altKey && e.key !== 'a') {
      pickAgent(agent.name);
      return;
    }

    // / to focus input
    if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      if (Store.get('activeWorkspace') !== 'operations') switchWorkspace('operations');
      inputEl?.focus();
      return;
    }

    // Cmd+1-6 for workspace switching
    if (e.metaKey || e.ctrlKey) {
      const ws = WORKSPACE_KEYS[e.key];
      if (ws) { e.preventDefault(); switchWorkspace(ws); return; }
    }

    // Cmd+S for file save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      if (Store.get('activeWorkspace') === 'files' && Store.get('fileDirty')) {
        e.preventDefault();
        saveFile();
      }
    }

    // Cmd+K for command palette
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette();
    }
  });

  // Icon rail click handlers
  document.querySelectorAll('.rail-btn[data-workspace]').forEach(btn => {
    btn.addEventListener('click', () => switchWorkspace(btn.dataset.workspace));
  });

  // Agent flyout toggle button
  document.getElementById('agentFlyoutToggle')?.addEventListener('click', () => toggleFlyout());
}
