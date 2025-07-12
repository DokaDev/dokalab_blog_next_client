import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMobileMenu } from '@/lib/contexts/MobileMenuContext';

/**
 * Navigation Hook
 * 
 * Custom hook that handles all navigation-related functionality including:
 * - Client-side navigation with automatic mobile menu closing
 * - Active route detection for styling
 * - Body scroll locking when mobile menu is open
 * - Hydration-safe mounting detection
 * 
 * Previously received mobile menu state via props, now uses global context
 * for better separation of concerns and reduced coupling.
 * 
 * @returns {UseNavigationReturn} Navigation state and handlers
 */

interface UseNavigationReturn {
  /** Whether component has mounted (prevents hydration issues) */
  mounted: boolean;
  /** Current pathname from Next.js router */
  pathname: string;
  /** Next.js router instance */
  router: ReturnType<typeof useRouter>;
  /** Ref for navigation element */
  navRef: React.RefObject<HTMLElement | null>;
  /** Handler for navigation link clicks */
  handleNavigation: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  /** Function to check if a route is currently active */
  isActive: (path: string) => boolean;
}

export const useNavigation = (): UseNavigationReturn => {
  // Get mobile menu state and actions from global context
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
  
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const prevPathRef = useRef(pathname);
  const navRef = useRef<HTMLElement>(null);
  
  // Track component mount state for hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);
  
  /**
   * Auto-close mobile menu on route changes
   * 
   * Compares current and previous pathnames to detect navigation.
   * Only closes menu if the path actually changed to avoid unnecessary actions.
   */
  useEffect(() => {
    if (prevPathRef.current !== pathname && isMobileMenuOpen) {
      closeMobileMenu();
    }
    prevPathRef.current = pathname;
  }, [pathname, closeMobileMenu, isMobileMenuOpen]);
  
  /**
   * Body scroll lock when mobile menu is open
   * 
   * Implements comprehensive scroll locking across different browsers:
   * - Sets body overflow and position styles
   * - Preserves scroll position during lock
   * - Handles iOS Safari quirks with html element locking
   * - Restores scroll position when unlocked
   * 
   * This prevents background scrolling while mobile menu is open.
   */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        // Store current scroll position before locking
        const scrollY = window.scrollY;
        
        // Apply multiple scroll lock methods for cross-browser compatibility
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        
        // Additional iOS Safari scroll lock
        document.documentElement.style.overflow = 'hidden';
      } else {
        // Restore original styles and scroll position
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        
        // Restore scroll position if it was preserved
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    }
    
    // Cleanup on unmount to prevent style leaks
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
      }
    };
  }, [isMobileMenuOpen]);

  /**
   * Handle navigation link clicks
   * 
   * Provides smooth UX by closing mobile menu before navigation.
   * Uses client-side routing for better performance.
   * 
   * @param {React.MouseEvent<HTMLAnchorElement>} e - Click event
   * @param {string} path - Target route path
   */
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    // Close mobile menu before navigation for better UX
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
    
    router.push(path);
  };
  
  /**
   * Determine if a navigation item should be highlighted as active
   * 
   * Root path ('/') only matches exactly to prevent always being active.
   * Other paths use startsWith for matching nested routes.
   * 
   * @param {string} path - Path to check
   * @returns {boolean} Whether the path should be considered active
   * 
   * @example
   * isActive('/blog') returns true for '/blog', '/blog/post-1', etc.
   * isActive('/') returns true only for exact '/' match
   */
  const isActive = (path: string) => {
    // Root path requires exact match
    if (path === '/') {
      return pathname === '/';
    }
    
    // Other paths match if current pathname starts with the path
    return pathname.startsWith(path);
  };

  return {
    mounted,
    pathname,
    router,
    navRef,
    handleNavigation,
    isActive
  };
}; 