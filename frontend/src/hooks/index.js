/**
 * Custom Hooks Module - Central Export
 * Import hooks from '@/hooks' or './hooks'
 */

// Navigation & UI Hooks
export { useScrollToTop } from './useScrollToTop';
export { useScrollPosition } from './useScrollPosition';
export { useDocumentTitle } from './useDocumentTitle';
export { useOnClickOutside } from './useOnClickOutside';

// State Management Hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';

// Responsive Hooks
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, usePrefersDarkMode } from './useMediaQuery';

// Form Hooks
export { useZodForm, default as useZodFormDefault } from './useZodForm';
