import React, { useId } from 'react';

// Reusable Input Component with multiple variants
const Input = React.forwardRef(({ 
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'default',
  fullWidth = true,
  className = '',
  containerClassName = '',
  type = 'text',
  id,
  required,
  ...props 
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  const baseStyles = `
    block rounded-xl border
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    placeholder:text-gray-400
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;
  
  const variants = {
    default: `
      bg-white border-gray-300
      focus:border-green-500 focus:ring-green-500/20
    `,
    filled: `
      bg-gray-100 border-transparent
      focus:bg-white focus:border-green-500 focus:ring-green-500/20
    `,
    underlined: `
      bg-transparent border-0 border-b-2 border-gray-300 rounded-none
      focus:border-green-500 focus:ring-0
    `,
  };
  
  const errorStyles = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
    : '';
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const iconPaddingLeft = leftIcon ? 'pl-10' : '';
  const iconPaddingRight = rightIcon ? 'pr-10' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            ${baseStyles}
            ${variants[variant]}
            ${errorStyles}
            ${sizes[size]}
            ${widthStyles}
            ${iconPaddingLeft}
            ${iconPaddingRight}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
Input.Textarea = React.forwardRef(({ 
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  containerClassName = '',
  id,
  required,
  ...props 
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`
          block w-full rounded-xl border border-gray-300
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          focus:border-green-500 focus:ring-green-500/20
          placeholder:text-gray-400
          disabled:bg-gray-100 disabled:cursor-not-allowed
          px-4 py-2.5 text-sm
          resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.Textarea.displayName = 'Input.Textarea';

// Select Component
Input.Select = React.forwardRef(({ 
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  id,
  required,
  ...props 
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={inputId}
        className={`
          block w-full rounded-xl border border-gray-300
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          focus:border-green-500 focus:ring-green-500/20
          disabled:bg-gray-100 disabled:cursor-not-allowed
          px-4 py-2.5 text-sm
          appearance-none
          bg-white
          cursor-pointer
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '16px',
          paddingRight: '40px',
        }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.Select.displayName = 'Input.Select';

export default Input;
