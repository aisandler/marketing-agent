/**
 * SplitScrollPanel - Structure-only template
 *
 * Pattern for panels with two independent scrollable regions.
 * Common in sidebars (tree navigation + image grid).
 * Add visual styling from your design system (soft-ui, sharp-ui, etc.)
 *
 * Structure:
 * +---------------------------+
 * |   HEADER (fixed)          |  flex-shrink-0
 * +---------------------------+
 * |                           |
 * |   UPPER SCROLL REGION     |  h-[200px] or flex-1 (proportional)
 * |   (e.g., tree nav)        |  overflow-y-auto
 * |                           |
 * +---------------------------+
 * |   DIVIDER                 |  flex-shrink-0
 * +---------------------------+
 * |                           |
 * |   LOWER SCROLL REGION     |  flex-1 min-h-0
 * |   (e.g., image grid)      |  overflow-y-auto
 * |                           |
 * +---------------------------+
 *
 * Usage:
 * ```tsx
 * <SplitScrollPanel
 *   header={<SearchInput />}
 *   upper={<TreeNavigation />}
 *   lower={<ImageGrid />}
 *   upperHeight="200px"
 * />
 * ```
 */

import React, { ReactNode } from 'react';

interface SplitScrollPanelProps {
  /** Fixed header content (optional) */
  header?: ReactNode;
  /** Upper scrollable region content */
  upper: ReactNode;
  /** Lower scrollable region content */
  lower: ReactNode;
  /**
   * Height of upper region.
   * - Fixed: "200px", "300px"
   * - Proportional: "50%" (use with lowerHeight)
   * - Flexible: "auto" (upper grows with content, lower gets remainder)
   * Default: "200px"
   */
  upperHeight?: string;
  /** Show divider between regions */
  showDivider?: boolean;
  /** Optional className for the container */
  className?: string;
}

const SplitScrollPanel: React.FC<SplitScrollPanelProps> = ({
  header,
  upper,
  lower,
  upperHeight = '200px',
  showDivider = true,
  className = ''
}) => {
  // Determine if upper section should be fixed height or flexible
  const isFixedHeight = upperHeight.endsWith('px');

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      {/* Fixed Header
       * Add: px-4 py-3 border-b border-* bg-* from visual system
       */}
      {header && (
        <div className="flex-shrink-0">
          {header}
        </div>
      )}

      {/* Upper Scroll Region
       * Fixed height variant: specific pixel height
       * Proportional variant: flex-1 (50/50 split with lower)
       */}
      <div
        className={`
          overflow-y-auto
          ${isFixedHeight ? 'flex-shrink-0' : 'flex-1 min-h-0'}
        `}
        style={isFixedHeight ? { height: upperHeight } : undefined}
      >
        {upper}
      </div>

      {/* Divider
       * Add: border-b border-* from visual system
       */}
      {showDivider && (
        <div className="flex-shrink-0 border-b" />
      )}

      {/* Lower Scroll Region
       * Always fills remaining space
       * min-h-0 required for scroll to work
       */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {lower}
      </div>
    </div>
  );
};

export default SplitScrollPanel;

/**
 * COMMON USE CASES:
 *
 * 1. Sidebar with tree + grid
 *    - Upper: Tree navigation (fixed 200-300px)
 *    - Lower: Image/asset grid (fills remainder)
 *
 * 2. Two equal sections
 *    - Set upperHeight to "auto" and both regions use flex-1
 *    - Each gets 50% of available space
 *
 * 3. Collapsible upper section
 *    - Toggle upperHeight between "0px" and "200px"
 *    - Add transition-all duration-300 for animation
 *
 * STRUCTURAL PATTERNS:
 *
 * 1. Fixed + Flexible Split
 *    - Upper has fixed height (h-[200px] flex-shrink-0)
 *    - Lower fills remainder (flex-1 min-h-0)
 *
 * 2. Proportional Split
 *    - Both use flex-1 min-h-0
 *    - Each gets equal space
 *
 * 3. Independent Scroll Contexts
 *    - Each region has overflow-y-auto
 *    - Scrolling one doesn't affect the other
 *
 * RESIZABLE VARIANT:
 *
 * For user-resizable split, add a drag handle:
 *
 * ```tsx
 * <div
 *   className="flex-shrink-0 h-1 cursor-row-resize hover:bg-indigo-500/20"
 *   onMouseDown={startResize}
 * />
 * ```
 */
