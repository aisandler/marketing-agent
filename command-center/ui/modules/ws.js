// WebSocket connection + message routing

import Store from './store.js';
import { toast } from './toast.js';

let reconnTimer = null;

export function connectWS() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(proto + '://' + location.host + '/ws');

  ws.onopen = () => {
    Store.batch({ connected: true, ws });
    ws.send(JSON.stringify({ type: 'sync' }));
    if (reconnTimer) { clearInterval(reconnTimer); reconnTimer = null; }
  };

  ws.onclose = () => {
    Store.batch({ connected: false, ws: null });
    if (!reconnTimer) reconnTimer = setInterval(connectWS, 3000);
  };

  ws.onerror = () => ws.close();
  ws.onmessage = e => {
    try { routeMessage(JSON.parse(e.data)); } catch {}
  };
}

export function wsSend(msg) {
  const ws = Store.get('ws');
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

// --- Message handlers (imported by other modules) ---
const handlers = new Map();

export function registerHandler(type, fn) {
  handlers.set(type, fn);
}

function routeMessage(msg) {
  const handler = handlers.get(msg.type);
  if (handler) {
    handler(msg);
  } else if (msg.type === 'error') {
    toast(msg.message, 'error');
  }
}
