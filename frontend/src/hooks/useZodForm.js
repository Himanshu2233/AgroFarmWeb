import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * useZodForm - Custom hook that combines React Hook Form with Zod validation
 * @param {Object} options - Form options
 * @param {import('zod').ZodSchema} options.schema - Zod validation schema
 * @param {Object} options.defaultValues - Default form values
 * @param {string} options.mode - Validation mode ('onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all')
 * @returns {Object} React Hook Form methods with Zod validation
 */
export function useZodForm({ schema, defaultValues = {}, mode = 'onBlur', ...options }) {
  return useReactHookForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
    ...options,
  });
}

export default useZodForm;
