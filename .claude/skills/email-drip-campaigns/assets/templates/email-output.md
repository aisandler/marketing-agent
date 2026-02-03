# Email Output Template

Use this format when outputting full email copy.

---

## Email [N]: [Theme Name]

**Position in sequence:** Email [N] of [Total]
**Send timing:** [Day X / Trigger description]
**Goal:** [What this email accomplishes]

---

### Subject Line Options

**Primary:**
> [Main subject line]

**A/B Variant:**
> [Alternative approach]

**Backup:**
> [Third option if needed]

---

### Preview Text

> [Preview/preheader text that extends the subject line - 40-60 characters ideal]

---

### Email Body

[Opening line - hook or personalized greeting]

[Body paragraph 1 - main message]

[Body paragraph 2 - supporting point or value]

[Optional: Bullet points for lists]
- [Point 1]
- [Point 2]
- [Point 3]

[Transition to CTA]

**[CTA BUTTON: Button Text Here]**

[Optional: Closing line]

[Signature]
[Name]
[Title/Role]

---

### CTA Details

**Button text:** [Exact text on button]
**Destination:** [Where it links to]
**Tracking:** [UTM parameters or campaign tags]

---

### Personalization Tokens

| Token | Example | Fallback |
|-------|---------|----------|
| `{First_name}` | Sarah | there |
| `{Company}` | Acme Inc | your company |
| [Other tokens] | [Example] | [Fallback] |

---

### Design Notes

**Layout:** [Single column / Two column / etc.]
**Images:** [None / Hero image / Product screenshot / etc.]
**Mobile considerations:** [Any specific notes]

---

### Technical Notes

**From name:** [Sender name]
**From email:** [sender@domain.com]
**Reply-to:** [If different from sender]

**Segment/Audience:** [Who receives this]
**Exclusions:** [Who should NOT receive]

---

## Batch Email Output Format

When generating multiple emails, use this condensed format:

---

### Email 1: [Theme]
**Timing:** [Day X]

**Subject:** [Subject line]
**Preview:** [Preview text]

**Body:**
[Full email copy]

**CTA:** [Button text] → [Destination]

---

### Email 2: [Theme]
**Timing:** [Day X]

**Subject:** [Subject line]
**Preview:** [Preview text]

**Body:**
[Full email copy]

**CTA:** [Button text] → [Destination]

---

[Continue for remaining emails...]

---

## Campaign Summary

After outputting all emails, include:

### Quick Reference

| # | Theme | Timing | Subject | CTA |
|---|-------|--------|---------|-----|
| 1 | [Theme] | Day 0 | [Subject] | [CTA] |
| 2 | [Theme] | Day X | [Subject] | [CTA] |
| 3 | [Theme] | Day X | [Subject] | [CTA] |

### Sequence Flow

```
[Visual representation of sequence timing]

Day 0 ──► Day X ──► Day X ──► Day X ──► [Goal]
  │         │         │         │
Email 1   Email 2   Email 3   Email 4
```

### Final Checklist

- [ ] All subject lines are unique and compelling
- [ ] Preview texts extend (not repeat) subjects
- [ ] CTAs are clear and actionable
- [ ] Personalization tokens have fallbacks
- [ ] Tone is consistent across sequence
- [ ] Timing makes sense for audience
- [ ] Exit conditions are defined
