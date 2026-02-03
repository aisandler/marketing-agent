# Form Layouts

Patterns for arranging form fields. Read this when deciding how to structure your form.

## Layout Types

| Layout | Use When |
|--------|----------|
| Vertical | Default, mobile-friendly, long forms |
| Horizontal | Settings, dense UIs, short labels |
| Inline | Search bars, filters, quick actions |
| Multi-column | Related field pairs, wide screens |

## Vertical Layout (Default)

Fields stack top to bottom. Most accessible and mobile-friendly.

```tsx
<form className="space-y-4">
  <FormField label="Email">
    <input type="email" className="w-full" />
  </FormField>

  <FormField label="Password">
    <input type="password" className="w-full" />
  </FormField>

  <FormField label="Confirm Password">
    <input type="password" className="w-full" />
  </FormField>

  <button type="submit" className="w-full">
    Create Account
  </button>
</form>
```

### Spacing Options

```tsx
// Compact (12px)
<form className="space-y-3">

// Standard (16px) - DEFAULT
<form className="space-y-4">

// Spacious (24px)
<form className="space-y-6">
```

## Horizontal Layout

Label on left, input on right. Good for settings pages.

```tsx
<form className="space-y-4">
  <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
    <label className="text-sm font-medium text-right pt-2">
      Display Name
    </label>
    <input type="text" className="w-full" />
  </div>

  <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
    <label className="text-sm font-medium text-right pt-2">
      Email
    </label>
    <input type="email" className="w-full" />
  </div>
</form>
```

### Label Width Guidelines

| Label Length | Width |
|--------------|-------|
| Short (1-2 words) | 100-120px |
| Medium (2-3 words) | 140-160px |
| Long (3+ words) | Consider vertical |

## Inline Layout

Single row for quick actions. Common for search and filters.

```tsx
// Search bar
<form className="flex gap-2">
  <input
    type="text"
    placeholder="Search..."
    className="flex-1"
  />
  <button type="submit">Search</button>
</form>

// Filter row
<form className="flex flex-wrap gap-3 items-end">
  <FormField label="Status">
    <select>
      <option>All</option>
      <option>Active</option>
      <option>Archived</option>
    </select>
  </FormField>

  <FormField label="Date Range">
    <input type="date" />
  </FormField>

  <button type="submit">Apply</button>
</form>
```

## Multi-Column Layout

Side-by-side fields for related data.

```tsx
<form className="space-y-4">
  {/* Two columns for name */}
  <div className="grid grid-cols-2 gap-4">
    <FormField label="First Name">
      <input />
    </FormField>
    <FormField label="Last Name">
      <input />
    </FormField>
  </div>

  {/* Full width for email */}
  <FormField label="Email">
    <input type="email" />
  </FormField>

  {/* Three columns for date */}
  <div className="grid grid-cols-3 gap-4">
    <FormField label="Month">
      <select>...</select>
    </FormField>
    <FormField label="Day">
      <input type="number" />
    </FormField>
    <FormField label="Year">
      <input type="number" />
    </FormField>
  </div>
</form>
```

### Responsive Multi-Column

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FormField label="First Name">
    <input />
  </FormField>
  <FormField label="Last Name">
    <input />
  </FormField>
</div>
```

## Form Sections

Group related fields with visual separation.

```tsx
<form className="space-y-8">
  {/* Section 1 */}
  <section className="space-y-4">
    <h3 className="text-sm font-semibold border-b pb-2">
      Personal Information
    </h3>
    <FormField label="Name">
      <input />
    </FormField>
    <FormField label="Email">
      <input type="email" />
    </FormField>
  </section>

  {/* Section 2 */}
  <section className="space-y-4">
    <h3 className="text-sm font-semibold border-b pb-2">
      Preferences
    </h3>
    <FormField label="Language">
      <select>...</select>
    </FormField>
    <FormField label="Timezone">
      <select>...</select>
    </FormField>
  </section>

  <button type="submit">Save Changes</button>
</form>
```

## Modal Forms

Forms in dialogs need special consideration.

```tsx
<Dialog>
  <DialogHeader>
    <DialogTitle>Edit Profile</DialogTitle>
  </DialogHeader>

  <form onSubmit={handleSubmit}>
    <DialogBody className="space-y-4">
      <FormField label="Name">
        <input autoFocus />
      </FormField>
      <FormField label="Bio">
        <textarea rows={3} />
      </FormField>
    </DialogBody>

    <DialogFooter className="flex gap-2 justify-end">
      <button type="button" onClick={onClose}>
        Cancel
      </button>
      <button type="submit">
        Save
      </button>
    </DialogFooter>
  </form>
</Dialog>
```

### Modal Form Guidelines

1. Auto-focus first input on open
2. Escape closes modal (if not dirty)
3. Confirm before closing dirty form
4. Actions in footer (Cancel, Submit)

## Form Width

```tsx
// Full width (default in containers)
<form className="w-full">

// Max width constraint
<form className="max-w-md">

// Centered
<form className="max-w-md mx-auto">
```

### Recommended Max Widths

| Form Type | Max Width |
|-----------|-----------|
| Login/signup | 400px (`max-w-sm`) |
| Settings | 600px (`max-w-lg`) |
| Data entry | 800px (`max-w-3xl`) |
| Full page | No max (responsive) |
