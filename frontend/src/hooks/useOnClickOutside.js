import { useEffect, useRef } from 'react';

/**
 * useOnClickOutside - Detects clicks outside an element
 * @param {Function} handler - Callback when click outside occurs
 * @param {boolean} enabled - Whether the hook is enabled
 * @returns {Object} Ref to attach to the element
 */
export function useOnClickOutside(handler, enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      const el = ref.current;
      
      // Do nothing if clicking ref's element or its descendants
      if (!el || el.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, enabled]);

  return ref;
}

export default useOnClickOutside;
