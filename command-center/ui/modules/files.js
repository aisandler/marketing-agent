// File browser workspace

import Store from './store.js';
import { esc } from './markdown.js';
import { toast } from './toast.js';

const FILE_ICONS = {
  md: '\u{1F4DD}', json: '\u{1F4CB}', ts: '\u{1F4DC}', js: '\u{1F4DC}',
  html: '\u{1F310}', css: '\u{1F3A8}', sh: '\u{1F4BB}', yaml: '\u{2699}\u{FE0F}', yml: '\u{2699}\u{FE0F}',
};

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  return FILE_ICONS[ext] || '\u{1F4C4}';
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getCmMode(path) {
  const ext = path.split('.').pop().toLowerCase();
  const map = { md: 'markdown', json: 'javascript', js: 'javascript', ts: 'javascript', html: 'htmlmixed', css: 'css', yaml: 'yaml', yml: 'yaml', sh: 'shell' };
  return map[ext] || null;
}

// --- Tree rendering ---

export async function loadFileRoots() {
  const fts = Store.get('fileTreeState');
  fts._loaded = true;
  const tree = document.getElementById('fileTree');
  if (tree) tree.innerHTML = '<div class="skeleton h-4 mx-3 my-2 rounded"></div><div class="skeleton h-4 mx-3 my-2 rounded" style="width:70%"></div>';
  try {
    const res = await fetch('/api/files/list');
    const roots = await res.json();
    fts._roots = roots;
    renderFileTree();
  } catch {
    if (tree) tree.innerHTML = '<div class="p-3 text-red-400 text-[11px]">Failed to load files</div>';
  }
}

export async function toggleDir(path) {
  const fts = Store.get('fileTreeState');
  const s = fts[path];
  if (s && s.expanded) {
    fts[path].expanded = false;
    renderFileTree();
    return;
  }
  fts[path] = { expanded: true, children: null };
  renderFileTree();
  try {
    const res = await fetch('/api/files/list?path=' + encodeURIComponent(path));
    fts[path].children = await res.json();
    renderFileTree();
  } catch {
    fts[path].children = [];
    renderFileTree();
  }
}

export function renderFileTree() {
  const tree = document.getElementById('fileTree');
  if (!tree) return;
  const fts = Store.get('fileTreeState');
  const roots = fts._roots || [];
  const openPath = Store.get('openFilePath');
  let h = '';

  function renderEntry(entry, depth) {
    if (entry.type === 'directory') {
      const s = fts[entry.path];
      const expanded = s && s.expanded;
      const arrowCls = expanded ? 'tree-arrow open' : 'tree-arrow';
      h += '<div class="file-tree-item flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-white/5 text-xs text-gray-400 transition-colors" style="--depth:' + depth + '" onclick="window.CC.toggleDir(\'' + esc(entry.path) + '\')">' +
        '<span class="' + arrowCls + ' text-[10px] text-gray-600 transition-transform inline-block w-3">\u25B6</span>' +
        '<span class="text-sm">\u{1F4C1}</span>' +
        '<span class="truncate">' + esc(entry.name) + '</span></div>';
      if (expanded && s.children) {
        for (const child of s.children) renderEntry(child, depth + 1);
      } else if (expanded && !s.children) {
        h += '<div class="skeleton h-3 rounded mx-3 my-1" style="margin-left:' + ((depth + 1) * 16 + 8) + 'px"></div>';
      }
    } else {
      const active = openPath === entry.path ? ' bg-white/5 text-gray-200' : '';
      h += '<div class="file-tree-item flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-white/5 text-xs text-gray-400 transition-colors' + active + '" style="--depth:' + depth + '" onclick="window.CC.openFile(\'' + esc(entry.path) + '\')">' +
        '<span class="w-3" style="visibility:hidden">\u25B6</span>' +
        '<span class="text-sm">' + fileIcon(entry.name) + '</span>' +
        '<span class="truncate">' + esc(entry.name) + '</span></div>';
    }
  }

  for (const root of roots) renderEntry(root, 0);
  tree.innerHTML = h || '<div class="p-3 text-gray-600 text-[11px]">No files found</div>';
}

// --- Breadcrumb navigation ---

function renderBreadcrumbs(path) {
  if (!path) return '';
  const parts = path.split('/');
  let h = '<div class="flex items-center gap-1 text-[11px] px-4 py-2 border-b border-white/5">';
  let accum = '';
  for (let i = 0; i < parts.length; i++) {
    accum += (i > 0 ? '/' : '') + parts[i];
    const isLast = i === parts.length - 1;
    if (isLast) {
      h += '<span class="text-gray-300 font-medium">' + esc(parts[i]) + '</span>';
    } else {
      h += '<span class="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" onclick="window.CC.toggleDir(\'' + esc(accum) + '\')">' + esc(parts[i]) + '</span>';
      h += '<span class="text-gray-600">/</span>';
    }
  }
  return h + '</div>';
}

// --- Markdown preview (split view for .md files) ---

function isMarkdown(path) {
  return path && (path.endsWith('.md') || path.endsWith('.mdx'));
}

function renderMarkdownPreview(content) {
  if (typeof marked !== 'undefined') {
    try { return marked.parse(content); } catch {}
  }
  return '<pre>' + esc(content) + '</pre>';
}

// --- File editing ---

