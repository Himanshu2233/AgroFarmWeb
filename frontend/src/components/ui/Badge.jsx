import React from 'react';

// Reusable Badge Component with multiple variants
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'default',
  dot = false,
  rounded = 'full',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-green-100 text-green-700',
    secondary: 'bg-gray-200 text-gray-800',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
    outline: 'bg-transparent border border-current',
    'outline-success': 'bg-transparent border border-emerald-500 text-emerald-600',
    'outline-warning': 'bg-transparent border border-amber-500 text-amber-600',
    'outline-danger': 'bg-transparent border border-red-500 text-red-600',
  };
  
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded',
    default: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-green-500',
    secondary: 'bg-gray-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };
  
  return (
    <span 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${roundedStyles[rounded]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span 
          className={`
            w-1.5 h-1.5 rounded-full mr-1.5 
            ${dotColors[variant] || dotColors.default}
          `}
        />
      )}
      {children}
    </span>
  );
};

// Status Badge with specific statuses
Badge.Status = ({ status, className = '' }) => {
  const statusMap = {
    // Booking statuses
    pending: { variant: 'warning', label: 'Pending', dot: true },
    confirmed: { variant: 'info', label: 'Confirmed', dot: true },
    completed: { variant: 'success', label: 'Completed', dot: true },
    cancelled: { variant: 'danger', label: 'Cancelled', dot: true },
    
    // Stock statuses
    'in-stock': { variant: 'success', label: 'In Stock' },
    'low-stock': { variant: 'warning', label: 'Low Stock' },
    'out-of-stock': { variant: 'danger', label: 'Out of Stock' },
    
    // User statuses
    active: { variant: 'success', label: 'Active', dot: true },
    inactive: { variant: 'default', label: 'Inactive', dot: true },
    verified: { variant: 'success', label: 'Verified' },
    unverified: { variant: 'warning', label: 'Unverified' },
    
    // General
    new: { variant: 'primary', label: 'New' },
    featured: { variant: 'purple', label: 'Featured' },
    sale: { variant: 'danger', label: 'Sale' },
    popular: { variant: 'pink', label: 'Popular' },
  };
  
  const config = statusMap[status] || { variant: 'default', label: status };
  
  return (
    <Badge 
      variant={config.variant} 
      dot={config.dot}
      className={className}
    >
      {config.label}
    </Badge>
  );
};

export default Badge;
