# Landing Page Output Template

Use this format when generating full landing page implementations.

---

## [Page Name] - Landing Page

### Overview

| Attribute | Value |
|-----------|-------|
| **Page Type** | [Lead Gen / SaaS / E-commerce / Event] |
| **Business Type** | [B2B / B2C] |
| **Target Audience** | [Brief description] |
| **Primary Goal** | [Conversion action] |
| **Visual Style** | [Style direction from frontend-design] |

---

### Complete Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title]</title>
  <!-- Styles (Tailwind CDN or custom CSS) -->
</head>
<body>
  <!-- Full page markup with copy integrated -->
</body>
</html>
```

OR for React:

```tsx
// [ComponentName].tsx
import React from 'react';

export default function LandingPage() {
  return (
    // Full component with copy integrated
  );
}
```

---

### Copy Reference

Quick access to all copy for editing:

#### Hero Section
- **Headline:** [Text]
- **Subheadline:** [Text]
- **Primary CTA:** [Button text]
- **Secondary CTA:** [Link text if any]
- **Trust element:** [Text if any]

#### Problem Section
- **Section headline:** [Text]
- **Pain point 1:** [Text]
- **Pain point 2:** [Text]
- **Pain point 3:** [Text]

#### Solution/Benefits Section
- **Section headline:** [Text]
- **Benefit 1 title:** [Text]
- **Benefit 1 description:** [Text]
- **Benefit 2 title:** [Text]
- **Benefit 2 description:** [Text]
- **Benefit 3 title:** [Text]
- **Benefit 3 description:** [Text]

#### Social Proof Section
- **Section headline:** [Text]
- **Testimonial 1:** [Quote + Attribution]
- **Testimonial 2:** [Quote + Attribution]
- **Metrics:** [Stats if any]

#### Features Section (if applicable)
- **Section headline:** [Text]
- **Feature 1:** [Title + Description]
- **Feature 2:** [Title + Description]
- **Feature 3:** [Title + Description]

#### FAQ Section
- **Q1:** [Question]
- **A1:** [Answer]
- **Q2:** [Question]
- **A2:** [Answer]
- **Q3:** [Question]
- **A3:** [Answer]

#### Final CTA Section
- **Headline:** [Text]
- **Supporting text:** [Text]
- **CTA button:** [Text]
- **Trust element:** [Text]

---

### Implementation Notes

**Technical requirements:**
- [Framework/dependencies needed]
- [API integrations if any]
- [Form submission handling]

**Analytics/Tracking:**
- [Recommended events to track]
- [Conversion goals to configure]

**A/B testing opportunities:**
- [Element 1 to test]
- [Element 2 to test]

---

### Conversion Checklist

- [ ] Primary CTA visible above fold
- [ ] Value proposition clear within 5 seconds
- [ ] Social proof present and credible
- [ ] Objections addressed
- [ ] Mobile responsive
- [ ] Page loads under 3 seconds
- [ ] Form fields minimized
- [ ] Trust signals visible
- [ ] Single conversion goal maintained

---

### Responsive Breakpoints

| Breakpoint | Layout Notes |
|------------|--------------|
| Mobile (<640px) | [Layout description] |
| Tablet (640-1024px) | [Layout description] |
| Desktop (>1024px) | [Layout description] |

---

## Batch Output Format

When generating multiple page variations:

### Variation A: [Variation Name]
**Focus:** [What's different]
```html
[Code for variation A]
```

### Variation B: [Variation Name]
**Focus:** [What's different]
```html
[Code for variation B]
```

---

## Assets Needed

| Asset | Specifications | Notes |
|-------|----------------|-------|
| Hero image | [Dimensions, format] | [Description] |
| Logo | [Dimensions] | [If needed] |
| Icons | [Style/source] | [Section usage] |
| Testimonial photos | [Dimensions] | [If real photos] |
