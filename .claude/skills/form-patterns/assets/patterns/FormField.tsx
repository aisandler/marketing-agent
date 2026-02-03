/**
 * FormField - Form pattern template
 *
 * Composes label, input, help text, and error message into a cohesive field.
 * Design-system agnostic - apply your own visual styles.
 */

import React, { ReactNode, useId } from 'react';

interface FormFieldProps {
  /** Field label text */
  label: string;
  /** Whether field is required */
  required?: boolean;
  /** Help text shown below input (hidden when error) */
  helpText?: string;
  /** Error message (replaces help text when present) */
  error?: string;
  /** The input element */
  children: ReactNode;
  /** Optional className for wrapper */
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  helpText,
  error,
  children,
  className = ''
}) => {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Input (cloned to add id and aria attributes) */}
      {React.isValidElement(children) &&
        React.cloneElement(children as React.ReactElement<any>, {
          id,
          'aria-invalid': !!error,
          'aria-describedby': error ? errorId : helpText ? helpId : undefined,
          'aria-required': required,
        })}

      {/* Help text (hidden when error) */}
      {helpText && !error && (
        <p id={helpId} className="text-xs text-slate-500">
          {helpText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;

/**
 * USAGE:
 *
 * // Basic field
 * <FormField label="Email">
 *   <input type="email" />
 * </FormField>
 *
 * // Required field with help text
 * <FormField
 *   label="Password"
 *   required
 *   helpText="At least 8 characters"
 * >
 *   <input type="password" />
 * </FormField>
 *
 * // Field with error
 * <FormField
 *   label="Email"
 *   error={errors.email}
 * >
 *   <input type="email" />
 * </FormField>
 *
 * // With custom input styles (your design system)
 * <FormField label="Username">
 *   <input className="your-input-class border rounded px-3 py-2" />
 * </FormField>
 *
 * STYLING NOTES:
 *
 * This component provides structure, not visual styling.
 * Apply your design system's input styles via className on the input.
 *
 * To style error state on input, check aria-invalid:
 *
 * input[aria-invalid="true"] {
 *   border-color: red;
 * }
 *
 * Or conditionally apply classes:
 *
 * <input className={error ? 'border-red-500' : 'border-slate-300'} />
 *
 * ACCESSIBILITY:
 *
 * - Labels connected via htmlFor/id
 * - Errors announced via role="alert"
 * - Help/error connected via aria-describedby
 * - Required indicated via aria-required
 * - Invalid state via aria-invalid
 */
