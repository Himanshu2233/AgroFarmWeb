/**
 * FormError - Displays form error messages with styling
 */
export default function FormError({ message, className = '' }) {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}

// Field-level error component
export function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
      </svg>
      {message}
    </p>
  );
}
