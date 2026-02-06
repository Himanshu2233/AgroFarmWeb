import { useEffect, useRef } from 'react';

/**
 * useDocumentTitle - Updates document title dynamically
 * @param {string} title - Page title
 * @param {Object} options - Configuration options
 * @param {boolean} options.restoreOnUnmount - Restore previous title on unmount
 * @param {string} options.suffix - Suffix to append (e.g., '| AgroFarm')
 */
export function useDocumentTitle(title, options = {}) {
  const { restoreOnUnmount = true, suffix = ' | AgroFarm' } = options;
  const previousTitle = useRef(document.title);

  useEffect(() => {
    // Capture previous title for cleanup
    const savedTitle = previousTitle.current;
    const fullTitle = title ? `${title}${suffix}` : 'AgroFarm';
    document.title = fullTitle;

    return () => {
      if (restoreOnUnmount) {
        document.title = savedTitle;
      }
    };
  }, [title, suffix, restoreOnUnmount]);
}

export default useDocumentTitle;
