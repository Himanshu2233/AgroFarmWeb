import { useRef, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition - Wraps pages with smooth transition animations
 * Uses CSS animations for smooth page transitions
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Only animate on path change
    if (prevPathRef.current !== location.pathname && containerRef.current) {
      const element = containerRef.current;
      element.style.opacity = '0';
      element.style.transform = 'translateY(8px)';
      
      // Force reflow
      void element.offsetHeight;
      
      // Animate in
      requestAnimationFrame(() => {
        element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
      
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="transition-all duration-300 ease-out"
    >
      {children}
    </div>
  );
}
