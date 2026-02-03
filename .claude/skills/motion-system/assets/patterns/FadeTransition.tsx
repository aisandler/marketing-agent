/**
 * FadeTransition - Motion pattern template
 *
 * Wrapper component for fade/slide transitions between content.
 * Uses Framer Motion for smooth enter/exit animations.
 */

import React, { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface FadeTransitionProps {
  /** Unique key to trigger transition on change */
  transitionKey: string | number;
  /** Content to render */
  children: ReactNode;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to include blur effect */
  blur?: boolean;
  /** Whether to include slide effect */
  slide?: boolean;
  /** Slide direction */
  slideDirection?: 'up' | 'down' | 'left' | 'right';
  /** Slide distance in pixels */
  slideDistance?: number;
  /** Optional className */
  className?: string;
}

const FadeTransition: React.FC<FadeTransitionProps> = ({
  transitionKey,
  children,
  duration = 0.2,
  blur = false,
  slide = false,
  slideDirection = 'up',
  slideDistance = 10,
  className = ''
}) => {
  // Calculate slide offset
  const getSlideOffset = () => {
    if (!slide) return { x: 0, y: 0 };

    switch (slideDirection) {
      case 'up': return { x: 0, y: slideDistance };
      case 'down': return { x: 0, y: -slideDistance };
      case 'left': return { x: slideDistance, y: 0 };
      case 'right': return { x: -slideDistance, y: 0 };
    }
  };

  const offset = getSlideOffset();

  const variants: Variants = {
    initial: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      filter: blur ? 'blur(4px)' : 'blur(0px)'
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      x: -offset.x,
      y: -offset.y,
      filter: blur ? 'blur(4px)' : 'blur(0px)'
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default FadeTransition;

/**
 * USAGE:
 *
 * // Basic fade
 * <FadeTransition transitionKey={currentTab}>
 *   <TabContent />
 * </FadeTransition>
 *
 * // With blur (panel transitions)
 * <FadeTransition transitionKey={mode} blur>
 *   <ModeContent />
 * </FadeTransition>
 *
 * // With slide
 * <FadeTransition transitionKey={page} slide slideDirection="up">
 *   <PageContent />
 * </FadeTransition>
 *
 * // Custom duration
 * <FadeTransition transitionKey={id} duration={0.3}>
 *   <Content />
 * </FadeTransition>
 *
 * TIMING GUIDELINES:
 *
 * - duration={0.15}: Fast, for tab content switching
 * - duration={0.2}: Standard, for most transitions (DEFAULT)
 * - duration={0.3}: Deliberate, for page-level transitions
 *
 * REDUCED MOTION:
 *
 * For accessibility, consider wrapping with reduced motion check:
 *
 * const prefersReduced = usePrefersReducedMotion();
 * <FadeTransition duration={prefersReduced ? 0 : 0.2} ...>
 */
