// Agent roster flyout panel

import Store from './store.js';
import { agentColor } from './chat.js';
import { esc } from './markdown.js';
import { switchWorkspace } from './keyboard.js';
import { startSess } from './sessions.js';

export function renderAgentFlyout() {
  const teams = Store.get('teams');
  const agents = Store.get('agents');
  const el = document.getElementById('teamList');
  if (!el) return;

  if (!teams || !teams.length) {
    el.innerHTML = (agents || []).map(a =>
      '<div class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors border-l-2 group" onclick="window.CC.pickAgent(\'' + a.name + '\')" style="border-left-color:' + agentColor(a) + '">' +
        '<div class="w-2 h-2 rounded-full flex-shrink-0" style="background:' + agentColor(a) + '"></div>' +
        '<div class="flex-1 min-w-0">' +
          '<div class="text-xs text-gray-300 truncate">' + a.displayName + '</div>' +
          '<div class="text-[10px] text-gray-600 truncate">' + (a.description || '') + '</div>' +
        '</div>' +
        '<span class="text-[10px] text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">' + (a.hotkey || '') + '</span>' +
      '</div>'
    ).join('');
    return;
  }

  let h = '';
  for (let ti = 0; ti < teams.length; ti++) {
    const t = teams[ti];
    const isOrch = t.name === 'orchestrators';
    h += '<details class="team-group mb-2"' + (isOrch ? ' open' : '') + '>' +
      '<summary class="flex items-center gap-2 px-3 py-2 text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">' +
        '<span>' + t.icon + '</span> ' + t.label +
        '<span class="ml-auto text-[9px] bg-white/5 px-1.5 py-0.5 rounded-full">' + t.agents.length + '</span>' +
      '</summary>';
    for (let ai = 0; ai < t.agents.length; ai++) {
      const a = t.agents[ai];
      h += '<div class="agent-card flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors border-l-2 ml-2 group" onclick="window.CC.pickAgent(\'' + a.name + '\')" style="border-left-color:' + agentColor(a) + ';animation-delay:' + (ai * 0.04) + 's">' +
        '<div class="w-2 h-2 rounded-full flex-shrink-0" style="background:' + agentColor(a) + '"></div>' +
        '<div class="flex-1 min-w-0">' +
          '<div class="text-xs text-gray-300 truncate">' + a.displayName + '</div>' +
          '<div class="text-[10px] text-gray-600 truncate">' + (a.description || '') + '</div>' +
        '</div>' +
        '<span class="text-[10px] text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">' + (a.hotkey || '') + '</span>' +
      '</div>';
    }
    h += '</details>';
  }
  el.innerHTML = h;
}

export function toggleFlyout(force) {
  const open = force !== undefined ? force : !Store.get('agentFlyoutOpen');
  Store.set('agentFlyoutOpen', open);
  const flyout = document.getElementById('agentFlyout');
  if (flyout) flyout.classList.toggle('open', open);
}

export function pickAgent(name) {
  const agents = Store.get('agents') || [];
  const agent = agents.find(a => a.name === name);
  if (!agent) return;
  toggleFlyout(false);
  if (Store.get('activeWorkspace') !== 'operations') switchWorkspace('operations');
  startSess(name, 'Start');
}

export function renderQuickAgents() {
  const el = document.getElementById('quickAgents');
  if (!el) return;
  const agents = Store.get('agents') || [];
  el.innerHTML = agents.filter(a => a.isOrchestrator).map(a => {
    const color = agentColor(a);
    return '<button class="px-3 py-1.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all border hover:brightness-125" ' +
      'onclick="window.CC.pickAgent(\'' + a.name + '\')" ' +
      'style="border-color:' + color + ';color:' + color + ';background:transparent">' +
      a.displayName + '</button>';
  }).join('');
}
