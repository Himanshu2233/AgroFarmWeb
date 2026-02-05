import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

// Reusable Modal Component with auto-focus and viewport centering
const Modal = ({ 
  isOpen, 
  onClose, 
  children,
  size = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  autoFocus = true,
  className = '',
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [closeOnEscape, onClose]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Get all focusable elements within modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    const focusableSelectors = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href]';
    return Array.from(modalRef.current.querySelectorAll(focusableSelectors));
  }, []);

  // Focus trap handler
  const handleTabKey = useCallback((e) => {
    if (e.key !== 'Tab') return;
    
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
  }, [getFocusableElements]);
  
  // Add/remove event listeners, manage focus, and lock body scroll
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousActiveElement.current = document.activeElement;
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';

      // Scroll modal content to top and focus first input
      if (autoFocus) {
        setTimeout(() => {
          if (modalRef.current) {
            // Scroll to top
            const scrollContainer = modalRef.current.querySelector('[data-modal-scroll]') || modalRef.current;
            scrollContainer.scrollTop = 0;
            
            // Focus first input/select/textarea
            const focusables = getFocusableElements();
            const firstInput = focusables.find(el => 
              ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
            );
            if (firstInput) {
              firstInput.focus();
            } else if (focusables.length > 0) {
              focusables[0].focus();
            }
          }
        }, 50);
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
      
      // Restore focus on close
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleEscape, handleTabKey, autoFocus, getFocusableElements]);
  
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-sm',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
      
      {/* Modal Centering Container - Fixed viewport centering */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className={`
              relative bg-white rounded-2xl shadow-2xl
              w-full ${sizes[size]}
              max-h-[90vh] sm:max-h-[85vh] flex flex-col
              animate-modalSlideIn
              my-auto
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 z-10"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
};

// Modal Header
Modal.Header = ({ children, className = '' }) => (
  <div className={`px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0 ${className}`}>
    {children}
  </div>
);

// Modal Title
Modal.Title = ({ children, className = '' }) => (
  <h2 className={`text-xl font-bold text-gray-900 ${className}`}>
    {children}
  </h2>
);

// Modal Description
Modal.Description = ({ children, className = '' }) => (
  <p className={`mt-1 text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

// Modal Body
Modal.Body = ({ children, className = '' }) => (
  <div className={`px-6 py-4 overflow-y-auto flex-1 ${className}`}>
    {children}
  </div>
);

// Modal Footer
Modal.Footer = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0 ${className}`}>
    {children}
  </div>
);

export default Modal;
