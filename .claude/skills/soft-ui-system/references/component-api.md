# Component API Reference

Complete props documentation for all Soft UI components.

---

## SoftCard

A soft, rounded container component with multiple variants.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Card content |
| variant | 'default' \| 'elevated' \| 'glass' | 'default' | Visual style |
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | Internal padding |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| className | string | '' | Additional CSS classes |
| id | string | - | HTML id attribute |

### Variants

- **default**: Basic card with subtle border
- **elevated**: Card with shadow for visual lift
- **glass**: Translucent with backdrop blur

### Usage

```tsx
<SoftCard variant="elevated" padding="lg">
  <h2>Card Title</h2>
  <p>Card content here</p>
</SoftCard>
```

---

## PillButton

A pill-shaped button with multiple variants.

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
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| className | string | '' | Additional CSS classes |

### Variants

- **primary**: Indigo background, high emphasis
- **secondary**: Subtle background, medium emphasis
- **ghost**: Transparent, low emphasis

### Usage

```tsx
<PillButton
  variant="primary"
  icon={<SaveIcon />}
  onClick={handleSave}
>
  Save Changes
</PillButton>
```

---

## PillTabs

A pill-shaped tab navigation component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | Tab[] | required | Array of tab definitions |
| value | string | required | Selected tab value |
| onChange | (value: string) => void | required | Selection change handler |
| size | 'sm' \| 'md' | 'md' | Tab size |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| className | string | '' | Additional CSS classes |

### Tab Type

```typescript
interface Tab {
  value: string;   // Unique identifier
  label: string;   // Display text
  icon?: ReactNode; // Optional icon
}
```

### Usage

```tsx
<PillTabs
  tabs={[
    { value: 'general', label: 'General', icon: <SettingsIcon /> },
    { value: 'advanced', label: 'Advanced' },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

---

## SoftSelect

A dropdown select component with portal-based positioning.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | required | Selected value |
| onChange | (value: string) => void | required | Selection change handler |
| options | SelectOption[] | required | Available options |
| label | string | - | Label above select |
| placeholder | string | 'Select...' | Placeholder text |
| icon | ReactNode | - | Icon in trigger |
| chevronIcon | ReactNode | - | Custom chevron icon |
| checkIcon | ReactNode | - | Custom check icon |
| disabled | boolean | false | Disabled state |
| size | 'sm' \| 'md' | 'md' | Select size |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |

### SelectOption Type

```typescript
interface SelectOption {
  value: string;   // Unique value
  label: string;   // Display text
  icon?: ReactNode; // Optional icon
}
```

### Usage

```tsx
<SoftSelect
  label="Country"
  value={country}
  onChange={setCountry}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
/>
```

---

## SoftToggle

A soft toggle switch component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | required | Toggle state |
| onChange | (checked: boolean) => void | required | State change handler |
| label | string | - | Optional text label |
| size | 'sm' \| 'md' | 'md' | Toggle size |
| disabled | boolean | false | Disabled state |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |

### Usage

```tsx
<SoftToggle
  checked={enabled}
  onChange={setEnabled}
  label="Enable notifications"
/>
```

---

## SoftSlider

A range slider with gradient fill.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | required | Current value |
| onChange | (value: number) => void | required | Value change handler |
| min | number | 0 | Minimum value |
| max | number | 100 | Maximum value |
| step | number | 1 | Step increment |
| label | string | - | Optional label |
| showValue | boolean | false | Show current value |
| valueFormatter | (v: number) => string | `${v}` | Custom value format |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| className | string | '' | Additional CSS classes |

### Usage

```tsx
<SoftSlider
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  label="Volume"
  showValue
  valueFormatter={(v) => `${v}%`}
/>
```

---

## SoftSection

A collapsible section with animated expand/collapse.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Section header |
| children | ReactNode | required | Section content |
| description | string | - | Optional subtitle |
| icon | ReactNode | - | Icon before title |
| chevronIcon | ReactNode | - | Custom chevron icon |
| defaultOpen | boolean | true | Initial expanded state |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| className | string | '' | Additional CSS classes |

### Usage

```tsx
<SoftSection
  title="Advanced Settings"
  description="Configure advanced options"
  icon={<SettingsIcon />}
  defaultOpen={false}
