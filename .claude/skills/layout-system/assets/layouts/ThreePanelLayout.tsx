/**
 * ThreePanelLayout - Structure-only template
 *
 * Standard three-panel layout for workspace applications.
 * Add visual styling from your design system (soft-ui, sharp-ui, etc.)
 *
 * Structure:
 * +---------------+-------------------+---------------+
 * |   LEFT        |   CENTER          |   RIGHT       |
 * |   SIDEBAR     |   (main content)  |   SIDEBAR     |
 * |   280px       |   flex-1          |   360px       |
 * +---------------+-------------------+---------------+
 *
 * Usage:
 * ```tsx
 * <ThreePanelLayout
 *   leftSidebar={<Navigation />}
 *   rightSidebar={<DetailsPanel />}
 * >
 *   <MainContent />
 * </ThreePanelLayout>
 * ```
 *
 * To add styling, wrap or extend with your visual system classes:
 * - Borders: border-r, border-l (colors from visual system)
 * - Backgrounds: bg-* (from visual system)
 * - Shadows: shadow-* (from visual system)
 */

import React, { ReactNode } from 'react';

interface ThreePanelLayoutProps {
  /** Content for the left sidebar (navigation, tree views) */
  leftSidebar: ReactNode;
  /** Optional content for the right sidebar (details, controls) */
  rightSidebar?: ReactNode;
  /** Main content area */
  children: ReactNode;
  /** Optional className for the container */
  className?: string;
}

const ThreePanelLayout: React.FC<ThreePanelLayoutProps> = ({
  leftSidebar,
  rightSidebar,
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-1 h-full overflow-hidden min-h-0 ${className}`}>
      {/* Left Sidebar - Fixed 280px
       * Key classes:
       * - w-[280px]: Fixed width
       * - flex-shrink-0: Prevents shrinking
       * - overflow-hidden: Contains scroll
       * Add: border-r border-* bg-* from visual system
       */}
      <div className="w-[280px] flex-shrink-0 flex flex-col overflow-hidden">
        <div className="h-full overflow-hidden flex flex-col">
          {leftSidebar}
        </div>
      </div>

      {/* Center Content - Flexible
       * Key classes:
       * - flex-1: Grows to fill available space
       * - min-w-0: Allows shrinking below content width
       * - overflow-hidden: Contains scroll
       * Add: bg-* from visual system
       */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden">
          {children}
        </div>
      </div>

      {/* Right Sidebar - Fixed 360px (optional)
       * Key classes:
       * - w-[360px]: Fixed width
       * - flex-shrink-0: Prevents shrinking
       * - overflow-hidden: Contains scroll
       * Add: border-l border-* bg-* from visual system
       */}
      {rightSidebar && (
        <div className="w-[360px] flex-shrink-0 flex flex-col overflow-hidden">
          <div className="h-full overflow-hidden flex flex-col">
            {rightSidebar}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreePanelLayout;

/**
 * STRUCTURAL PATTERNS USED:
 *
 * 1. Fixed + Flexible Pattern
 *    - Sidebars use fixed pixel widths (w-[280px], w-[360px])
 *    - Center uses flex-1 to grow/shrink
 *    - flex-shrink-0 prevents sidebars from shrinking
 *
 * 2. Scroll Containment
 *    - Parent has overflow-hidden
 *    - Each panel contains its own scroll
 *    - min-h-0 on container allows children to scroll
 *
 * 3. Width Recommendations
 *    - Left sidebar: 280px (fits 3-4 level trees)
 *    - Right sidebar: 360px (fits forms, details)
 *    - For compact: 240px left, 320px right
 */
