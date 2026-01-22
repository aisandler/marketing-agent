# Deprecated: Voice System Quick Reference Card

> Status: Deprecated — The voice feature is paused and not in active use.
> Use agent‑first orchestration via Claude Code instead.
> See: `docs/orchestration-implementation-guide.md` and `docs/system/ORCHESTRATED_AGENT_SYSTEM.md`.

**🎤 {{COMPANY_NAME}} Voice-to-Content Planning System**  
**Quick Start Guide**

---

## ⚡ **30-Second Startup**

```bash
cd /Users/adamsandler/projects/marketing-team-base
node serve_gui.js
```
→ Open: http://localhost:3000

---

## 🎤 **Voice Commands**

### Basic Structure
```
"I need [COUNT] [TYPE] about [THEME] for [LOCATION]"
```

### Examples
```
"I need 5 social media posts about winter pest prevention for Illinois"
"Create 3 blog posts about fall rodent control for Wisconsin"  
"Give me 8 social media posts about spider prevention"
```

---

## 🔧 **Key Components**

| Component | Purpose | Status |
|-----------|---------|---------|
| `serve_gui.js` | HTTP server + voice API | ✅ Running |
| `client-interactive-dashboard.html` | GUI interface | ✅ Working |
| `automation/sync_bridge.js` | Claude Code sync | ✅ Active |
| `/tmp/client_planning_state.json` | Shared state | ✅ Persistent |

---

## 📊 **Workflow**

1. **🎤 Speak** → Content requirements
2. **🧠 Process** → Intelligent parsing  
3. **📝 Generate** → Unique {{COMPANY_NAME}} content
4. **📋 Review** → GUI table editing
5. **📤 Submit** → Direct to Airtable

---

## 🚨 **Quick Fixes**

| Issue | Solution |
|-------|----------|
| Voice not working | Grant microphone permissions |
| GUI not loading | Restart: `node serve_gui.js` |
| Content not appearing | Check http://localhost:3000 |
| Airtable errors | Verify webhook endpoint |

---

## 🎯 **Production Ready**

✅ Voice recognition working  
✅ Smart content generation  
✅ Claude Code integration  
✅ Airtable submission  
✅ Persistent state  
✅ Clear/refresh fixed  
✅ Multi-tab Airtable views  

---

**📖 Complete Documentation**: `VOICE_GUI_SYSTEM_COMPLETE_GUIDE.md`  
**🔗 Dashboard**: http://localhost:3000