export async function openFile(path) {
  if (Store.get('fileDirty') && Store.get('openFilePath') && Store.get('openFilePath') !== path) {
    if (!confirm('You have unsaved changes. Discard them?')) return;
  }
  Store.batch({ openFilePath: path, fileDirty: false });
  renderFileTree();

  const editor = document.getElementById('fileEditor');
  if (!editor) return;
  editor.innerHTML = renderBreadcrumbs(path) +
    '<div class="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-deep">' +
      '<span class="flex-1 text-xs text-gray-400 font-mono truncate">' + esc(path.split('/').pop()) + '</span>' +
      '<span class="text-[10px] text-gray-600" id="fileSize">Loading...</span>' +
      '<span class="text-amber-400 text-[10px] font-bold" id="fileDirtyBadge" style="display:none">Modified</span>' +
      '<button class="px-3 py-1 text-[11px] font-bold bg-gradient-to-r from-glow to-cyan-500 text-white rounded-md cursor-pointer border-0 disabled:opacity-40" id="btnSave" disabled onclick="window.CC.saveFile()">Save</button>' +
    '</div>' +
    '<div class="flex flex-1 overflow-hidden">' +
      '<div class="flex-1 overflow-hidden" id="editorContent"></div>' +
      (isMarkdown(path) ? '<div class="w-1/2 overflow-y-auto p-4 border-l border-white/5 text-xs text-gray-300 leading-relaxed msg-content" id="mdPreview"></div>' : '') +
    '</div>';

  try {
    const res = await fetch('/api/files/read?path=' + encodeURIComponent(path));
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    Store.set('openFileContent', data.content);
    const sizeEl = document.getElementById('fileSize');
    if (sizeEl) sizeEl.textContent = formatBytes(data.size);
    initEditor(data.content, path);
    if (isMarkdown(path)) {
      const preview = document.getElementById('mdPreview');
      if (preview) preview.innerHTML = renderMarkdownPreview(data.content);
    }
  } catch {
    const ec = document.getElementById('editorContent');
    if (ec) ec.innerHTML = '<div class="flex items-center justify-center h-full text-red-400 text-sm">Failed to load file</div>';
  }
}

// Track the change handler so we can detach it when reusing the instance
let _cmChangeHandler = null;

function initEditor(content, path) {
  const container = document.getElementById('editorContent');
  if (!container) return;

  if (typeof CodeMirror !== 'undefined') {
    try {
      const existingCm = Store.get('cmEditor');

      if (existingCm && existingCm.getWrapperElement()) {
        if (_cmChangeHandler) existingCm.off('change', _cmChangeHandler);
        container.appendChild(existingCm.getWrapperElement());
        existingCm.setValue(content);
        existingCm.setOption('mode', getCmMode(path));
        existingCm.clearHistory();
        _cmChangeHandler = () => {
          const val = existingCm.getValue();
          const dirty = val !== Store.get('openFileContent');
          Store.set('fileDirty', dirty);
          const badge = document.getElementById('fileDirtyBadge');
          const btn = document.getElementById('btnSave');
          if (badge) badge.style.display = dirty ? '' : 'none';
          if (btn) btn.disabled = !dirty;
          const preview = document.getElementById('mdPreview');
          if (preview) preview.innerHTML = renderMarkdownPreview(val);
        };
        existingCm.on('change', _cmChangeHandler);
        existingCm.refresh();
        return;
      }

      const cm = CodeMirror(container, {
        value: content,
        mode: getCmMode(path),
        theme: 'material-darker',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
        indentWithTabs: false,
      });
      Store.set('cmEditor', cm);
      _cmChangeHandler = () => {
        const val = cm.getValue();
        const dirty = val !== Store.get('openFileContent');
        Store.set('fileDirty', dirty);
        const badge = document.getElementById('fileDirtyBadge');
        const btn = document.getElementById('btnSave');
        if (badge) badge.style.display = dirty ? '' : 'none';
        if (btn) btn.disabled = !dirty;
        const preview = document.getElementById('mdPreview');
        if (preview) preview.innerHTML = renderMarkdownPreview(val);
      };
      cm.on('change', _cmChangeHandler);
      return;
    } catch {}
  }

  // Fallback: plain textarea
  const ta = document.createElement('textarea');
  ta.className = 'w-full h-full bg-[#08090C] border-0 outline-none text-xs text-gray-300 font-mono p-4 resize-none';
  ta.value = content;
  ta.addEventListener('input', () => {
    const dirty = ta.value !== Store.get('openFileContent');
    Store.set('fileDirty', dirty);
    const badge = document.getElementById('fileDirtyBadge');
    const btn = document.getElementById('btnSave');
    if (badge) badge.style.display = dirty ? '' : 'none';
    if (btn) btn.disabled = !dirty;
  });
  container.appendChild(ta);
}

export async function saveFile() {
  const openPath = Store.get('openFilePath');
  if (!openPath || !Store.get('fileDirty')) return;

  const cm = Store.get('cmEditor');
  const content = cm ? cm.getValue() :
    document.getElementById('editorContent')?.querySelector('textarea')?.value;
  if (content === undefined) return;

  const btn = document.getElementById('btnSave');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

  try {
    const res = await fetch('/api/files/write', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: openPath, content }),
    });
    if (!res.ok) throw new Error('Save failed');
    const data = await res.json();
    Store.batch({ openFileContent: content, fileDirty: false });
    const badge = document.getElementById('fileDirtyBadge');
    if (badge) badge.style.display = 'none';
    if (btn) btn.textContent = 'Save';
    const sizeEl = document.getElementById('fileSize');
    if (sizeEl) sizeEl.textContent = formatBytes(data.size);
    toast('Saved ' + openPath.split('/').pop(), 'success');
  } catch {
    toast('Failed to save file', 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Save'; }
  }
}

// Setup: load roots when files workspace is first shown
export function setupFiles() {
  Store.on('activeWorkspace', (ws) => {
    if (ws === 'files') {
      const fts = Store.get('fileTreeState');
      if (!fts._loaded) loadFileRoots();
    }
  });
}
