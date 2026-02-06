import React from 'react';

// Loading Spinner for buttons - defined outside component
const ButtonSpinner = () => (
  <svg 
    className="animate-spin h-4 w-4" 
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

// Reusable Button Component with multiple variants and sizes
const Button = ({ 
  children, 
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-green-600 to-emerald-600 
      text-white 
      hover:from-green-700 hover:to-emerald-700
      focus:ring-green-500
      shadow-lg shadow-green-500/25
      hover:shadow-xl hover:shadow-green-500/30
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200
      text-gray-800
      hover:from-gray-200 hover:to-gray-300
      focus:ring-gray-400
    `,
    outline: `
      bg-transparent
      border-2 border-green-600
      text-green-600
      hover:bg-green-50
      focus:ring-green-500
    `,
    ghost: `
      bg-transparent
      text-gray-700
      hover:bg-gray-100
      focus:ring-gray-400
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-500
      text-white
      hover:from-red-600 hover:to-rose-600
      focus:ring-red-500
      shadow-lg shadow-red-500/25
    `,
    warning: `
      bg-gradient-to-r from-amber-500 to-yellow-500
      text-white
      hover:from-amber-600 hover:to-yellow-600
      focus:ring-amber-500
      shadow-lg shadow-amber-500/25
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-teal-500
      text-white
      hover:from-emerald-600 hover:to-teal-600
      focus:ring-emerald-500
      shadow-lg shadow-emerald-500/25
    `,
    link: `
      bg-transparent
      text-green-600
      hover:text-green-700
      hover:underline
      focus:ring-0
    `,
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    default: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      type={type}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${widthStyles}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <ButtonSpinner />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// Button Group component
Button.Group = ({ children, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {children}
  </div>
);

// Icon Button component
Button.Icon = ({ 
  icon, 
  variant = 'ghost',
  size = 'default',
  className = '',
  label,
  ...props 
}) => {
  const iconSizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    default: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };
  
  return (
    <Button 
      variant={variant}
      className={`!rounded-full ${iconSizes[size]} ${className}`}
      aria-label={label}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default Button;
