# Form Accessibility

ARIA attributes, labels, focus management, and screen reader support for forms.

## Labels

### Explicit Label (Preferred)

```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Implicit Label

```tsx
<label>
  Email
  <input type="email" />
</label>
```

### Hidden Label (Icon-Only)

```tsx
// Visually hidden but accessible
<label htmlFor="search" className="sr-only">Search</label>
<input id="search" aria-label="Search" placeholder="Search..." />

// sr-only class
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### aria-label Alternative

```tsx
// When no visible label needed
<input aria-label="Search products" placeholder="Search..." />
```

## Required Fields

### Visual + Semantic

```tsx
<label htmlFor="email">
  Email
  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
/>
```

### Legend for Form

```tsx
// Indicate required fields at form start
<form>
  <p className="text-sm text-slate-500 mb-4">
    <span aria-hidden="true">*</span> indicates required field
  </p>
  {/* fields */}
</form>
```

## Error States

### aria-invalid

```tsx
<input
  id="email"
  type="email"
  aria-invalid={!!error}
  className={error ? 'border-red-500' : ''}
/>
```

### aria-describedby

```tsx
// Connect error message to input
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" className="text-red-500">
    {error}
  </p>
)}
```

### role="alert"

```tsx
// Announce error to screen readers
{error && (
  <p id="email-error" role="alert" className="text-red-500">
    {error}
  </p>
)}
```

### Complete Error Pattern

```tsx
const FormField = ({ id, label, error, ...props }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="text-red-500">
        {error}
      </p>
    )}
  </div>
);
```

## Help Text

### aria-describedby for Help

```tsx
<label htmlFor="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-help"
/>
<p id="password-help" className="text-slate-500">
  At least 8 characters with one number
</p>
```

### Multiple Descriptions

```tsx
// Combine help text and error
<input
  id="password"
  aria-describedby={cn(
    'password-help',
    error && 'password-error'
  )}
/>
<p id="password-help">At least 8 characters</p>
{error && <p id="password-error" role="alert">{error}</p>}
```

## Fieldsets and Legends

### Grouping Related Fields

```tsx
<fieldset>
  <legend>Shipping Address</legend>

  <label htmlFor="street">Street</label>
  <input id="street" />

  <label htmlFor="city">City</label>
  <input id="city" />

  <label htmlFor="zip">ZIP Code</label>
  <input id="zip" />
</fieldset>
```

### Radio Groups

```tsx
<fieldset>
  <legend>Notification Preferences</legend>

  <label>
    <input type="radio" name="notif" value="all" />
    All notifications
  </label>

  <label>
    <input type="radio" name="notif" value="important" />
    Important only
  </label>

  <label>
    <input type="radio" name="notif" value="none" />
    None
  </label>
</fieldset>
```

## Focus Management

### Focus First Input on Mount

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

<input ref={inputRef} />
```

### Focus First Error on Submit

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const errors = validate(formData);

  if (Object.keys(errors).length > 0) {
    setErrors(errors);

    // Focus first error field
    const firstErrorField = document.querySelector('[aria-invalid="true"]');
    (firstErrorField as HTMLElement)?.focus();

    return;
  }

  submitForm(formData);
};
```

### Focus After Dynamic Content

```tsx
// After adding a new field dynamically
const addField = () => {
  setFields([...fields, newField]);

  // Focus new field after render
  setTimeout(() => {
    document.getElementById(`field-${fields.length}`)?.focus();
  }, 0);
};
```

## Disabled vs Read-Only

### Disabled

```tsx
// Not focusable, not submitted
<input disabled aria-disabled="true" />
```

### Read-Only

```tsx
// Focusable, submitted, not editable
<input readOnly aria-readonly="true" />
```

### When to Use Each

| State | Focusable | Submitted | Editable | Use Case |
|-------|-----------|-----------|----------|----------|
| Disabled | No | No | No | Permission-based, loading |
| Read-only | Yes | Yes | No | Calculated values, confirmation |

## Live Regions

### Character Count

```tsx
<div>
  <textarea
    value={value}
    maxLength={280}
    aria-describedby="char-count"
  />
  <p
    id="char-count"
    aria-live="polite"
    aria-atomic="true"
  >
    {280 - value.length} characters remaining
  </p>
</div>
```

### Form Submission Status

```tsx
<div
  aria-live="assertive"
  aria-atomic="true"
  className="sr-only"
>
  {status === 'success' && 'Form submitted successfully'}
  {status === 'error' && 'Form submission failed. Please try again.'}
</div>
```

## Autocomplete

### Standard Values

```tsx
<input type="text" autoComplete="name" />
<input type="email" autoComplete="email" />
<input type="tel" autoComplete="tel" />
<input type="text" autoComplete="street-address" />
<input type="text" autoComplete="postal-code" />
<input type="text" autoComplete="cc-number" /> {/* Credit card */}
```

### Disable When Inappropriate

```tsx
// Search inputs
<input type="search" autoComplete="off" />

// One-time codes
<input type="text" autoComplete="one-time-code" />
```

## ARIA Role Reference

### Common Form Roles

```tsx
// Search form
<form role="search">

// Alert for errors
<p role="alert">{error}</p>

// Status for non-urgent updates
<p role="status">{message}</p>

// Group related controls
<div role="group" aria-labelledby="group-label">
```

## Checklist

### Every Form Should Have

- [ ] All inputs have associated labels
- [ ] Required fields marked visually and semantically
- [ ] Error messages connected via `aria-describedby`
- [ ] Errors announced with `role="alert"`
- [ ] Focus moves to first error on submit failure
- [ ] Tab order follows visual order
- [ ] Submit button has clear label

### Every Input Should Have

- [ ] Visible label or `aria-label`
- [ ] `aria-invalid` when in error state
- [ ] `aria-describedby` pointing to help/error text
- [ ] `aria-required` if required
- [ ] Appropriate `autocomplete` value

### Testing

1. Navigate entire form using only keyboard
2. Test with screen reader (VoiceOver, NVDA)
3. Verify errors are announced
4. Check focus is managed correctly
5. Verify required fields are communicated
