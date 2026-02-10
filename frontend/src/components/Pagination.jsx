import { useMemo } from 'react';

/**
 * Pagination Component - Reusable pagination with smart page range
 * Features: Page numbers, prev/next, items per page selector, keyboard navigation
 */
export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 20, 50, 100],
  siblingCount = 1,
  className = '',
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis
    
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, '...', ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return [];
  }, [totalPages, currentPage, siblingCount]);

  if (totalPages <= 1 && !showItemsPerPage) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items info and per page selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{startItem}-{endItem}</span> of{' '}
          <span className="font-medium text-gray-700">{totalItems}</span>
        </span>
        
        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">|</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1); // Reset to first page
              }}
              className="px-2.5 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white cursor-pointer text-gray-600"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page navigation */}
      {totalPages > 1 && (
        <nav className="flex items-center gap-1.5">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
            title="Previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-green-600 text-white shadow-sm shadow-green-500/30'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
            title="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}

// Compact pagination for mobile
export function PaginationCompact({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>
      
      <span className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}


