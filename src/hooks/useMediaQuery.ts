import { useState, useEffect } from 'react';

/**
 * useMediaQuery - Hook for responsive breakpoint detection
 * 
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the query matches
 * 
 * @example
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 * const isMobile = !isDesktop;
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with a check (SSR-safe default to false)
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Legacy browsers (Safari < 14)
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Tailwind-aligned breakpoint hooks
 */
export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 768px)');
}

export function useIsTablet(): boolean {
  const isAboveMobile = useMediaQuery('(min-width: 768px)');
  const isBelowDesktop = !useMediaQuery('(min-width: 1024px)');
  return isAboveMobile && isBelowDesktop;
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * Breakpoint constants (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;
