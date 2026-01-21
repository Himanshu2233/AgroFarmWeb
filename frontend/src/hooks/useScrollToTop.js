import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useScrollToTop - Scrolls to top on route change
 * @param {Object} options - Configuration options
 * @param {string} options.behavior - 'smooth' | 'instant' | 'auto'
 * @param {number} options.delay - Delay before scrolling (ms)
 */
export function useScrollToTop(options = {}) {
  const { behavior = 'smooth', delay = 0 } = options;
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname, behavior, delay]);
}

export default useScrollToTop;
