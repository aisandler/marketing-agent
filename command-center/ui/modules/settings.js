// Settings workspace — env key management + auth status

import Store from './store.js';

const ENV_SCHEMA = [
  {
    group: 'Airtable',
    keys: [
      { key: 'AIRTABLE_API_KEY', label: 'API Key', description: 'Personal access token from airtable.com/create/tokens', required: true, placeholder: 'patXXX...' },
      { key: 'AIRTABLE_BASE_ID', label: 'Base ID', description: 'Content Calendar base identifier', required: true, placeholder: 'appXXX...' },
      { key: 'AIRTABLE_CONTENT_CALENDAR_TABLE_ID', label: 'Content Calendar Table', description: 'Table ID for Content Calendar', required: false, placeholder: 'tblXXX...' },
      { key: 'AIRTABLE_TWITTER_FOLLOW_TABLE_ID', label: 'Twitter Follow Table', description: 'Table for /intel Twitter follow list', required: false, placeholder: 'tblXXX...' },
    ],
  },
  {
    group: 'OpenRouter',
    keys: [
      { key: 'OPENROUTER_API_KEY', label: 'API Key', description: 'For AI image generation (~$0.14/image)', required: true, placeholder: 'sk-or-XXX...' },
      { key: 'OPENROUTER_MODEL', label: 'Model Override', description: 'Override default image generation model', required: false, placeholder: 'google/gemini-3-pro-image-preview' },
    ],
  },
  {
    group: 'Other',
    keys: [
      { key: 'PARTNER_PORTAL_URL', label: 'Portal URL', description: 'Partner content review portal URL', required: false, placeholder: 'http://localhost:3000' },
      { key: 'IMAGE_FEEDBACK_API_KEY', label: 'Image Feedback Key', description: 'API key for image feedback endpoint', required: false, placeholder: '' },
      { key: 'CLOUDINARY_URL', label: 'Cloudinary URL', description: 'Fallback image upload (cloudinary://...)', required: false, placeholder: 'cloudinary://xxx:yyy@zzz' },
    ],
  },
];

let envData = {};
let authData = {};
let editingKey = null;

