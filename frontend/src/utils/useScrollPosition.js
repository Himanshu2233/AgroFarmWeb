import { useState, useEffect, useCallback } from 'react';

/**
 * useScrollPosition - Tracks scroll position and direction
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Minimum scroll change to trigger update
 * @returns {Object} { scrollY, scrollX, scrollDirection, isScrolled, isAtTop, isAtBottom }
 */
export function useScrollPosition(options = {}) {
  const { threshold = 10 } = options;

  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    scrollX: 0,
    scrollDirection: null, // 'up' | 'down'
    isScrolled: false,
    isAtTop: true,
    isAtBottom: false,
  });

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    setScrollState((prev) => {
      const scrollDiff = Math.abs(currentScrollY - prev.scrollY);
      
      // Only update direction if scroll change exceeds threshold
      let scrollDirection = prev.scrollDirection;
      if (scrollDiff >= threshold) {
        scrollDirection = currentScrollY > prev.scrollY ? 'down' : 'up';
      }

      return {
        scrollY: currentScrollY,
        scrollX: currentScrollX,
        scrollDirection,
        isScrolled: currentScrollY > 20,
        isAtTop: currentScrollY < 10,
        isAtBottom: currentScrollY + windowHeight >= documentHeight - 10,
      };
    });
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return scrollState;
}

export default useScrollPosition;
