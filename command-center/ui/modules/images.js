// Image Studio workspace — queue management, generation, cost tracking

import Store from './store.js';
import { registerHandler } from './ws.js';
import { wsSend } from './ws.js';
import { toast } from './toast.js';

function fmtCost(n) { return '$' + (n || 0).toFixed(4); }

const STAT_COLORS = {
  amber: '#f59e0b', blue: '#60a5fa', green: '#10b981', red: '#ef4444', purple: '#a78bfa',
};

// --- Performance: lazy-load image thumbnails via IntersectionObserver ---
let _imgObserver = null;
function getImgObserver() {
  if (_imgObserver) return _imgObserver;
  _imgObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) { img.src = src; img.removeAttribute('data-src'); }
        _imgObserver.unobserve(img);
      }
    }
  }, { rootMargin: '200px' });
  return _imgObserver;
}

export function renderImageStudio() {
  const container = document.getElementById('imageStudio');
  if (!container) return;

  const queue = Store.get('imageQueue');

  if (!queue) {
    container.innerHTML =
      '<div class="flex flex-col items-center justify-center gap-4 py-16 text-gray-500">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>' +
          '<circle cx="8.5" cy="8.5" r="1.5"/>' +
          '<polyline points="21 15 16 10 5 21"/>' +
        '</svg>' +
        '<h3 class="text-sm font-semibold text-gray-300">Image Studio</h3>' +
        '<p class="text-xs text-center max-w-sm">AI image generation queue, gallery, and cost tracking.</p>' +
        '<p class="text-[10px] text-gray-600">Requires AIRTABLE_API_KEY and OPENROUTER_API_KEY in .env</p>' +
        '<button class="px-4 py-2 text-xs font-bold rounded-lg bg-white/5 text-gray-400 cursor-pointer border border-white/5 hover:text-white hover:bg-white/10 transition-all" onclick="window.CC.refreshImages()">Check Queue Status</button>' +
      '</div>';
    return;
  }

  let h = '';

  // Stats bar
  h += '<div class="flex gap-4 mb-4">' +
    stat('Pending', queue.pending, 'amber') +
    stat('Processing', queue.processing, 'blue') +
    stat('Completed', queue.completed, 'green') +
    stat('Failed', queue.failed, 'red') +
    stat('Total Cost', fmtCost(queue.totalCost), 'purple') +
  '</div>';

  // Actions
  h += '<div class="flex gap-2 mb-4">' +
    '<button class="px-3 py-1.5 text-[10px] font-bold rounded-md bg-white/5 text-gray-400 cursor-pointer border border-white/5 hover:text-white hover:bg-white/10 transition-all" onclick="window.CC.refreshImages()">Refresh</button>' +
    '<button class="px-3 py-1.5 text-[10px] font-bold rounded-md bg-accent text-white cursor-pointer border-0 hover:brightness-110 transition-all disabled:opacity-40" onclick="window.CC.generateImages()" ' +
      (queue.pending > 0 ? '' : 'disabled') + '>Generate Next (' + queue.pending + ')</button>' +
    '<button class="px-3 py-1.5 text-[10px] font-bold rounded-md bg-white/5 text-gray-400 cursor-pointer border border-white/5 hover:text-white hover:bg-white/10 transition-all" onclick="window.CC.generateImagesDry()">Dry Run</button>' +
  '</div>';

  // Records
  if (queue.records && queue.records.length > 0) {
    h += '<div class="grid grid-cols-2 gap-3">';
    for (const r of queue.records) {
      const statusCls = r.status === 'completed' ? 'ok' : r.status === 'failed' ? 'error' : r.status === 'processing' ? 'running' : 'pending';
      h += '<div class="glass-panel rounded-lg overflow-hidden">' +
        (r.imageUrl
          ? '<img class="w-full h-40 object-cover studio-thumb-lazy" data-src="' + r.imageUrl + '" alt=""/>'
          : '<div class="w-full h-40 bg-[#08090C] flex items-center justify-center">' +
              (r.status === 'processing' ? '<svg class="w-6 h-6 text-gray-600 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4 31.4"/></svg>' : '') +
            '</div>') +
        '<div class="p-2.5">' +
          '<div class="text-xs text-gray-300 truncate mb-1">' + (r.postTopic || 'Untitled') + '</div>' +
          '<span class="ctx-badge text-[9px] font-bold px-1.5 py-0.5 rounded ' + statusCls + '">' + (r.status || 'pending') + '</span>' +
        '</div>' +
      '</div>';
    }
    h += '</div>';
  } else {
    h += '<div class="text-xs text-gray-600 text-center py-6">No image records found in the queue.</div>';
  }

  container.innerHTML = h;

  const observer = getImgObserver();
  container.querySelectorAll('.studio-thumb-lazy').forEach(img => observer.observe(img));
}

function stat(label, value, color) {
  const c = STAT_COLORS[color] || '#71717a';
  return '<div class="glass-panel rounded-lg p-3 flex-1 text-center">' +
    '<div class="text-base font-bold" style="color:' + c + '">' + value + '</div>' +
    '<div class="text-[10px] text-gray-500 mt-0.5">' + label + '</div>' +
  '</div>';
}

export function setupImages() {
  registerHandler('image_queue_status', msg => {
    Store.set('imageQueue', {
      pending: msg.pending || 0,
      processing: msg.processing || 0,
      completed: msg.completed || 0,
      failed: msg.failed || 0,
      totalCost: msg.totalCost || 0,
      records: msg.records || [],
    });
    if (Store.get('activeWorkspace') === 'studio') renderImageStudio();
  });

  registerHandler('image_generation_progress', msg => {
    const queue = Store.get('imageQueue');
    if (!queue) return;
    const record = queue.records?.find(r => r.recordId === msg.recordId);
    if (record) {
      record.status = msg.status;
      if (msg.imageUrl) record.imageUrl = msg.imageUrl;
      if (msg.error) record.error = msg.error;
    }
    if (Store.get('activeWorkspace') === 'studio') renderImageStudio();
    if (msg.status === 'completed') toast('Image generated: ' + (msg.postTopic || ''), 'success');
    if (msg.status === 'failed') toast('Image failed: ' + (msg.error || ''), 'error');
  });

  Store.on('activeWorkspace', ws => {
    if (ws === 'studio') {
      renderImageStudio();
      wsSend({ type: 'image_queue_sync' });
    }
  });
}

export function refreshImages() {
  wsSend({ type: 'image_queue_sync' });
  toast('Refreshing image queue...', 'info');
}

export function generateImages() {
  wsSend({ type: 'image_generate', limit: 1 });
  toast('Starting image generation...', 'info');
}

export function generateImagesDry() {
  wsSend({ type: 'image_generate', dryRun: true });
  toast('Running dry preview...', 'info');
}
