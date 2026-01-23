import React from 'react';

// Spinner component defined outside to avoid recreation on each render
const Spinner = () => (
  <svg 
    className="animate-spin h-5 w-5" 
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * SubmitButton - Form submit button with loading state
 */
export const SubmitButton = ({
  children = 'Submit',
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'default',
  fullWidth = true,
  className = '',
  loadingText = 'Please wait...',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-green-600 to-green-500
      text-white
      hover:from-green-700 hover:to-green-600
      focus:ring-green-500
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gray-100 text-gray-900
      hover:bg-gray-200
      focus:ring-gray-500
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-500
      text-white
      hover:from-red-700 hover:to-red-600
      focus:ring-red-500
    `,
    outline: `
      border-2 border-green-600 text-green-600
      hover:bg-green-50
      focus:ring-green-500
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthStyles}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
