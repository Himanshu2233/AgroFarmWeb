import React from 'react';

// Reusable Card Component with multiple variants
const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'default',
  onClick,
  ...props 
}) => {
  const baseStyles = 'rounded-xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white border border-gray-100 shadow-sm',
    elevated: 'bg-white shadow-lg',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100',
    warning: 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100',
    danger: 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-100',
    info: 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100',
  };
  
  const hoverStyles = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
    : '';
    
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };
  
  return (
    <div 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${hoverStyles} 
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header subcomponent
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

// Card Body subcomponent
Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Card Footer subcomponent
Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

// Card Title subcomponent
Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

// Card Description subcomponent
Card.Description = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>
    {children}
  </p>
);

export default Card;
