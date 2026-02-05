import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../utils';

/**
 * SearchBar - Reusable search component with debounced input
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
  size = 'default',
  showClear = true,
  autoFocus = false,
  onFocus,
  onBlur,
  color = 'green', // 'green', 'orange', 'blue', 'gray'
}) {
  const [localValue, setLocalValue] = useState(value || '');
  const debouncedValue = useDebounce(localValue, debounceMs);
  const inputRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Trigger onChange when debounced value changes
  useEffect(() => {
    if (onChange && debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const sizes = {
    sm: 'py-2 pl-9 pr-9 text-sm',
    default: 'py-3 pl-11 pr-11 text-sm',
    lg: 'py-4 pl-12 pr-12 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4 left-2.5',
    default: 'w-5 h-5 left-3',
    lg: 'w-6 h-6 left-3.5',
  };

  const clearBtnSizes = {
    sm: 'right-2.5',
    default: 'right-3',
    lg: 'right-3.5',
  };

  const colors = {
    green: 'focus:ring-green-500 focus:border-green-500',
    orange: 'focus:ring-orange-500 focus:border-orange-500',
    blue: 'focus:ring-blue-500 focus:border-blue-500',
    gray: 'focus:ring-gray-500 focus:border-gray-500',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <svg 
        className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconSizes[size]}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`
          w-full bg-gray-50 border border-gray-200 rounded-xl
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:bg-white
          placeholder:text-gray-400
          ${sizes[size]}
          ${colors[color]}
        `}
      />

      {/* Clear Button */}
      {showClear && localValue && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            absolute top-1/2 -translate-y-1/2 
            p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200
            transition-colors
            ${clearBtnSizes[size]}
          `}
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * SearchBarWithFilters - Search bar with additional filter dropdowns
 */
export function SearchBarWithFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  className = '',
  color = 'green',
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            color={color}
          />
        </div>

        {/* Filters */}
        {filters.map((filter, index) => (
          <div key={index} className={filter.className || 'sm:w-48'}>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className={`
                w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:bg-white
                transition-all duration-200 appearance-none
                text-sm
                ${color === 'green' ? 'focus:ring-green-500 focus:border-green-500' : ''}
                ${color === 'orange' ? 'focus:ring-orange-500 focus:border-orange-500' : ''}
                ${color === 'blue' ? 'focus:ring-blue-500 focus:border-blue-500' : ''}
              `}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
