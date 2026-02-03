/**
 * CSSFadeTransition - CSS-only alternative to Framer Motion
 *
 * Pure CSS/Tailwind transitions without external dependencies.
 * Use when you don't want to add Framer Motion to your project.
 */

import React, { ReactNode, useState, useEffect, useRef } from 'react';

interface CSSFadeTransitionProps {
  /** Whether content is visible */
  show: boolean;
  /** Content to render */
  children: ReactNode;
  /** Animation duration in ms */
  duration?: number;
  /** Whether to unmount when hidden */
  unmountOnHide?: boolean;
  /** Include slide effect */
  slide?: boolean;
  /** Slide direction */
  slideDirection?: 'up' | 'down' | 'left' | 'right';
  /** Slide distance in pixels */
  slideDistance?: number;
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
  /** Optional className */
  className?: string;
}

/**
 * CSS-only fade transition component
 * No external dependencies - uses Tailwind or inline styles
 */
const CSSFadeTransition: React.FC<CSSFadeTransitionProps> = ({
  show,
  children,
  duration = 200,
  unmountOnHide = true,
  slide = false,
  slideDirection = 'up',
  slideDistance = 10,
  onExitComplete,
  className = '',
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for transition
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      if (unmountOnHide) {
        timeoutRef.current = setTimeout(() => {
          setShouldRender(false);
          onExitComplete?.();
        }, duration);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [show, duration, unmountOnHide, onExitComplete]);

  if (!shouldRender && unmountOnHide) return null;

  // Calculate slide transform
  const getTransform = () => {
    if (!slide || isAnimating) return 'translate(0, 0)';

    switch (slideDirection) {
      case 'up': return `translate(0, ${slideDistance}px)`;
      case 'down': return `translate(0, -${slideDistance}px)`;
      case 'left': return `translate(${slideDistance}px, 0)`;
      case 'right': return `translate(-${slideDistance}px, 0)`;
    }
  };

  return (
    <div
      className={className}
      style={{
        opacity: isAnimating ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Staggered children animation wrapper
 * Animates children with delay between each
 */
interface StaggeredFadeProps {
  /** Whether children are visible */
  show: boolean;
  /** Child elements to animate */
  children: ReactNode[];
  /** Base duration per item */
  duration?: number;
  /** Delay between each child */
  staggerDelay?: number;
  /** Optional className for wrapper */
  className?: string;
  /** Optional className for each child wrapper */
  childClassName?: string;
}

export const StaggeredFade: React.FC<StaggeredFadeProps> = ({
  show,
  children,
  duration = 200,
  staggerDelay = 50,
  className = '',
  childClassName = '',
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className={childClassName}
          style={{
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
            transitionDelay: show ? `${index * staggerDelay}ms` : '0ms',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * Simple opacity-only fade (Tailwind classes)
 */
interface SimpleFadeProps {
  show: boolean;
  children: ReactNode;
  className?: string;
}

export const SimpleFade: React.FC<SimpleFadeProps> = ({
  show,
  children,
  className = '',
}) => (
  <div
    className={`
      transition-opacity duration-200 ease-out
      ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      ${className}
    `.trim().replace(/\s+/g, ' ')}
  >
    {children}
  </div>
);

export default CSSFadeTransition;

/**
 * USAGE:
 *
 * // Basic fade
 * <CSSFadeTransition show={isVisible}>
 *   <Content />
 * </CSSFadeTransition>
 *
 * // With slide
 * <CSSFadeTransition show={isVisible} slide slideDirection="up">
 *   <Modal />
 * </CSSFadeTransition>
 *
 * // Custom duration
 * <CSSFadeTransition show={isVisible} duration={300}>
 *   <Panel />
 * </CSSFadeTransition>
 *
 * // Don't unmount (keep in DOM)
 * <CSSFadeTransition show={isVisible} unmountOnHide={false}>
 *   <HeavyComponent />
 * </CSSFadeTransition>
 *
 * // Staggered list animation
 * <StaggeredFade show={isLoaded} staggerDelay={50}>
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </StaggeredFade>
 *
 * // Simple fade (Tailwind only, no logic)
 * <SimpleFade show={isOpen}>
 *   <Dropdown />
 * </SimpleFade>
 *
 * REDUCED MOTION:
 *
 * Wrap with media query check:
 *
 * const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 * <CSSFadeTransition duration={prefersReduced ? 0 : 200} ...>
 *
 * Or use CSS:
 *
 * @media (prefers-reduced-motion: reduce) {
 *   * {
 *     transition-duration: 0.01ms !important;
 *   }
 * }
 *
 * COMPARISON WITH FRAMER MOTION:
 *
 * | Feature | CSSFadeTransition | FadeTransition (Framer) |
 * |---------|-------------------|-------------------------|
 * | Bundle size | 0 KB | ~15 KB |
 * | Exit animations | Basic | Full control |
 * | Spring physics | No | Yes |
 * | Gesture support | No | Yes |
 * | Use when | Simple fades | Complex animations |
 */
