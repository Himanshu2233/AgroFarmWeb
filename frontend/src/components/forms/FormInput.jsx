import { useFormContext } from 'react-hook-form';
import { FieldError } from '../FormError';

export default function FormInput({
  name,
  label,
  type = 'text',
  placeholder = '',
  leftIcon,
  rightIcon,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          id={name}
          type={type}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon ? 'pr-11' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
            }
            focus:ring-2 focus:outline-none
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      <FieldError name={name} />
    </div>
  );
}