>
  <div className="space-y-4">
    {/* Section content */}
  </div>
</SoftSection>
```

---

## CompactDropdown

A compact inline dropdown with smart viewport positioning.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | required | Selected value |
| options | DropdownOption[] | required | Available options |
| onChange | (value: string) => void | required | Selection change handler |
| chevronIcon | ReactNode | - | Custom chevron icon |
| checkIcon | ReactNode | - | Custom check icon |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| className | string | '' | Additional CSS classes |

### DropdownOption Type

```typescript
interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string; // Optional second line
}
```

### Usage

```tsx
<CompactDropdown
  value={sortBy}
  onChange={setSortBy}
  options={[
    { value: 'name', label: 'Name', description: 'Sort alphabetically' },
    { value: 'date', label: 'Date', description: 'Sort by creation date' },
  ]}
/>
```

---

## SoftSearchInput

A search input with debounced onChange and optional keyboard shortcut.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | required | Current search value |
| onChange | (value: string) => void | required | Debounced change handler |
| placeholder | string | 'Search...' | Placeholder text |
| debounceMs | number | 300 | Debounce delay in ms |
| showShortcut | boolean | false | Show keyboard shortcut hint |
| shortcutKey | string | 'K' | Shortcut key (with Cmd/Ctrl) |
| onFocus | () => void | - | Focus event handler |
| onBlur | () => void | - | Blur event handler |
| autoFocus | boolean | false | Auto-focus on mount |
| searchIcon | ReactNode | - | Custom search icon |
| clearIcon | ReactNode | - | Custom clear icon |
| commandIcon | ReactNode | - | Custom command key icon |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| className | string | '' | Additional CSS classes |

### Usage

```tsx
<SoftSearchInput
  value={search}
  onChange={setSearch}
  placeholder="Search products..."
  showShortcut
  shortcutKey="K"
/>
```

---

## SoftTreeItem

A tree item component for hierarchical navigation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | required | Unique identifier |
| type | TreeNodeType | required | Node type for icon color |
| label | string | required | Display text |
| count | number | - | Optional count badge |
| depth | number | 0 | Nesting level |
| isSelected | boolean | false | Selected state |
| isExpanded | boolean | false | Expanded state |
| hasChildren | boolean | false | Has child nodes |
| isDragOver | boolean | false | Drag over state |
| icon | ReactNode | - | Custom type icon |
| chevronIcon | ReactNode | - | Custom expand chevron |
| moreIcon | ReactNode | - | Custom actions icon |
| onSelect | (id: string) => void | - | Selection handler |
| onToggle | (id: string) => void | - | Expand/collapse handler |
| onAction | (id: string, action: string) => void | - | Action menu handler |
| onDragOver | (e: DragEvent) => void | - | Drag over handler |
| onDragLeave | (e: DragEvent) => void | - | Drag leave handler |
| onDrop | (e: DragEvent, id: string) => void | - | Drop handler |
| theme | 'dark' \| 'light' | 'dark' | Color scheme |
| children | ReactNode | - | Child tree items |
| className | string | '' | Additional CSS classes |

### TreeNodeType

```typescript
type TreeNodeType = 'brand' | 'product' | 'variant' | 'group';
```

Each type has a distinct icon color:
- brand: teal-400
- product: soft-indigo-400
- variant: violet-400
- group: amber-400

### Usage

```tsx
<SoftTreeItem
  id="brand-1"
  type="brand"
  label="Acme Corp"
  count={5}
  hasChildren
  isExpanded
  onSelect={handleSelect}
  onToggle={handleToggle}
>
  <SoftTreeItem
    id="product-1"
    type="product"
    label="Widget Pro"
    depth={1}
    onSelect={handleSelect}
  />
</SoftTreeItem>
```
