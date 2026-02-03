/**
 * ScrollContainer - Structure-only template
 *
 * Standard pattern for scrollable panels with optional fixed header/footer.
 * Add visual styling from your design system (soft-ui, sharp-ui, etc.)
 *
 * Structure:
 * +---------------------------+
 * |   HEADER (fixed)          |  flex-shrink-0
 * +---------------------------+
 * |                           |
 * |   SCROLLABLE CONTENT      |  flex-1 min-h-0 overflow-y-auto
 * |                           |
 * +---------------------------+
 * |   FOOTER (fixed)          |  flex-shrink-0
 * +---------------------------+
 *
 * Usage:
 * ```tsx
 * <ScrollContainer
 *   header={<SectionHeader title="Items" />}
 *   footer={<ActionBar />}
 * >
 *   <LongContentList />
 * </ScrollContainer>
 * ```
 */

import React, { ReactNode } from 'react';

interface ScrollContainerProps {
  /** Fixed header content (optional) */
  header?: ReactNode;
  /** Fixed footer content (optional) */
  footer?: ReactNode;
  /** Scrollable main content */
  children: ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Optional className for the scrollable area */
  scrollClassName?: string;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  header,
  footer,
  children,
  className = '',
  scrollClassName = ''
}) => {
  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      {/* Fixed Header
       * Key classes:
       * - flex-shrink-0: Prevents header from shrinking
       * Add: px-4 py-3 border-b border-* bg-* from visual system
       */}
      {header && (
        <div className="flex-shrink-0">
          {header}
        </div>
      )}

      {/* Scrollable Content
       * Key classes:
       * - flex-1: Grows to fill available space
       * - min-h-0: CRITICAL - allows flex child to scroll
       * - overflow-y-auto: Shows scrollbar when content overflows
       * Add: scrollbar-* classes from visual system
       */}
      <div className={`flex-1 min-h-0 overflow-y-auto ${scrollClassName}`}>
        {children}
      </div>

      {/* Fixed Footer
       * Key classes:
       * - flex-shrink-0: Prevents footer from shrinking
       * Add: px-4 py-3 border-t border-* bg-* from visual system
       */}
      {footer && (
        <div className="flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ScrollContainer;

/**
 * WHY min-h-0 IS REQUIRED:
 *
 * In CSS flexbox, flex children have `min-height: auto` by default.
 * This means they won't shrink below their content height.
 *
 * Without min-h-0:
 * - Child tries to be as tall as its content
 * - overflow-y-auto has no effect
 * - Content pushes layout or overflows
 *
 * With min-h-0:
 * - Child can shrink to fit available space
 * - overflow-y-auto creates scrollbar
 * - Layout remains stable
 *
 * COMMON MISTAKES:
 *
 * 1. Missing min-h-0
 *    WRONG:  <div className="flex-1 overflow-y-auto">
 *    RIGHT:  <div className="flex-1 min-h-0 overflow-y-auto">
 *
 * 2. Missing overflow-hidden on parent
 *    WRONG:  <div className="flex flex-col h-full">
 *    RIGHT:  <div className="flex flex-col h-full overflow-hidden">
 *
 * 3. Using overflow-scroll instead of overflow-auto
 *    WRONG:  overflow-scroll (always shows scrollbar)
 *    RIGHT:  overflow-y-auto (shows only when needed)
 */
