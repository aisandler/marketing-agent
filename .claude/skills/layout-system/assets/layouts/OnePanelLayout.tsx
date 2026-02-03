/**
 * OnePanelLayout - Structure-only template
 *
 * Simple layout with optional right sidebar for detail views.
 * Add visual styling from your design system (soft-ui, sharp-ui, etc.)
 *
 * Structure:
 * +-----------------------------------+---------------+
 * |   MAIN CONTENT                    |   RIGHT       |
 * |   (full width)                    |   SIDEBAR     |
 * |   flex-1                          |   320px       |
 * +-----------------------------------+---------------+
 *
 * Usage:
 * ```tsx
 * <OnePanelLayout rightSidebar={<DetailsPanel />}>
 *   <MainContent />
 * </OnePanelLayout>
 * ```
 *
 * To add styling, wrap or extend with your visual system classes:
 * - Borders: border-r, border-l (colors from visual system)
 * - Backgrounds: bg-* (from visual system)
 */

import React, { ReactNode } from 'react';

interface OnePanelLayoutProps {
  /** Main content area */
  children: ReactNode;
  /** Optional content for the right sidebar (details, preview) */
  rightSidebar?: ReactNode;
  /** Optional className for the container */
  className?: string;
}

const OnePanelLayout: React.FC<OnePanelLayoutProps> = ({
  children,
  rightSidebar,
  className = ''
}) => {
  return (
    <div className={`flex flex-1 h-full overflow-hidden ${className}`}>
      {/* Main Content - Full Width
       * Key classes:
       * - flex-1: Grows to fill available space
       * - overflow-hidden: Contains scroll
       * Add: bg-* from visual system
       */}
      <div className="flex-1 h-full overflow-hidden relative">
        {children}
      </div>

      {/* Optional Right Sidebar - Fixed 320px
       * Key classes:
       * - w-80 (320px): Fixed width
       * - flex-shrink-0: Prevents shrinking
       * - overflow-hidden: Contains scroll
       * Add: border-l border-* bg-* from visual system
       */}
      {rightSidebar && (
        <div className="w-80 h-full overflow-hidden flex-shrink-0">
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default OnePanelLayout;

/**
 * WHEN TO USE:
 *
 * Use OnePanelLayout instead of ThreePanelLayout when:
 * - No left navigation is needed
 * - Content should be the focus
 * - Simpler views (settings, profile, single-item focus)
 * - Mobile/tablet where left sidebar would be hidden anyway
 *
 * STRUCTURAL PATTERNS USED:
 *
 * 1. Fixed + Flexible Pattern
 *    - Main content uses flex-1 to fill space
 *    - Right sidebar uses fixed width (w-80 = 320px)
 *    - flex-shrink-0 prevents sidebar from shrinking
 *
 * 2. Scroll Containment
 *    - Parent has overflow-hidden
 *    - Each section contains its own scroll
 */
