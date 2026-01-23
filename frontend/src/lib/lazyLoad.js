import { lazy, Suspense } from 'react';
import { PageLoader } from '../../components/common/PageLoader';

/**
 * Lazy Loading Utility
 * Creates a lazy-loaded component with automatic suspense fallback
 */

// Standard lazy load with retry logic
export function lazyLoad(importFn, retries = 3, delay = 1000) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attempt = (retriesLeft) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft > 0) {
              setTimeout(() => attempt(retriesLeft - 1), delay);
            } else {
              reject(error);
            }
          });
      };
      attempt(retries);
    });
  });
}

// Named export lazy load (for components not default exported)
export function lazyLoadNamed(importFn, exportName) {
  return lazy(async () => {
    const module = await importFn();
    return { default: module[exportName] };
  });
}

// Suspense wrapper component
export function LazyComponent({ children, fallback }) {
  return (
    <Suspense fallback={fallback || <PageLoader />}>
      {children}
    </Suspense>
  );
}

// Preload utility for route prefetching
export function preloadComponent(importFn) {
  importFn();
}

export default {
  lazyLoad,
  lazyLoadNamed,
  LazyComponent,
  preloadComponent,
};
