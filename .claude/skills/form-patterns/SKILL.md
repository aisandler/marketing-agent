---
name: form-patterns
description: Design-system agnostic form layouts and validation UX patterns. Use when building forms, handling validation, or composing input fields. Use when user asks "form validation", "error messages", "input layout", or "form accessibility". Provides field composition rules, validation timing, keyboard patterns, and accessibility guidelines. Pairs with any visual system - this skill handles form mechanics, your visual system handles input styling.
license: MIT - See LICENSE.txt
tags:
  - forms
  - frontend
  - ui-core
archetype: toolkit
---

# Form Patterns

A design-system agnostic skill for form layouts, validation UX, and input composition. This skill handles form BEHAVIOR and STRUCTURE; pair it with a visual system for input styling.

## Form Philosophy

### Design Principles

1. **Progressive Disclosure of Errors**
   - Don't show errors before user has a chance to input
   - Validate on blur for first interaction, on change after
   - Keep errors visible until fixed

2. **Clear Field Composition**
   - Every input needs a label (not just placeholder)
   - Help text explains, error text corrects
   - Consistent vertical rhythm

3. **Keyboard-First Design**
   - Tab order follows visual order
   - Enter submits, Escape cancels
   - No keyboard traps

4. **Accessible by Default**
   - Labels connected to inputs
   - Error states announced
   - Focus management on errors

## Field Composition

### Standard Field Structure

```
┌─────────────────────────────────┐
│ Label *                         │  <- Required indicator
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Input                       │ │  <- The input itself
│ └─────────────────────────────┘ │
│ Help text goes here             │  <- Optional help text
│ Error message                   │  <- Conditional error
└─────────────────────────────────┘
```

### Implementation

```tsx
interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: React.ReactNode; // The input
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  helpText,
  error,
  children
}) => (
  <div className="space-y-1.5">
    {/* Label */}
    <label className="block text-sm font-medium">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    {/* Input (passed as children) */}
    {children}

    {/* Help text (hidden when error) */}
    {helpText && !error && (
      <p className="text-xs text-slate-500">{helpText}</p>
    )}

    {/* Error message */}
    {error && (
      <p className="text-xs text-red-500" role="alert">
        {error}
      </p>
    )}
  </div>
);
```

### Field Spacing

| Context | Gap Between Fields |
|---------|-------------------|
| Compact form | `gap-3` (12px) |
| Standard form | `gap-4` (16px) |
| Spacious form | `gap-6` (24px) |

**Full reference:** See `references/input-composition.md`

## Form Layouts

### Vertical (Default)

```tsx
<form className="space-y-4">
  <FormField label="Email">
    <input type="email" />
  </FormField>
  <FormField label="Password">
    <input type="password" />
  </FormField>
  <button type="submit">Submit</button>
</form>
```

### Horizontal (Label Left)

```tsx
<form className="space-y-4">
  <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
    <label className="text-sm font-medium pt-2">Email</label>
    <input type="email" />
  </div>
</form>
```

### Inline (Search, Filters)

```tsx
<form className="flex gap-2">
  <input type="text" placeholder="Search..." className="flex-1" />
  <button type="submit">Search</button>
</form>
```

### Multi-Column

```tsx
<form className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <FormField label="First Name">
      <input />
    </FormField>
    <FormField label="Last Name">
      <input />
    </FormField>
  </div>
  <FormField label="Email">
    <input type="email" />
  </FormField>
</form>
```

**Full reference:** See `references/form-layouts.md`

## Validation UX

### Validation Timing

| Event | When to Validate |
|-------|-----------------|
| On blur (first time) | User leaves field for first time |
| On change (after error) | After field has shown error once |
| On submit | Always validate all fields |

### Implementation Pattern

```tsx
const useFieldValidation = (validate: (value: string) => string | null) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    // Only validate on change if already touched and had error
    if (touched && error) {
      setError(validate(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  return {
    value,
    error: touched ? error : null,
    onChange: handleChange,
    onBlur: handleBlur
  };
};
```

### Error Message Guidelines

**DO:**
- Be specific: "Email must include @" not "Invalid email"
- Be helpful: "Password must be 8+ characters" not "Too short"
- Be immediate: Show as soon as validation fails
- Be persistent: Keep visible until fixed

**DON'T:**
- Use technical jargon: "Regex validation failed"
- Be vague: "Invalid input"
- Disappear before user reads

### Error Display Patterns

```tsx
// Inline error (below field)
<p className="text-xs text-red-500 mt-1">{error}</p>

// Error with icon
<div className="flex items-center gap-1 text-red-500 mt-1">
  <AlertCircle size={12} />
  <span className="text-xs">{error}</span>
</div>

// Field border change
<input className={error ? 'border-red-500' : 'border-slate-700'} />
```

**Full reference:** See `references/validation-ux.md`

## Submit Button States

### State Machine

```
idle → loading → success/error → idle
```

### Implementation

```tsx
type ButtonState = 'idle' | 'loading' | 'success' | 'error';

const SubmitButton: React.FC<{
  state: ButtonState;
  onClick: () => void;
}> = ({ state, onClick }) => (
  <button
    type="submit"
    disabled={state === 'loading'}
    onClick={onClick}
    className="relative flex items-center justify-center"
  >
    {/* Loading spinner (centered) */}
    {state === 'loading' && (
      <Loader2 className="absolute animate-spin" size={16} />
    )}

    {/* Button text (invisible during loading) */}
    <span className={state === 'loading' ? 'invisible' : ''}>
      {state === 'success' ? 'Saved!' : 'Save'}
    </span>
  </button>
);
```

### Guidelines

