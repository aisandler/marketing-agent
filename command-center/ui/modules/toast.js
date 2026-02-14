// Toast notification system

const TOAST_COLORS = {
  info: 'border-l-2 border-l-blue-400 bg-[#1A1B20]',
  success: 'border-l-2 border-l-emerald-400 bg-[#1A1B20]',
  error: 'border-l-2 border-l-red-400 bg-[#1A1B20]',
};

export function toast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast px-4 py-2.5 rounded-lg text-xs text-gray-300 shadow-2xl border border-white/5 ' + (TOAST_COLORS[type] || TOAST_COLORS.info);
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
