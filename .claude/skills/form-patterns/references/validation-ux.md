# Validation UX

When and how to show validation errors. Read this when implementing form validation.

## Validation Timing

### The Golden Rule

**Validate on blur first, then on change.**

```tsx
const [touched, setTouched] = useState(false);
const [error, setError] = useState<string | null>(null);

// First interaction: validate on blur
const handleBlur = () => {
  setTouched(true);
  setError(validate(value));
};

// After error shown: validate on change
const handleChange = (newValue: string) => {
  setValue(newValue);
  if (touched && error) {
    setError(validate(newValue));
  }
};
```

### Why This Pattern?

| Timing | Problem |
|--------|---------|
| On mount | User sees error before typing |
| On every keystroke | Errors flash while typing |
| Only on submit | User has to submit to see errors |
| **On blur, then change** | ✓ Natural, non-aggressive |

## Error Message Guidelines

### Be Specific

```tsx
// BAD - vague
"Invalid input"
"Error"
"Please fix this field"

// GOOD - specific
"Email must include @"
"Password must be at least 8 characters"
"Please select a date in the future"
```

### Be Helpful

```tsx
// BAD - just states the problem
"Too short"

// GOOD - tells how to fix
"Password must be at least 8 characters (currently 5)"
```

### Be Immediate

Show error as soon as validation fails (after blur):

```tsx
// Error appears immediately after blur
{touched && error && (
  <p role="alert">{error}</p>
)}
```

### Be Persistent

Keep error visible until the problem is fixed:

```tsx
// WRONG - error disappears on focus
{!focused && error && <p>{error}</p>}

// CORRECT - error stays until fixed
{touched && error && <p>{error}</p>}
```

## Error Display Patterns

### Basic Error

```tsx
<div className="space-y-1">
  <input
    className={error ? 'border-red-500' : 'border-slate-700'}
  />
  {error && (
    <p className="text-xs text-red-500">{error}</p>
  )}
</div>
```

### Error with Icon

```tsx
{error && (
  <div className="flex items-center gap-1.5 mt-1">
    <AlertCircle className="text-red-500" size={12} />
    <span className="text-xs text-red-500">{error}</span>
  </div>
)}
```

### Inline Error (for compact forms)

```tsx
<div className="flex items-center gap-2">
  <input className={error ? 'border-red-500' : ''} />
  {error && (
    <span className="text-xs text-red-500 whitespace-nowrap">
      {error}
    </span>
  )}
</div>
```

## Submit Validation

### Validate All on Submit

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validate all fields
  const errors = validateForm(formData);

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    // Focus first error field
    const firstErrorId = Object.keys(errors)[0];
    document.getElementById(firstErrorId)?.focus();
    return;
  }

  // Proceed with submission
  submitForm(formData);
};
```

### Focus First Error

```tsx
// After validation fails
const firstErrorField = document.querySelector('[aria-invalid="true"]');
firstErrorField?.focus();

// Or by field ID
const firstErrorId = Object.keys(errors)[0];
document.getElementById(firstErrorId)?.focus();
```

## Real-Time vs Deferred Validation

### Real-Time (validate as user types)

Good for:
- Character limits: `${value.length}/280`
- Password strength meters
- Username availability

```tsx
// Show character count in real-time
<div className="flex justify-between text-xs">
  <span>{value.length}/280</span>
  {value.length > 280 && (
    <span className="text-red-500">Too long</span>
  )}
</div>
```

### Deferred (validate on blur/submit)

Good for:
- Format validation (email, phone)
- Required field validation
- Complex business rules

## Common Validation Patterns

### Required Field

```tsx
const validateRequired = (value: string) => {
  if (!value.trim()) {
    return 'This field is required';
  }
  return null;
};
```

### Email

```tsx
const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!email.includes('@')) return 'Please include @ in email';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};
```

### Password

```tsx
const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (password.length < 8) {
    return `Password must be at least 8 characters (currently ${password.length})`;
  }
  return null;
};
```

### Confirm Match

```tsx
const validateConfirm = (confirm: string, original: string) => {
  if (confirm !== original) {
    return 'Passwords do not match';
  }
  return null;
};
```

## Form-Level Errors

For errors not tied to a specific field:

```tsx
{formError && (
  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-500">
    {formError}
  </div>
)}
```

Common form-level errors:
- "Unable to connect to server"
- "Session expired, please log in again"
- "Something went wrong, please try again"
