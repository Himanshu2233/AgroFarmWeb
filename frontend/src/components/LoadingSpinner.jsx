export default function LoadingSpinner({ size = 'default', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Spinning circle */}
        <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg animate-pulse">🌾</span>
        </div>
      </div>
      {text && <p className="text-green-800 font-medium animate-pulse">{text}</p>}
    </div>
  );
}

// Full page loading
export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded-full mt-4"></div>
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );
}
