import React from 'react';

// Icons for different alert types
const AlertIcons = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Reusable Alert Component
const Alert = ({ 
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  ...props 
}) => {
  const variants = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: 'text-emerald-500',
      title: 'text-emerald-800',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
      title: 'text-red-800',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: 'text-amber-500',
      title: 'text-amber-800',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-500',
      title: 'text-blue-800',
    },
  };
  
  const styles = variants[variant];
  const IconComponent = icon || AlertIcons[variant];
  
  return (
    <div 
      className={`
        relative flex gap-3 p-4 rounded-xl border
        ${styles.container}
        ${className}
      `}
      role="alert"
      {...props}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${styles.icon}`}>
        {IconComponent}
      </div>
      
      {/* Content */}
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold mb-1 ${styles.title}`}>
            {title}
          </h4>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>
      
      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors ${styles.icon}`}
          aria-label="Dismiss alert"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Inline Alert (smaller, for form feedback)
Alert.Inline = ({ children, variant = 'error', className = '' }) => {
  const variants = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };
  
  return (
    <p className={`flex items-center gap-1.5 text-sm ${variants[variant]} ${className}`}>
      <span className="text-xs">{icons[variant]}</span>
      {children}
    </p>
  );
};

// Toast-style Alert - Separate component for proper hooks usage
const AlertToast = ({ 
  message, 
  variant = 'success',
  isVisible,
  onClose,
  duration = 3000,
  position = 'top-right',
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  if (!isVisible) return null;
  
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  
  const toastVariants = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white',
  };
  
  return (
    <div 
      className={`
        fixed ${positions[position]} z-50
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        ${toastVariants[variant]}
        animate-slideInRight
      `}
    >
      <span className="text-sm font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Attach as static property
Alert.Toast = AlertToast;

export default Alert;
