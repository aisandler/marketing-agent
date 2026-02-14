// Centralized observable state for Command Center UI
// All UI modules subscribe to relevant keys and react to changes.

const STORAGE_KEY = 'cc-state';
const PERSIST_KEYS = ['sessions', 'activeSessionId', 'activeWorkspace'];

const Store = {
  state: {
    agents: [],
    teams: [],
    sessions: new Map(),
    activeSessionId: null,
    activeWorkspace: 'operations',
    agentFlyoutOpen: false,
    connected: false,
    ws: null,
    _pendingAgent: null,
    // File browser
    fileTreeState: {},
    openFilePath: null,
    openFileContent: null,
    fileDirty: false,
    cmEditor: null,
    // Tool progress tracking
    toolProgress: new Map(),
    // Context health
    contextHealth: null,
    intel: null,
    // Image queue
    imageQueue: null,
    // Sub-agent tracking (Phase 2)
    subSessions: new Map(),
    // Command palette
    commandPaletteOpen: false,
  },

  _listeners: new Map(),
  _persistTimer: null,

  on(key, cb) {
    if (!this._listeners.has(key)) this._listeners.set(key, new Set());
    this._listeners.get(key).add(cb);
    return () => this._listeners.get(key)?.delete(cb);
  },

  set(key, val) {
    this.state[key] = val;
    const cbs = this._listeners.get(key);
    if (cbs) cbs.forEach(cb => cb(val, key));
    if (PERSIST_KEYS.includes(key)) this._schedulePersist();
  },

  get(key) {
    return this.state[key];
  },

  batch(updates) {
    const keys = Object.keys(updates);
    for (const k of keys) this.state[k] = updates[k];
    let needsPersist = false;
    for (const k of keys) {
      const cbs = this._listeners.get(k);
      if (cbs) cbs.forEach(cb => cb(this.state[k], k));
      if (PERSIST_KEYS.includes(k)) needsPersist = true;
    }
    if (needsPersist) this._schedulePersist();
  },

  // --- Persistence ---

  // Debounced save — coalesce rapid mutations (streaming, tool results)
  _schedulePersist() {
    if (this._persistTimer) return;
    this._persistTimer = setTimeout(() => {
      this._persistTimer = null;
      this._persist();
    }, 500);
  },

  // Force an immediate persist (call on session_result, session close, etc.)
  persistNow() {
    if (this._persistTimer) { clearTimeout(this._persistTimer); this._persistTimer = null; }
    this._persist();
  },

  _persist() {
    try {
      const sessions = this.state.sessions;
      const serialized = [];
      for (const [id, s] of sessions) {
        serialized.push([id, {
          agent: s.agent,
          messages: s.messages,
          status: s.status,
          cost: s.cost,
          turns: s.turns,
          startedAt: s.startedAt,
        }]);
      }
      const data = {
        sessions: serialized,
        activeSessionId: this.state.activeSessionId,
        activeWorkspace: this.state.activeWorkspace,
        _savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage full or unavailable — silently skip
    }
  },

  hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      // Restore sessions — mark in-flight ones as completed since the backend is gone
      if (data.sessions && Array.isArray(data.sessions)) {
        const sessions = this.state.sessions;
        for (const [id, s] of data.sessions) {
          const status = (s.status === 'running' || s.status === 'starting' || s.status === 'waiting_permission')
            ? 'completed' : s.status;
          sessions.set(id, {
            agent: s.agent || { name: 'unknown', displayName: 'Unknown' },
            messages: s.messages || [],
            status,
            cost: s.cost || 0,
            turns: s.turns || 0,
            startedAt: s.startedAt || Date.now(),
            streamBuf: '',
          });
        }
      }

      if (data.activeSessionId && this.state.sessions.has(data.activeSessionId)) {
        this.state.activeSessionId = data.activeSessionId;
      }
      if (data.activeWorkspace) {
        this.state.activeWorkspace = data.activeWorkspace;
      }
    } catch (e) {
      // Corrupt storage — start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};

export default Store;
