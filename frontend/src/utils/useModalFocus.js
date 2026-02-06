import { useEffect, useRef, useCallback } from 'react';

/**
 * useModalFocus - Manages focus behavior for modals
 * - Scrolls modal to top when opened
 * - Focuses first focusable element
 * - Traps focus within modal
 * - Restores focus on close
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {Object} options - Configuration options
 * @returns {Object} { modalRef } - Ref to attach to modal container
 */
export function useModalFocus(isOpen, options = {}) {
  const {
    autoFocus = true,
    trapFocus = true,
    restoreFocus = true,
    scrollToTop = true,
  } = options;

  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Get all focusable elements within modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'a[href]',
    ].join(', ');

    return Array.from(modalRef.current.querySelectorAll(focusableSelectors));
  }, []);

  // Focus first element
  const focusFirstElement = useCallback(() => {
    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      // Find first input/select/textarea, or fall back to first focusable
      const firstInput = focusables.find(el => 
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
      );
      (firstInput || focusables[0]).focus();
    }
  }, [getFocusableElements]);

  // Handle focus trap
  const handleKeyDown = useCallback((e) => {
    if (!trapFocus || e.key !== 'Tab') return;

    const focusables = getFocusableElements();
    if (focusables.length === 0) return;

    const firstElement = focusables[0];
    const lastElement = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, [trapFocus, getFocusableElements]);

  // Handle open/close
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      if (restoreFocus) {
        previousActiveElement.current = document.activeElement;
      }

      // Scroll modal to top
      if (scrollToTop && modalRef.current) {
        // Find scrollable container within modal
        const scrollContainer = modalRef.current.querySelector('[data-modal-scroll]') 
          || modalRef.current;
        scrollContainer.scrollTop = 0;
      }

      // Auto focus first element after brief delay for animation
      if (autoFocus) {
        setTimeout(focusFirstElement, 50);
      }

      // Add keydown listener for focus trap
      if (trapFocus) {
        document.addEventListener('keydown', handleKeyDown);
      }
    } else {
      // Restore focus on close
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, autoFocus, trapFocus, restoreFocus, scrollToTop, focusFirstElement, handleKeyDown]);

  return { modalRef };
}

/**
 * useScrollToTopOnOpen - Simpler hook to just scroll to top when a value changes
 * @param {boolean} trigger - Value that triggers scroll when truthy
 * @param {Object} ref - Ref to scrollable element
 */
export function useScrollToTopOnOpen(trigger, ref) {
  useEffect(() => {
    if (trigger && ref?.current) {
      ref.current.scrollTop = 0;
    }
  }, [trigger, ref]);
}

export default useModalFocus;