1. Disable button while loading
2. Keep button same width (use invisible text trick)
3. Show success briefly (1-2s) then return to idle
4. On error, re-enable button and show error message

## Keyboard Patterns

### Standard Behaviors

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |
| `Enter` | Submit form (in text input) |
| `Escape` | Cancel/close (in modal forms) |
| `Space` | Toggle checkbox/switch |
| `Arrow keys` | Navigate radio groups, selects |

### Tab Order

```tsx
// Natural order (no tabIndex needed)
<input /> // tabIndex: 0 (implicit)
<input /> // tabIndex: 0 (implicit)
<button /> // tabIndex: 0 (implicit)

// Skip element
<div tabIndex={-1}>Not focusable by tab</div>

// Custom order (avoid if possible)
<input tabIndex={2} />
<input tabIndex={1} /> // Focused first
```

### Enter to Submit

```tsx
// Form element handles this automatically
<form onSubmit={handleSubmit}>
  <input /> {/* Enter here submits */}
  <button type="submit">Submit</button>
</form>

// For non-form containers
<div onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}>
```

**Full reference:** See `references/keyboard-patterns.md`

## Accessibility

### Labels

```tsx
// Explicit label (preferred)
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Implicit label
<label>
  Email
  <input type="email" />
</label>

// aria-label for icon-only inputs
<input aria-label="Search" placeholder="Search..." />
```

### Error Announcement

```tsx
// role="alert" announces to screen readers
<p role="alert" className="text-red-500">
  {error}
</p>

// aria-describedby connects error to input
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
<p id="email-error" role="alert">{error}</p>
```

### Required Fields

```tsx
// Visual + semantic
<label>
  Email <span aria-hidden="true">*</span>
</label>
<input required aria-required="true" />
```

### Focus Management

```tsx
// Focus first error on submit
const handleSubmit = () => {
  const errors = validate(formData);
  if (Object.keys(errors).length > 0) {
    const firstErrorField = document.getElementById(
      Object.keys(errors)[0]
    );
    firstErrorField?.focus();
  }
};
```

**Full reference:** See `references/accessibility.md`

## Form Sections

### Grouped Fields

```tsx
<fieldset className="space-y-4">
  <legend className="text-sm font-semibold mb-2">
    Personal Information
  </legend>
  <FormField label="First Name">
    <input />
  </FormField>
  <FormField label="Last Name">
    <input />
  </FormField>
</fieldset>
```

### Collapsible Sections

```tsx
<SoftSection title="Advanced Options" defaultOpen={false}>
  <div className="space-y-4">
    <FormField label="Custom ID">
      <input />
    </FormField>
  </div>
</SoftSection>
```

## Visual Skill Pairing

This skill provides **form mechanics**. Pair with any visual design skill for **input styling**.

### Layering Pattern

1. Apply form structure (this skill): composition, validation, accessibility
2. Apply visual styling (your visual skill): input colors, borders, effects

```tsx
// Form structure (from form-patterns)
<FormField label="Email" error={error}>
  <input type="email" className="w-full px-4 py-3" />
</FormField>

// + Visual styling (from your visual skill)
<FormField label="Email" error={error}>
  <input type="email" className="w-full px-4 py-3
                                  bg-[skill]-dark-300 border-[skill]-border rounded-[skill]
                                  focus:ring-2 focus:ring-[skill]-primary/50" />
</FormField>
```

### What Each Skill Provides

| form-patterns | Your visual skill |
|---------------|-------------------|
| Field composition | Input backgrounds |
| Validation timing | Border styles |
| Error display | Focus rings |
| Accessibility (ARIA) | Typography tokens |
| Keyboard patterns | Transition effects |

To load a visual skill: `/skill [visual-skill-name]`

## Anti-Patterns

### NEVER:

1. **Validate on every keystroke**
   ```tsx
   // WRONG - too aggressive
   <input onChange={(e) => setError(validate(e.target.value))} />

   // CORRECT - validate on blur first
   <input onBlur={() => setError(validate(value))} />
   ```

2. **Use placeholder as label**
   ```tsx
   // WRONG - placeholder disappears
   <input placeholder="Email" />

   // CORRECT - visible label
   <label>Email</label>
   <input placeholder="you@example.com" />
   ```

3. **Hide errors too quickly**
   ```tsx
   // WRONG - error disappears
   {error && <p>{error}</p>}

   // CORRECT - error persists until fixed
   {touched && error && <p>{error}</p>}
   ```

4. **Disable submit without explanation**
   ```tsx
   // WRONG - user doesn't know why
   <button disabled={!isValid}>Submit</button>

   // CORRECT - show validation errors
   <button type="submit">Submit</button>
   {/* Errors explain what to fix */}
   ```

5. **Break tab order**
   ```tsx
   // WRONG - confusing navigation
   <input tabIndex={3} />
   <input tabIndex={1} />
   <input tabIndex={2} />

   // CORRECT - natural order
   <input />
   <input />
   <input />
   ```

### ALWAYS:

1. Use visible labels (not just placeholders)
2. Validate on blur first, then on change
3. Keep errors visible until fixed
4. Show loading state on submit button
5. Focus first error field on submit
6. Test with keyboard only

## File Reference

| File | Purpose |
|------|---------|
| `references/form-layouts.md` | Vertical, horizontal, inline layouts |
| `references/validation-ux.md` | When and how to show errors |
| `references/input-composition.md` | Label + input + help + error |
| `references/keyboard-patterns.md` | Tab order, shortcuts |
| `references/accessibility.md` | ARIA, labels, focus management |
| `assets/patterns/FormField.tsx` | Field composition template |
| `assets/patterns/FormSection.tsx` | Grouped fields template |
| `assets/patterns/InlineForm.tsx` | Search/filter form template |
