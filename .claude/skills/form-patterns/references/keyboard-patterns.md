# Keyboard Patterns

Keyboard navigation and shortcuts for forms. Essential for accessibility and power users.

## Standard Behaviors

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |
| `Enter` | Submit form (in text input) |
| `Space` | Toggle checkbox, activate button |
| `Escape` | Cancel, close modal |
| `Arrow Up/Down` | Navigate select, radio group |
| `Arrow Left/Right` | Navigate tabs, segmented control |

## Tab Order

### Natural Order (Preferred)

```tsx
// Elements are focused in DOM order
<input />  {/* Tab stop 1 */}
<input />  {/* Tab stop 2 */}
<button /> {/* Tab stop 3 */}
```

### Skip Element

```tsx
// tabIndex={-1} removes from tab order
<div tabIndex={-1}>Not focusable by Tab</div>

// Still focusable programmatically
const ref = useRef<HTMLDivElement>(null);
ref.current?.focus();
```

### Custom Order (Avoid)

```tsx
// AVOID - confusing for users
<input tabIndex={3} />
<input tabIndex={1} /> {/* Focused first */}
<input tabIndex={2} />

// PREFER - natural DOM order
<input />
<input />
<input />
```

## Enter to Submit

### Form Element (Automatic)

```tsx
// Enter in input submits the form
<form onSubmit={handleSubmit}>
  <input type="text" /> {/* Enter here submits */}
  <button type="submit">Submit</button>
</form>
```

### Non-Form Container

```tsx
// Manual Enter handling
<div
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  }}
>
  <input />
</div>
```

### Textarea Exception

```tsx
// Enter creates newline in textarea
// Use Ctrl/Cmd+Enter to submit
<textarea
  onKeyDown={(e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  }}
/>
```

## Escape to Cancel

```tsx
// Modal forms
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (isDirty) {
      showConfirmDialog();
    } else {
      closeModal();
    }
  }
};

useEffect(() => {
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isDirty]);
```

## Focus Management

### Auto-Focus First Input

```tsx
// Modal opens: focus first input
<Dialog onOpenChange={(open) => {
  if (open) {
    setTimeout(() => {
      document.querySelector('input')?.focus();
    }, 0);
  }
}}>
  <input autoFocus /> {/* Or use autoFocus */}
</Dialog>
```

### Focus on Error

```tsx
const handleSubmit = () => {
  const errors = validate(formData);

  if (Object.keys(errors).length > 0) {
    // Focus first error field
    const firstErrorId = Object.keys(errors)[0];
    document.getElementById(firstErrorId)?.focus();
    return;
  }

  submitForm(formData);
};
```

### Focus Trapping (Modals)

```tsx
// Keep focus within modal
const trapFocus = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return;

  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};
```

## Arrow Key Navigation

### Select / Dropdown

```tsx
const [focusedIndex, setFocusedIndex] = useState(0);

const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, options.length - 1));
      break;
    case 'ArrowUp':
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      selectOption(options[focusedIndex]);
      break;
    case 'Escape':
      closeDropdown();
      break;
  }
};
```

### Radio Group

```tsx
// Native radio groups handle arrows automatically
<fieldset>
  <input type="radio" name="choice" value="a" />
  <input type="radio" name="choice" value="b" />
  <input type="radio" name="choice" value="c" />
</fieldset>

// Arrow keys move selection, Tab leaves group
```

### Tab List

```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    setActiveTab((i) => (i + 1) % tabs.length);
  } else if (e.key === 'ArrowLeft') {
    setActiveTab((i) => (i - 1 + tabs.length) % tabs.length);
  }
};

<div role="tablist" onKeyDown={handleKeyDown}>
  {tabs.map((tab, i) => (
    <button
      role="tab"
      tabIndex={i === activeTab ? 0 : -1}
      aria-selected={i === activeTab}
    >
      {tab.label}
    </button>
  ))}
</div>
```

## Common Shortcuts

### Form-Level Shortcuts

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + S to save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Undo/Redo (Advanced)

```tsx
// Cmd/Ctrl + Z to undo
// Cmd/Ctrl + Shift + Z to redo
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    e.preventDefault();
    if (e.shiftKey) {
      redo();
    } else {
      undo();
    }
  }
};
```

## Anti-Patterns

### DON'T: Break Tab Order

```tsx
// WRONG - confusing navigation
<input tabIndex={5} />
<input tabIndex={1} />
<input tabIndex={3} />

// CORRECT - natural order
<input />
<input />
<input />
```

### DON'T: Trap Focus Without Escape

```tsx
// WRONG - user can't leave
<div onKeyDown={(e) => e.key === 'Tab' && e.preventDefault()}>

// CORRECT - allow escape to close
<div onKeyDown={(e) => {
  if (e.key === 'Escape') closeModal();
  // Only trap Tab within modal, not prevent it
}}>
```

### DON'T: Prevent Enter in Forms

```tsx
// WRONG - breaks form submission
<form onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>

// CORRECT - let forms work naturally
<form onSubmit={handleSubmit}>
```

### DON'T: Use Non-Standard Shortcuts

```tsx
// WRONG - conflicts with browser/OS
Ctrl + W  // Closes tab
Ctrl + T  // New tab
Ctrl + N  // New window

// CORRECT - safe shortcuts
Ctrl + S  // Save (common, expected)
Ctrl + Enter  // Submit (common in forms)
```

## Keyboard Testing Checklist

1. [ ] Can Tab through all form fields in logical order
2. [ ] Can Shift+Tab backwards
3. [ ] Enter submits form (in text inputs)
4. [ ] Escape closes modals/dropdowns
5. [ ] Arrow keys work in selects/radios
6. [ ] Focus is visible at all times
7. [ ] Focus moves to first error on submit failure
8. [ ] No keyboard traps (can always Tab out)