function toast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast px-4 py-2.5 rounded-lg text-xs text-gray-300 shadow-2xl border border-white/5 border-l-2 ' +
    (type === 'success' ? 'border-l-emerald-400 bg-[#1A1B20]' : type === 'error' ? 'border-l-red-400 bg-[#1A1B20]' : 'border-l-blue-400 bg-[#1A1B20]');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function renderSettings() {
  const el = document.getElementById('settingsView');
  if (!el) return;

  let h = '<h2 class="text-lg font-semibold text-gray-200 mb-6">Settings</h2>';

  // Environment variables
  for (const group of ENV_SCHEMA) {
    h += '<div class="mb-6">';
    h += '<h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">' + group.group + '</h3>';
    for (const schema of group.keys) {
      const data = envData[schema.key] || { masked: '', isSet: false };
      const statusCls = data.isSet ? 'text-emerald-400' : (schema.required ? 'text-red-400' : 'text-gray-600');
      const statusLabel = data.isSet ? 'Configured' : (schema.required ? 'Not configured' : 'Optional');

      h += '<div class="glass-panel rounded-lg p-3 mb-2" id="row-' + schema.key + '">';
      h += '  <div class="flex items-start justify-between gap-4">';
      h += '    <div class="flex-1 min-w-0">';
      h += '      <div class="text-xs text-gray-300 font-medium">' + schema.label;
      if (schema.required) h += ' <span class="text-red-400">*</span>';
      h += '</div>';
      h += '      <div class="text-[10px] text-gray-600 mt-0.5">' + schema.description + '</div>';
      h += '    </div>';

      if (editingKey === schema.key) {
        h += '    <div class="flex items-center gap-1.5">';
        h += '      <input type="text" class="bg-[#08090C] border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-gray-300 outline-none focus:border-accent/50 transition-colors w-48 font-mono" id="input-' + schema.key + '" placeholder="' + (schema.placeholder || '') + '" />';
        h += '      <button class="px-3 py-1.5 text-[10px] font-bold rounded-md bg-accent text-white cursor-pointer border-0 hover:brightness-110 transition-all" onclick="CC.saveEnvKey(\'' + schema.key + '\')">Save</button>';
        h += '      <button class="px-3 py-1.5 text-[10px] font-bold rounded-md bg-transparent text-gray-500 cursor-pointer border border-white/10 hover:text-white transition-all" onclick="CC.cancelEditKey(\'' + schema.key + '\')">Cancel</button>';
        h += '    </div>';
      } else {
        h += '    <div class="flex items-center gap-2">';
        h += '      <span class="text-[10px] font-semibold ' + statusCls + '">' + statusLabel + '</span>';
        if (data.isSet) h += '<code class="text-[10px] text-gray-600 font-mono bg-[#08090C] px-1.5 py-0.5 rounded">' + data.masked + '</code>';
        h += '      <button class="px-2.5 py-1 text-[10px] font-bold rounded-md bg-white/5 text-gray-400 cursor-pointer border border-white/5 hover:text-white hover:bg-white/10 transition-all" onclick="CC.editEnvKey(\'' + schema.key + '\')">' + (data.isSet ? 'Edit' : 'Set') + '</button>';
        if (data.isSet) h += '<button class="px-2.5 py-1 text-[10px] font-bold rounded-md bg-transparent text-gray-600 cursor-pointer border border-white/5 hover:text-red-400 hover:border-red-500/20 transition-all" onclick="CC.clearEnvKey(\'' + schema.key + '\')">Clear</button>';
        h += '    </div>';
      }

      h += '  </div>';
      h += '</div>';
    }
    h += '</div>';
  }

  // Auth section
  h += '<div class="mb-6">';
  h += '<h3 class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-3">Authentication</h3>';
  h += '<div class="glass-panel rounded-lg p-4">';
  h += '  <div class="flex items-center gap-2 mb-2">';
  h += '    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>';
  h += '    <span class="text-xs text-gray-300 font-medium">' + (authData.method || 'OAuth') + '</span>';
  h += '  </div>';
  h += '  <p class="text-[11px] text-gray-500">' + (authData.description || 'Uses your existing Claude Code CLI authentication.') + '</p>';
  h += '  <p class="text-[10px] text-gray-600 mt-1">' + (authData.hint || 'Run `claude login` in your terminal to authenticate.') + '</p>';
  h += '</div>';
  h += '</div>';

  el.innerHTML = h;

  if (editingKey) {
    const input = document.getElementById('input-' + editingKey);
    if (input) input.focus();
  }
}

async function loadEnvData() {
  try {
    const [envRes, authRes] = await Promise.all([
      fetch('/api/env'),
      fetch('/api/auth/status'),
    ]);
    if (envRes.ok) {
      const data = await envRes.json();
      envData = data.keys || {};
    }
    if (authRes.ok) {
      authData = await authRes.json();
    }
  } catch {
    // Silently fail
  }
  renderSettings();
}

function editEnvKey(key) {
  editingKey = key;
  renderSettings();
}

async function saveEnvKey(key) {
  const input = document.getElementById('input-' + key);
  const value = input?.value?.trim() || '';
  if (!value) {
    toast('Value cannot be empty', 'error');
    return;
  }
  try {
    const res = await fetch('/api/env', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      toast(key + ' saved', 'success');
      editingKey = null;
      await loadEnvData();
    } else {
      const err = await res.json();
      toast(err.error || 'Save failed', 'error');
    }
  } catch {
    toast('Network error', 'error');
  }
}

async function clearEnvKey(key) {
  try {
    const res = await fetch('/api/env', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: '' }),
    });
    if (res.ok) {
      toast(key + ' cleared', 'success');
      await loadEnvData();
    } else {
      const err = await res.json();
      toast(err.error || 'Clear failed', 'error');
    }
  } catch {
    toast('Network error', 'error');
  }
}

function cancelEditKey(key) {
  editingKey = null;
  renderSettings();
}

export function setupSettings() {
  Store.on('activeWorkspace', ws => {
    if (ws === 'settings') loadEnvData();
  });
}

export { editEnvKey, saveEnvKey, cancelEditKey, clearEnvKey };
