# Orchestrated Agent System (Claude Code)

This runbook enables one Orchestrator agent to coordinate specialist sub-agents to produce high-quality, locally-optimized content consistently.

## Agents to create (/agents)
Create these as Claude Code agents. Keep names exactly as shown for clean handoffs.

### 1) Orchestrator – Campaign Manager
- Mission: Own the brief → outline → draft → optimize → QA pipeline; assign tasks, enforce gates, assemble final package.
- Success: Every deliverable passes SEO and Brand gates and includes internal links and CTA.

### 2) Strategist – Content Strategy
- Mission: Turn a topic into a structured brief (audience, intent, keyword, angle, internal links, CTA).

### 3) SEO Specialist – Local SEO
- Mission: Build search intent map, outline, schema/FAQ, internal linking plan; optimize titles/metas.

### 4) Brand Guardian – Voice & Compliance
- Mission: Enforce tone, claims, and prohibited phrasing per brand docs.

### 5) Lead Writer – Drafting
- Mission: Produce outline → draft → revisions; incorporate SEO and Brand feedback.

### 6) QA Editor – Gatekeeper
- Mission: Run the publish checklist (E-E-A-T, citations, links, readability, accessibility) and either pass or return with fixes.

### 7) Localizer – Location Variants
- Mission: Adapt canonical pages to each city/ZIP; inject local examples and regulations.

### 8) Distribution – Atomization
- Mission: Create social/email snippets and a short video script after approval.

### 9) Analyst – Performance
- Mission: Recommend title/meta tests and refreshes based on CTR/traffic trends.

## Operating protocol (task contract)
Use this contract for all handoffs. The Orchestrator asks sub-agents to respond with one of these JSON objects (brief explanation allowed).

```json
{
  "type": "brief|outline|draft|seo_review|brand_review|qa_report|localization_plan|distribution_pack",
  "meta": {
    "service": "home maintenance",
    "location": "Springfield, IL",
    "primaryKeyword": "home maintenance Springfield",
    "secondaryKeywords": ["professional home services", "home service near me"],
    "intent": "transactional",
    "persona": "homeowner"
  },
  "content": {},
  "status": "complete|needs_changes",
  "notes": "short human-readable notes if needed"
}
```

Field expectations by type:
- brief.content: { audience, problem, promise, proof, CTA, internalLinks[], sources[] }
- outline.content: { h1, sections: [{h2, bullets[], faq[]}] }
- draft.content: { sections: [{heading, html}], titleTag, metaDescription }
- seo_review.content: { issues[], fixes[], schema: {faqJsonLd} }
- brand_review.content: { violations[], rewrites[] }
- qa_report.content: { checks: [{name, pass, fix}], overallPass }
- localization_plan.content: { variants: [{location, localAngles[], requiredEdits[]}] }
- distribution_pack.content: { posts: [], emails: [], videoScript: "..." }

## Orchestrator playbook (copy-paste)
Use this as the Orchestrator agent’s description or first message.

```markdown
You are the Campaign Orchestrator. Drive a gated pipeline: Strategist → SEO → Writer → Brand → SEO (verify) → QA → Distribution.
Rules:
- Never skip gates. Require explicit JSON artifacts at each step per the task contract.
- Track status as: BRIEF → OUTLINE → DRAFT → SEO_OK → BRAND_OK → QA_PASS.
- If any gate fails, route back with precise fixes and request an updated JSON artifact.
- Enforce internal links (≥3 cluster links) and a clear CTA.
- After QA_PASS, trigger Distribution for atomization.
When you need work from a sub-agent, address them explicitly and restate the current JSON artifact and asks.
```

## Kickoff prompt (for a new article)
Paste this in a new Claude chat with your agents loaded.

```markdown
Goal: Create a service page that converts for “home maintenance Springfield”.
Context: {{COMPANY_NAME}} brand and service area per repo docs.
Constraints: WordPress-ready HTML sections, internal links to 3+ related {{COMPANY_NAME}} pages, JSON-LD FAQ.

@Strategist produce a brief JSON per contract. Inputs:
- service: home maintenance
- location: Springfield, IL
- primaryKeyword: home maintenance Springfield
- persona: homeowner
Also propose 3 internal links and a CTA.
```

Then proceed stepwise:
- Orchestrator → @SEO Specialist: turn brief into outline JSON with sections and FAQs.
- Orchestrator → @Lead Writer: produce draft JSON with HTML sections, title, meta.
- Orchestrator → @Brand Guardian: review; return brand_review JSON.
- Orchestrator → @SEO Specialist: verify; return seo_review JSON with schema.
- Orchestrator → @QA Editor: run checks; return qa_report JSON. If overallPass=false, loop fixes.
- Orchestrator → @Distribution: generate distribution_pack JSON.

## Ready-made checklists

### QA checklist
- H1 present, hierarchy valid (H2/H3).
- Title 55–60 chars; meta 150–160 chars.
- Primary keyword in H1, intro, and one H2.
- 3+ internal links to relevant {{COMPANY_NAME}} pages; anchors varied.
- Facts cited or marked for review; no medical/legal claims.
- Reading level: 7th–9th grade; sentences < 25 words average.
- Accessibility: descriptive alt-text suggestions present.

### Brand guardrails
- Tone: confident, neighborly, clear.
- Prohibited: fearmongering, unverifiable superlatives.
- Always include guarantee language and next-step CTA.

## Optional: wire to your webhook (later)
After QA_PASS, you can call the existing webhook to:
- Create/update Google Doc with the HTML sections.
- Share to reviewer.
- Create/update Airtable record with status and links.
See `automation/api/{{COMPANY_NAME}}_File_Management_API_Reference.md` for request bodies.

---
Use this runbook as your working reference. Start by creating the nine agents and pasting the Orchestrator playbook and kickoff prompt.
