export default function SubmitButton({ 
  children, 
  loading = false, 
  loadingText = 'Loading...', 
  disabled = false,
  className = '' 
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`
        w-full py-3 px-6 rounded-xl font-medium transition-all
        bg-gradient-to-r from-green-600 to-emerald-600 
        hover:from-green-700 hover:to-emerald-700
        text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
