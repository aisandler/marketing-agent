/**
 * InlineForm - Form pattern template
 *
 * Horizontal input + button layout for search bars, filters, quick actions.
 * Design-system agnostic - apply your own visual styles.
 */

import React, { FormEvent, ReactNode, useState } from 'react';

interface InlineFormProps {
  /** Form submit handler */
  onSubmit: (value: string) => void | Promise<void>;
  /** Placeholder text */
  placeholder?: string;
  /** Submit button text */
  buttonText?: string;
  /** Input type */
  type?: 'text' | 'email' | 'search' | 'url';
  /** Initial value */
  defaultValue?: string;
  /** Whether to clear input after submit */
  clearOnSubmit?: boolean;
  /** Optional className */
  className?: string;
  /** Optional icon before input */
  icon?: ReactNode;
  /** Whether form is submitting */
  loading?: boolean;
}

const InlineForm: React.FC<InlineFormProps> = ({
  onSubmit,
  placeholder = '',
  buttonText = 'Submit',
  type = 'text',
  defaultValue = '',
  clearOnSubmit = false,
  className = '',
  icon,
  loading = false
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!value.trim() || isSubmitting || loading) return;

    setIsSubmitting(true);

    try {
      await onSubmit(value);
      if (clearOnSubmit) {
        setValue('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-2 ${className}`}
    >
      {/* Input wrapper with optional icon */}
      <div className="relative flex-1">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className={`
            w-full px-3 py-2 rounded border
            ${icon ? 'pl-9' : ''}
          `}
          aria-label={placeholder || buttonText}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="px-4 py-2 rounded"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="animate-spin">⟳</span>
            <span className="sr-only">Loading</span>
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
};

export default InlineForm;

/**
 * USAGE:
 *
 * // Search bar
 * <InlineForm
 *   onSubmit={(query) => search(query)}
 *   placeholder="Search products..."
 *   buttonText="Search"
 *   type="search"
 *   clearOnSubmit
 * />
 *
 * // With icon
 * import { Search } from 'lucide-react';
 *
 * <InlineForm
 *   onSubmit={handleSearch}
 *   placeholder="Search..."
 *   buttonText="Go"
 *   icon={<Search size={16} />}
 * />
 *
 * // Email subscription
 * <InlineForm
 *   onSubmit={(email) => subscribe(email)}
 *   placeholder="Enter your email"
 *   buttonText="Subscribe"
 *   type="email"
 * />
 *
 * // Quick add
 * <InlineForm
 *   onSubmit={(title) => addTodo(title)}
 *   placeholder="Add a task..."
 *   buttonText="Add"
 *   clearOnSubmit
 * />
 *
 * // With loading state
 * const [loading, setLoading] = useState(false);
 *
 * <InlineForm
 *   onSubmit={async (query) => {
 *     setLoading(true);
 *     await search(query);
 *     setLoading(false);
 *   }}
 *   loading={loading}
 *   ...
 * />
 *
 * STYLING NOTES:
 *
 * Apply your design system styles via className:
 *
 * <InlineForm
 *   className="your-form-class"
 *   ...
 * />
 *
 * Or modify the component's internal classes to match your system.
 *
 * VARIATIONS:
 *
 * // Filter bar with multiple inputs
 * <form className="flex flex-wrap gap-3 items-end">
 *   <FormField label="Status">
 *     <select>...</select>
 *   </FormField>
 *   <FormField label="Date">
 *     <input type="date" />
 *   </FormField>
 *   <button type="submit">Apply Filters</button>
 * </form>
 *
 * // Inline with icon button
 * <form className="flex gap-2">
 *   <input placeholder="Search..." className="flex-1" />
 *   <button type="submit" aria-label="Search">
 *     <SearchIcon />
 *   </button>
 * </form>
 *
 * ACCESSIBILITY:
 *
 * - Input has aria-label from placeholder or buttonText
 * - Button disabled during loading
 * - Loading state announced via sr-only text
 * - Enter submits form (native behavior)
 */
