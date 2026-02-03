# Component API Reference

Complete props documentation for all Sharp UI components.

---

## SharpCard

A container component with hard edges and strong borders.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Card content |
| variant | 'default' \| 'bordered' \| 'accent' | 'default' | Visual style |
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | Internal padding |
| className | string | '' | Additional CSS classes |
| id | string | - | HTML id attribute |

### Variants

- **default**: Basic card with border
- **bordered**: Card with hover effect on border
- **accent**: Card with green accent border

### Usage

```tsx
<SharpCard variant="bordered" padding="lg">
  <h2 className="font-bold">CARD TITLE</h2>
  <p>Card content here</p>
</SharpCard>
```

---

## SharpButton

A button with hard edges and bold uppercase text.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Button content |
| onClick | () => void | - | Click handler |
| variant | 'primary' \| 'secondary' \| 'ghost' | 'secondary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| icon | ReactNode | - | Icon before text |
| active | boolean | false | Active/selected state |
| disabled | boolean | false | Disabled state |
| type | 'button' \| 'submit' \| 'reset' | 'button' | Button type |
| className | string | '' | Additional CSS classes |

### Variants

- **primary**: Green accent border, inverts on hover
- **secondary**: Gray border, subtle hover
- **ghost**: No border until hover

### Usage

```tsx
<SharpButton
  variant="primary"
  icon={<PlayIcon />}
  onClick={handleRun}
>
  EXECUTE
</SharpButton>
```

---

## SharpTabs

A tab navigation component with underline indicator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | Tab[] | required | Array of tab definitions |
| value | string | required | Selected tab value |
| onChange | (value: string) => void | required | Selection change handler |
| size | 'sm' \| 'md' | 'md' | Tab size |
| className | string | '' | Additional CSS classes |

### Tab Type

```typescript
interface Tab {
  value: string;    // Unique identifier
  label: string;    // Display text (will be uppercase)
  icon?: ReactNode; // Optional icon
}
```

### Usage

```tsx
<SharpTabs
  tabs={[
    { value: 'config', label: 'CONFIG' },
    { value: 'logs', label: 'LOGS' },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

---

## SharpSelect

A dropdown select component with hard edges.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | required | Selected value |
| onChange | (value: string) => void | required | Selection change handler |
| options | SelectOption[] | required | Available options |
| label | string | - | Label above select |
| placeholder | string | 'SELECT...' | Placeholder text |
| icon | ReactNode | - | Icon in trigger |
| chevronIcon | ReactNode | - | Custom chevron icon |
| checkIcon | ReactNode | - | Custom check icon |
| disabled | boolean | false | Disabled state |
| size | 'sm' \| 'md' | 'md' | Select size |
| className | string | '' | Additional CSS classes |

### SelectOption Type

```typescript
interface SelectOption {
  value: string;    // Unique value
  label: string;    // Display text
  icon?: ReactNode; // Optional icon
}
```

### Usage

```tsx
<SharpSelect
  label="ENVIRONMENT"
  value={env}
  onChange={setEnv}
  options={[
    { value: 'dev', label: 'DEVELOPMENT' },
    { value: 'prod', label: 'PRODUCTION' },
  ]}
/>
```

---

## SharpToggle

A toggle switch with square track.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | required | Toggle state |
| onChange | (checked: boolean) => void | required | State change handler |
| label | string | - | Optional text label |
| size | 'sm' \| 'md' | 'md' | Toggle size |
| disabled | boolean | false | Disabled state |
| className | string | '' | Additional CSS classes |

### Usage

```tsx
<SharpToggle
  checked={enabled}
  onChange={setEnabled}
  label="ENABLE DEBUG MODE"
/>
```

---

## SharpInput

A text input with thick border and uppercase label.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | required | Current value |
| onChange | (value: string) => void | required | Value change handler |
| label | string | - | Label above input |
| placeholder | string | '' | Placeholder text |
| type | 'text' \| 'email' \| 'password' \| 'number' \| 'url' | 'text' | Input type |
| disabled | boolean | false | Disabled state |
| error | string | - | Error message |
| icon | ReactNode | - | Icon inside input |
| size | 'sm' \| 'md' | 'md' | Input size |
| id | string | - | HTML id attribute |
| name | string | - | HTML name attribute |
| autoComplete | string | - | Autocomplete hint |
| autoFocus | boolean | false | Auto-focus on mount |
| onFocus | () => void | - | Focus event handler |
| onBlur | () => void | - | Blur event handler |
| onKeyDown | (e: KeyboardEvent) => void | - | Keydown handler |
| className | string | '' | Additional CSS classes |

### Usage

```tsx
<SharpInput
  label="API KEY"
  value={apiKey}
  onChange={setApiKey}
  placeholder="SK_LIVE_..."
  error={errors.apiKey}
/>
```

---

## SharpBadge

A status indicator badge with uppercase text.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Badge content |
| variant | 'default' \| 'success' \| 'warning' \| 'error' | 'default' | Color variant |
| size | 'sm' \| 'md' | 'md' | Badge size |
| className | string | '' | Additional CSS classes |

### Variants

- **default**: Gray border, muted text
- **success**: Green border and text
- **warning**: Yellow border and text
- **error**: Pink/red border and text

### Usage

```tsx
<div className="flex gap-2">
  <SharpBadge variant="success">ACTIVE</SharpBadge>
  <SharpBadge variant="warning">PENDING</SharpBadge>
  <SharpBadge variant="error">FAILED</SharpBadge>
</div>
```

---

## SharpDivider

A horizontal divider with configurable thickness.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'accent' | 'default' | Color variant |
| thickness | 'sm' \| 'md' \| 'lg' | 'md' | Line thickness |
| className | string | '' | Additional CSS classes |

### Thickness Values

- **sm**: 1px
- **md**: 2px
- **lg**: 4px

### Variants

- **default**: Gray (#333333)
- **accent**: Green (#00ff88)

### Usage

```tsx
<div className="space-y-4">
  <h3>Section One</h3>
  <SharpDivider />
  <h3>Section Two</h3>
  <SharpDivider variant="accent" thickness="lg" />
  <h3>Highlighted Section</h3>
</div>
```

---

## Composing Components

### Form Example

```tsx
<SharpCard variant="bordered" padding="lg">
  <div className="space-y-4">
    <h2 className="text-sm font-bold uppercase tracking-wide text-sharp-text">
      CONFIGURATION
    </h2>

    <SharpDivider />

    <SharpInput
      label="SERVER URL"
      value={url}
      onChange={setUrl}
      placeholder="HTTPS://..."
    />

    <SharpSelect
      label="REGION"
      value={region}
      onChange={setRegion}
      options={regions}
    />

    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-sharp-text-muted">
        ENABLE SSL
      </span>
      <SharpToggle checked={ssl} onChange={setSsl} />
    </div>

    <SharpDivider />

    <div className="flex gap-3">
      <SharpButton variant="secondary">CANCEL</SharpButton>
      <SharpButton variant="primary">SAVE</SharpButton>
    </div>
  </div>
</SharpCard>
```

### Dashboard Header

```tsx
<div className="flex items-center justify-between p-4 border-b-2 border-sharp-border">
  <div className="flex items-center gap-3">
    <h1 className="text-lg font-bold text-sharp-text">DASHBOARD</h1>
    <SharpBadge variant="success">CONNECTED</SharpBadge>
  </div>

  <SharpTabs
    tabs={[
      { value: 'overview', label: 'OVERVIEW' },
      { value: 'metrics', label: 'METRICS' },
      { value: 'logs', label: 'LOGS' },
    ]}
    value={tab}
    onChange={setTab}
  />
</div>
```
