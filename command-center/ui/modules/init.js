// Bootstrap - wires all modules together

import Store from './store.js';
import { connectWS } from './ws.js';
import { renderChat, toggleTool, agentColor, loadEarlierMessages, resetMessageOffset } from './chat.js';
import { selOpt, submitAsk } from './permissions.js';
import { renderAgentFlyout, renderQuickAgents, toggleFlyout, pickAgent } from './sidebar.js';
import { renderTabs, renderLiveCards, setupSessionHandlers, startSess, switchTo, closeSess } from './sessions.js';
import { renderCtx, updStats, renderContextDashboard, contextFix } from './context.js';
import { setupInput, updInput, doSend, doStop } from './input.js';
import { setupKeyboard, switchWorkspace } from './keyboard.js';
import { loadFileRoots, toggleDir, openFile, saveFile, setupFiles, renderFileTree } from './files.js';
import { setupOrchestration, renderOrchestrationPanel, openSubSlide, closeSubSlide } from './orchestration.js';
import { setupImages, refreshImages, generateImages, generateImagesDry } from './images.js';
import { setupActivity, clearActivity } from './activity.js';
import { setupCommandPalette, togglePalette, cpSelect } from './command-palette.js';
import { setupSettings, editEnvKey, saveEnvKey, cancelEditKey, clearEnvKey } from './settings.js';

// --- Expose functions globally for onclick handlers ---
window.CC = {
  pickAgent,
  switchTo,
  closeSess,
  doSend,
  doStop,
  selOpt,
  submitAsk,
  toggleTool,
  toggleDir,
  openFile,
  saveFile,
  switchWorkspace,
  toggleFlyout,
  contextFix,
  refreshImages,
  generateImages,
  generateImagesDry,
  clearActivity,
  loadEarlierMessages,
  openSubSlide,
  closeSubSlide,
  togglePalette,
  cpSelect,
  editEnvKey,
  saveEnvKey,
  cancelEditKey,
  clearEnvKey,
};

// Store module references for cross-module access
Store.set('_modules', { toggleFlyout });

// --- Register WS message handlers ---
setupSessionHandlers();
setupOrchestration();
setupImages();
setupActivity();
setupFiles();
setupCommandPalette();
setupSettings();

// --- Setup UI ---
setupInput();
setupKeyboard();

// --- Initial data fetch ---
connectWS();

fetch('/api/agents').then(r => r.json()).then(agents => {
  if (!Store.get('agents').length) {
    Store.set('agents', agents.map(a => ({
      name: a.name, displayName: a.displayName, shortTag: a.shortTag,
      color: a.color, description: a.description, hotkey: a.hotkey,
      isOrchestrator: a.isOrchestrator,
    })));
    renderAgentFlyout();
    renderQuickAgents();
  }
}).catch(() => {});

fetch('/api/intel').then(r => r.json()).then(renderCtx).catch(() => {});

// --- Periodic updates ---
setInterval(() => {
  const activeId = Store.get('activeSessionId');
  if (activeId) {
    const s = Store.get('sessions').get(activeId);
    if (s && (s.status === 'running' || s.status === 'starting')) updStats();
  }
  if (Store.get('sessions').size > 0) renderLiveCards();
}, 1000);

// Load context dashboard when first viewing that workspace
Store.on('activeWorkspace', ws => {
  if (ws === 'context') renderContextDashboard();
});

console.log('[Command Center] Initialized');
