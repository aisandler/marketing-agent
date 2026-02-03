# Input Composition

How to compose label, input, help text, and error message into a cohesive field.

## Field Anatomy

```
┌─────────────────────────────────────────┐
│ Label *                                 │  ← Required indicator (optional)
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Input                               │ │  ← The input element
│ └─────────────────────────────────────┘ │
│ Help text appears here                  │  ← Help text (hidden when error)
│ ⚠ Error message                         │  ← Error (replaces help text)
└─────────────────────────────────────────┘
```

## Label Rules

### Always Use Labels

```tsx
// WRONG - placeholder is not a label
<input placeholder="Email" />

// CORRECT - visible label
<label>Email</label>
<input placeholder="you@example.com" />
```

### Label Position

| Type | Position | When |
|------|----------|------|
| Vertical | Above input | Default, most accessible |
| Horizontal | Left of input | Settings pages, forms with short labels |
| Hidden | `sr-only` | Icon-only inputs with aria-label |

### Required Indicators

```tsx
// Visual asterisk + semantic required
<label>
  Email <span className="text-red-500" aria-hidden="true">*</span>
</label>
<input required aria-required="true" />
```

## Help Text

Help text provides context before the user makes an error.

### When to Use

- Format expectations: "Use format: MM/DD/YYYY"
- Character limits: "Maximum 280 characters"
- Requirements: "At least 8 characters"
- Constraints: "Must be unique"

### Placement

```tsx
// Below input, above error
<label>Password</label>
<input type="password" />
<p className="text-xs text-slate-500">
  At least 8 characters with one number
</p>
```

### Help vs Placeholder

| Purpose | Use |
|---------|-----|
| Example value | Placeholder ("jane@example.com") |
| Format hint | Help text ("We'll never share your email") |
| Requirements | Help text ("At least 8 characters") |

## Error Messages

### Placement Options

```tsx
// Below input (default)
<input className="border-red-500" />
<p className="text-xs text-red-500 mt-1">{error}</p>

// Inline with input
<div className="flex items-center gap-2">
  <input className="border-red-500" />
  <span className="text-xs text-red-500">{error}</span>
</div>
```

### Error vs Help Text

**Rule**: Error replaces help text, never show both.

```tsx
{/* Help text hidden when error exists */}
{helpText && !error && (
  <p className="text-xs text-slate-500">{helpText}</p>
)}

{/* Error shown when validation fails */}
{error && (
  <p className="text-xs text-red-500" role="alert">{error}</p>
)}
```

### Error Styling

```tsx
// Input border changes
<input
  className={cn(
    'border rounded px-3 py-2',
    error ? 'border-red-500' : 'border-slate-700'
  )}
/>

// With icon
{error && (
  <div className="flex items-center gap-1.5 mt-1">
    <AlertCircle className="text-red-500" size={12} />
    <span className="text-xs text-red-500">{error}</span>
  </div>
)}
```

## Spacing Within Field

```tsx
<div className="space-y-1.5">  {/* 6px gap between elements */}
  <label>...</label>
  <input />
  <p>Help or error</p>
</div>
```

| Element Gap | Value |
|-------------|-------|
| Label → Input | 6px (`gap-1.5`) |
| Input → Help/Error | 4px (`mt-1`) |

## Input Variants

### Text Input

```tsx
<div className="space-y-1.5">
  <label>Username</label>
  <input
    type="text"
    className="w-full px-3 py-2 rounded border"
    placeholder="Enter username"
  />
</div>
```

### Input with Icon

```tsx
<div className="space-y-1.5">
  <label>Search</label>
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
    <input className="pl-9 ..." />
  </div>
</div>
```

### Input with Button

```tsx
<div className="space-y-1.5">
  <label>Email</label>
  <div className="flex gap-2">
    <input className="flex-1" />
    <button type="button">Verify</button>
  </div>
</div>
```

### Textarea

```tsx
<div className="space-y-1.5">
  <label>Description</label>
  <textarea
    rows={4}
    className="w-full px-3 py-2 rounded border resize-none"
  />
  <div className="flex justify-between text-xs text-slate-500">
    <span>Markdown supported</span>
    <span>{value.length}/500</span>
  </div>
</div>
```

### Select

```tsx
<div className="space-y-1.5">
  <label>Country</label>
  <select className="w-full px-3 py-2 rounded border">
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
  </select>
</div>
```

### Checkbox

```tsx
<label className="flex items-start gap-2">
  <input type="checkbox" className="mt-1" />
  <div>
    <span className="font-medium">Accept terms</span>
    <p className="text-xs text-slate-500">
      By checking this, you agree to our terms of service
    </p>
  </div>
</label>
```

### Radio Group

```tsx
<fieldset className="space-y-2">
  <legend className="font-medium">Notification preference</legend>

  <label className="flex items-center gap-2">
    <input type="radio" name="notif" value="all" />
    <span>All notifications</span>
  </label>

  <label className="flex items-center gap-2">
    <input type="radio" name="notif" value="important" />
    <span>Important only</span>
  </label>

  <label className="flex items-center gap-2">
    <input type="radio" name="notif" value="none" />
    <span>None</span>
  </label>
</fieldset>
```

## Full Example

```tsx
interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
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
      {required && (
        <span className="text-red-500 ml-1" aria-hidden="true">*</span>
      )}
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

## Anti-Patterns

### DON'T: Use placeholder as only label

```tsx
// WRONG
<input placeholder="Email" />

// CORRECT
<label>Email</label>
<input placeholder="you@example.com" />
```

### DON'T: Show help and error together

```tsx
// WRONG - confusing
<p className="text-slate-500">{helpText}</p>
<p className="text-red-500">{error}</p>

// CORRECT - error replaces help
{error ? (
  <p className="text-red-500">{error}</p>
) : (
  <p className="text-slate-500">{helpText}</p>
)}
```

### DON'T: Put error far from input

```tsx
// WRONG - error at bottom of form
<input />
<input />
<input />
<div className="errors">{allErrors}</div>

// CORRECT - error below each field
<input />
<p className="text-red-500">{error1}</p>
<input />
<p className="text-red-500">{error2}</p>
```
