/**
 * FormSection - Form pattern template
 *
 * Groups related form fields with a header/legend.
 * Use for multi-section forms like settings pages.
 * Design-system agnostic - apply your own visual styles.
 */

import React, { ReactNode } from 'react';

interface FormSectionProps {
  /** Section title */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Form fields */
  children: ReactNode;
  /** Whether to use fieldset (for radio/checkbox groups) */
  asFieldset?: boolean;
  /** Optional className */
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  asFieldset = false,
  className = ''
}) => {
  const content = (
    <>
      {/* Header */}
      <div className="mb-4">
        {asFieldset ? (
          <legend className="text-sm font-semibold">{title}</legend>
        ) : (
          <h3 className="text-sm font-semibold">{title}</h3>
        )}
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {children}
      </div>
    </>
  );

  if (asFieldset) {
    return (
      <fieldset className={`${className}`}>
        {content}
      </fieldset>
    );
  }

  return (
    <section className={`${className}`}>
      {content}
    </section>
  );
};

export default FormSection;

/**
 * USAGE:
 *
 * // Basic section
 * <FormSection title="Personal Information">
 *   <FormField label="Name">
 *     <input />
 *   </FormField>
 *   <FormField label="Email">
 *     <input type="email" />
 *   </FormField>
 * </FormSection>
 *
 * // With description
 * <FormSection
 *   title="Notification Settings"
 *   description="Choose how you want to receive updates"
 * >
 *   {/* notification fields *\/}
 * </FormSection>
 *
 * // As fieldset (for radio/checkbox groups)
 * <FormSection title="Preferences" asFieldset>
 *   <label>
 *     <input type="radio" name="pref" /> Option A
 *   </label>
 *   <label>
 *     <input type="radio" name="pref" /> Option B
 *   </label>
 * </FormSection>
 *
 * // Multi-section form
 * <form className="space-y-8">
 *   <FormSection title="Account">
 *     {/* account fields *\/}
 *   </FormSection>
 *
 *   <FormSection title="Profile">
 *     {/* profile fields *\/}
 *   </FormSection>
 *
 *   <FormSection title="Security">
 *     {/* security fields *\/}
 *   </FormSection>
 *
 *   <button type="submit">Save All</button>
 * </form>
 *
 * STYLING NOTES:
 *
 * Add visual separation between sections:
 *
 * // With border
 * <FormSection className="border-b pb-6" ...>
 *
 * // With background
 * <FormSection className="bg-slate-50 p-4 rounded" ...>
 *
 * // With divider above title
 * <FormSection className="border-t pt-6" ...>
 *
 * ACCESSIBILITY:
 *
 * - Use asFieldset=true for radio/checkbox groups
 * - legend is read by screen readers as group label
 * - Sections help screen reader users navigate
 */
