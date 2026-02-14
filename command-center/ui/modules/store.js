// Centralized observable state for Command Center UI
// All UI modules subscribe to relevant keys and react to changes.

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

  on(key, cb) {
    if (!this._listeners.has(key)) this._listeners.set(key, new Set());
    this._listeners.get(key).add(cb);
    return () => this._listeners.get(key)?.delete(cb);
  },

  set(key, val) {
    this.state[key] = val;
    const cbs = this._listeners.get(key);
    if (cbs) cbs.forEach(cb => cb(val, key));
  },

  get(key) {
    return this.state[key];
  },

  batch(updates) {
    const keys = Object.keys(updates);
    for (const k of keys) this.state[k] = updates[k];
    for (const k of keys) {
      const cbs = this._listeners.get(k);
      if (cbs) cbs.forEach(cb => cb(this.state[k], k));
    }
  },
};

export default Store;
