import { useState, useEffect } from 'react';

/**
 * useMediaQuery - Tracks media query matches
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    // Listen for changes
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
    } else {
      mediaQuery.addEventListener('change', handler);
    }

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handler);
      } else {
        mediaQuery.removeEventListener('change', handler);
      }
    };
  }, [query]);

  return matches;
}

// Preset breakpoint hooks
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

export default useMediaQuery;
