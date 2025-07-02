import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface UseNavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

interface UseNavigationReturn {
  mounted: boolean;
  pathname: string;
  router: ReturnType<typeof useRouter>;
  navRef: React.RefObject<HTMLElement | null>;
  handleNavigation: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  isActive: (path: string) => boolean;
}

export const useNavigation = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: UseNavigationProps): UseNavigationReturn => {
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const prevPathRef = useRef(pathname);
  const navRef = useRef<HTMLElement>(null);
  
  // Only use client-side state after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Close menu only when path changes - compare current and previous paths
  useEffect(() => {
    if (prevPathRef.current !== pathname && setIsMobileMenuOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    prevPathRef.current = pathname;
  }, [pathname, setIsMobileMenuOpen, isMobileMenuOpen]);
  
  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        // Store current scroll position
        const scrollY = window.scrollY;
        
        // Apply multiple scroll lock methods for better browser compatibility
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        
        // Also lock html element for iOS Safari
        document.documentElement.style.overflow = 'hidden';
      } else {
        // Restore scroll position and remove locks
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        
        // Restore scroll position
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    }
    
    // Restore scroll on component unmount
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

  // Client-side navigation handler
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    // Close mobile menu before page navigation
    if (setIsMobileMenuOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    router.push(path);
  };
  
  // Helper function to determine if a nav item should be active
  const isActive = (path: string) => {
    // Root path ('/') is active only when it exactly matches
    if (path === '/') {
      return pathname === '/';
    }
    
    // Other menu items check if the pathname starts with their path
    // Example: Components menu is active for all paths starting with '/components'
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