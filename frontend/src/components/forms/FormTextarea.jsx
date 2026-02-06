import { useFormContext } from 'react-hook-form';
import { FieldError } from '../FormError';

export default function FormTextarea({
  name,
  label,
  placeholder = '',
  helperText,
  required = false,
  disabled = false,
  rows = 3,
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
      
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-2.5 rounded-xl border transition-all resize-none
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
          }
          focus:ring-2 focus:outline-none
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        `}
        {...props}
      />

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      <FieldError name={name} />
    </div>
  );
}
